import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface BookingPayload {
  firstName: string;
  lastName: string;
  email: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number | null;
  arrivalTime: string | null;
  message: string | null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: BookingPayload = await req.json();
    const { firstName, lastName, email, checkIn, checkOut, guests, totalPrice, arrivalTime, message } = payload;

    if (!email || !firstName || !checkIn || !checkOut) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const formatDate = (d: string) => {
      const date = new Date(d);
      return date.toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
    };

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:Georgia,'Times New Roman',serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
    <div style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
      <div style="background:#c0785c;padding:32px 28px;text-align:center;">
        <h1 style="color:#f5f0eb;margin:0;font-size:24px;font-weight:600;">Bedankt voor je boeking!</h1>
      </div>
      <div style="padding:28px;">
        <p style="color:#2e2e2e;font-size:16px;line-height:1.6;">
          Hoi ${firstName},
        </p>
        <p style="color:#2e2e2e;font-size:16px;line-height:1.6;">
          We hebben je boeking ontvangen. Hieronder de details:
        </p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0;">
          <tr>
            <td style="padding:8px 0;color:#666;font-size:14px;">Check-in</td>
            <td style="padding:8px 0;color:#2e2e2e;font-size:14px;text-align:right;font-weight:600;">${formatDate(checkIn)}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#666;font-size:14px;">Check-out</td>
            <td style="padding:8px 0;color:#2e2e2e;font-size:14px;text-align:right;font-weight:600;">${formatDate(checkOut)}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#666;font-size:14px;">Gasten</td>
            <td style="padding:8px 0;color:#2e2e2e;font-size:14px;text-align:right;font-weight:600;">${guests}</td>
          </tr>
          ${arrivalTime ? `<tr>
            <td style="padding:8px 0;color:#666;font-size:14px;">Aankomsttijd</td>
            <td style="padding:8px 0;color:#2e2e2e;font-size:14px;text-align:right;font-weight:600;">${arrivalTime}</td>
          </tr>` : ""}
          ${totalPrice ? `<tr>
            <td style="padding:12px 0 8px;color:#666;font-size:14px;border-top:1px solid #eee;">Totaalprijs</td>
            <td style="padding:12px 0 8px;color:#c0785c;font-size:18px;text-align:right;font-weight:700;border-top:1px solid #eee;">€${totalPrice}</td>
          </tr>` : ""}
        </table>
        ${message ? `<div style="background:#f5f0eb;border-radius:8px;padding:16px;margin:16px 0;">
          <p style="margin:0;color:#666;font-size:13px;">Jouw bericht:</p>
          <p style="margin:8px 0 0;color:#2e2e2e;font-size:14px;line-height:1.5;">${message}</p>
        </div>` : ""}
        <p style="color:#2e2e2e;font-size:16px;line-height:1.6;margin-top:24px;">
          Je ontvangt binnen 24 uur een bevestiging met betaalinstructies van ons.
        </p>
        <p style="color:#2e2e2e;font-size:16px;line-height:1.6;">
          Tot snel in Valencia! ☀️<br/>
          <strong>Charmaine</strong>
        </p>
      </div>
      <div style="background:#f5f0eb;padding:20px 28px;text-align:center;">
        <p style="margin:0;color:#999;font-size:12px;">Casa Valencia · Torrent, Valencia</p>
      </div>
    </div>
  </div>
</body>
</html>`;

    // Use Lovable API to send email
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const projectId = SUPABASE_URL.replace("https://", "").replace(".supabase.co", "");

    const emailRes = await fetch(`https://api.lovable.dev/api/v1/email/${projectId}/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        to: email,
        subject: `Boekingsbevestiging – ${formatDate(checkIn)} t/m ${formatDate(checkOut)}`,
        html,
      }),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      console.error("Email send failed:", errText);
      // Don't fail the booking — email is best-effort
      return new Response(JSON.stringify({ success: true, emailSent: false, error: errText }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await emailRes.text();

    return new Response(JSON.stringify({ success: true, emailSent: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ success: true, emailSent: false, error: String(err) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
