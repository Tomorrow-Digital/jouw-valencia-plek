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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const url = new URL(req.url);
    const action = url.searchParams.get("action") || "validate";

    // Validate a token (no auth required — used on the register page)
    if (req.method === "GET" && action === "validate") {
      const token = url.searchParams.get("token");
      if (!token) {
        return new Response(JSON.stringify({ valid: false, error: "Token ontbreekt" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data, error } = await adminClient
        .from("invite_tokens")
        .select("*")
        .eq("token", token)
        .is("used_at", null)
        .gt("expires_at", new Date().toISOString())
        .single();

      if (error || !data) {
        return new Response(JSON.stringify({ valid: false, error: "Ongeldige of verlopen uitnodiging" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ valid: true, expires_at: data.expires_at }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Mark token as used after registration (no auth — called right after signup)
    if (req.method === "POST" && action === "use") {
      const { token, userId } = await req.json();
      if (!token || !userId) {
        return new Response(JSON.stringify({ error: "Token en userId zijn verplicht" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data, error } = await adminClient
        .from("invite_tokens")
        .update({ used_at: new Date().toISOString(), used_by: userId })
        .eq("token", token)
        .is("used_at", null)
        .gt("expires_at", new Date().toISOString())
        .select()
        .single();

      if (error || !data) {
        return new Response(JSON.stringify({ error: "Token ongeldig of al gebruikt" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Ongeldige actie" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
