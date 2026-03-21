import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const VERIFY_TOKEN = Deno.env.get("WA_VERIFY_TOKEN") || "casita-valencia-webhook-verify";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Hub-Signature-256, authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // === WEBHOOK VERIFICATION (Meta sends GET on setup) ===
  if (req.method === "GET") {
    const url = new URL(req.url);
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("Webhook verified successfully");
      return new Response(challenge, { status: 200, headers: corsHeaders });
    }
    return new Response("Forbidden", { status: 403, headers: corsHeaders });
  }

  // === INCOMING MESSAGES (Meta sends POST) ===
  if (req.method === "POST") {
    try {
      const body = await req.json();

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      const entries = body?.entry || [];
      for (const entry of entries) {
        const changes = entry?.changes || [];
        for (const change of changes) {
          if (change.field !== "messages") continue;
          const value = change.value;

          // Status updates (sent, delivered, read)
          if (value.statuses) {
            for (const status of value.statuses) {
              const updateData: Record<string, unknown> = { status: status.status };
              if (status.status === "delivered") updateData.delivered_at = new Date().toISOString();
              if (status.status === "read") updateData.read_at = new Date().toISOString();

              await supabase
                .from("crm_messages")
                .update(updateData)
                .eq("wamid", status.id);
            }
          }

          // Incoming messages
          if (value.messages) {
            for (const msg of value.messages) {
              const contact = value.contacts?.[0];
              const senderPhone = msg.from;
              const senderName = contact?.profile?.name || senderPhone;

              // 1. Upsert guest
              const { data: guest } = await supabase
                .from("crm_guests")
                .upsert(
                  { phone_e164: `+${senderPhone}`, wa_id: senderPhone, name: senderName },
                  { onConflict: "phone_e164" }
                )
                .select("id")
                .single();

              if (!guest) continue;

              // 2. Find or create conversation
              let { data: conversation } = await supabase
                .from("crm_conversations")
                .select("id")
                .eq("guest_id", guest.id)
                .eq("status", "active")
                .single();

              if (!conversation) {
                const { data: newConv } = await supabase
                  .from("crm_conversations")
                  .insert({
                    guest_id: guest.id,
                    status: "active",
                    channel: "whatsapp",
                    csw_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                    last_message_at: new Date().toISOString(),
                    unread_count: 1,
                  })
                  .select("id")
                  .single();
                conversation = newConv;
              } else {
                await supabase
                  .from("crm_conversations")
                  .update({
                    csw_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                    last_message_at: new Date().toISOString(),
                  })
                  .eq("id", conversation.id);

                await supabase.rpc("increment_unread", { conv_id: conversation.id });
              }

              if (!conversation) continue;

              // 3. Extract message content
              let content = "";
              let messageType = msg.type || "text";
              let metadata: Record<string, unknown> = {};

              switch (messageType) {
                case "text":
                  content = msg.text?.body || "";
                  break;
                case "image":
                  content = msg.image?.caption || "[Afbeelding]";
                  metadata = { media_id: msg.image?.id, mime_type: msg.image?.mime_type };
                  break;
                case "document":
                  content = msg.document?.caption || msg.document?.filename || "[Document]";
                  metadata = { media_id: msg.document?.id, mime_type: msg.document?.mime_type, filename: msg.document?.filename };
                  break;
                case "audio":
                  content = "[Spraakbericht]";
                  metadata = { media_id: msg.audio?.id, mime_type: msg.audio?.mime_type };
                  break;
                case "video":
                  content = msg.video?.caption || "[Video]";
                  metadata = { media_id: msg.video?.id, mime_type: msg.video?.mime_type };
                  break;
                case "location":
                  content = `[Locatie: ${msg.location?.latitude}, ${msg.location?.longitude}]`;
                  metadata = { latitude: msg.location?.latitude, longitude: msg.location?.longitude, name: msg.location?.name, address: msg.location?.address };
                  break;
                case "interactive": {
                  const reply = msg.interactive?.list_reply || msg.interactive?.button_reply;
                  content = reply?.title || "[Interactief antwoord]";
                  metadata = { interactive_type: msg.interactive?.type, reply_id: reply?.id, reply_title: reply?.title };
                  messageType = "interactive";
                  break;
                }
                case "reaction":
                  content = msg.reaction?.emoji || "";
                  metadata = { reacted_message_id: msg.reaction?.message_id };
                  break;
                default:
                  content = `[${messageType}]`;
              }

              // 4. Insert message
              await supabase.from("crm_messages").insert({
                conversation_id: conversation.id,
                wamid: msg.id,
                direction: "inbound",
                message_type: messageType,
                content,
                metadata,
                status: "delivered",
                sent_at: new Date(parseInt(msg.timestamp) * 1000).toISOString(),
                delivered_at: new Date().toISOString(),
              });
            }
          }
        }
      }

      return new Response(JSON.stringify({ status: "ok" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Webhook error:", error);
      return new Response(JSON.stringify({ status: "error", message: String(error) }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

  return new Response("Method not allowed", { status: 405, headers: corsHeaders });
});
