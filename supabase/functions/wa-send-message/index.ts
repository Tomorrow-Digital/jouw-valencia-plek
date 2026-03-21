import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseUser.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const body = await req.json();
    const { to, type, content, template_name, template_language, template_variables, message_id } = body;

    const { data: waConfig } = await supabase
      .from("integration_configs")
      .select("config")
      .eq("integration_type", "whatsapp")
      .single();

    if (!waConfig?.config?.phone_number_id || !waConfig?.config?.access_token) {
      return new Response(
        JSON.stringify({ error: "WhatsApp niet geconfigureerd" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { phone_number_id, access_token } = waConfig.config;
    const apiUrl = `https://graph.facebook.com/v23.0/${phone_number_id}/messages`;

    const waBody: Record<string, unknown> = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to.replace("+", ""),
    };

    if (type === "template") {
      waBody.type = "template";
      const templateObj: Record<string, unknown> = {
        name: template_name,
        language: { code: template_language || "nl" },
      };
      if (template_variables && template_variables.length > 0) {
        templateObj.components = [{
          type: "body",
          parameters: template_variables.map((v: string) => ({ type: "text", text: v })),
        }];
      }
      waBody.template = templateObj;
    } else {
      waBody.type = "text";
      waBody.text = { preview_url: true, body: content };
    }

    const waResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(waBody),
    });

    const waResult = await waResponse.json();

    if (!waResponse.ok) {
      if (message_id) {
        await supabase
          .from("crm_messages")
          .update({ status: "failed", metadata: { error: waResult } })
          .eq("id", message_id);
      }
      return new Response(
        JSON.stringify({ error: "WhatsApp API fout", details: waResult }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const wamid = waResult?.messages?.[0]?.id;
    if (message_id && wamid) {
      await supabase
        .from("crm_messages")
        .update({ status: "sent", wamid })
        .eq("id", message_id);
    }

    return new Response(
      JSON.stringify({ success: true, wamid }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Send message error:", error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
