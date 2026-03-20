import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    if (!email) {
      return new Response(JSON.stringify({ error: "E-mailadres is verplicht" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // 1. Find the user by email
    const { data: usersData, error: listError } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
    if (listError) throw listError;

    const user = usersData.users.find((u) => u.email === email);
    if (!user) {
      // Don't reveal if user exists or not
      return new Response(JSON.stringify({ success: true, method: "none" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Generate a password reset link
    const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
      type: "recovery",
      email,
      options: {
        redirectTo: `${req.headers.get("origin") || "https://casitavalencia.nl"}/reset-password`,
      },
    });
    if (linkError) throw linkError;

    // Build the redirect URL with the token hash
    const resetUrl = `${req.headers.get("origin") || "https://casitavalencia.nl"}/reset-password#access_token=${linkData.properties?.access_token}&type=recovery`;

    // 3. Check if user has a phone number in profiles
    const { data: profile } = await adminClient
      .from("profiles")
      .select("phone, display_name")
      .eq("id", user.id)
      .single();

    const hasPhone = profile?.phone && profile.phone.length > 5;

    // 4. Send to n8n webhook
    const n8nWebhookUrl = Deno.env.get("N8N_PASSWORD_RESET_WEBHOOK_URL");

    if (n8nWebhookUrl) {
      const payload = {
        email,
        name: profile?.display_name || email,
        phone: hasPhone ? profile.phone : null,
        reset_url: resetUrl,
        method: hasPhone ? "whatsapp" : "email",
        timestamp: new Date().toISOString(),
      };

      const n8nResponse = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!n8nResponse.ok) {
        console.error("n8n webhook failed:", await n8nResponse.text());
        throw new Error("Kon het wachtwoord reset verzoek niet versturen.");
      }
    } else {
      // Fallback: use Supabase's built-in email reset
      await adminClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${req.headers.get("origin") || "https://casitavalencia.nl"}/reset-password`,
      });
    }

    return new Response(
      JSON.stringify({ success: true, method: hasPhone && n8nWebhookUrl ? "whatsapp" : "email" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Password reset error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
