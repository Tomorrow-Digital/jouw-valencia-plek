import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function Register() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();

  const [validating, setValidating] = useState(true);
  const [valid, setValid] = useState(false);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setValidating(false);
      return;
    }
    supabase.functions
      .invoke("validate-invite", { method: "GET", body: undefined, headers: { "Content-Type": "application/json" } })
      .then(() => {
        // Use fetch directly for GET with query params
        fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/validate-invite?action=validate&token=${token}`,
          { headers: { "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } }
        )
          .then((r) => r.json())
          .then((data) => {
            setValid(data.valid === true);
            if (data.expires_at) setExpiresAt(data.expires_at);
            setValidating(false);
          })
          .catch(() => setValidating(false));
      })
      .catch(() => setValidating(false));
  }, [token]);

  // Simpler: just use fetch directly
  useEffect(() => {
    if (!token) { setValidating(false); return; }
    fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/validate-invite?action=validate&token=${token}`,
      { headers: { "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } }
    )
      .then((r) => r.json())
      .then((data) => {
        setValid(data.valid === true);
        if (data.expires_at) setExpiresAt(data.expires_at);
        setValidating(false);
      })
      .catch(() => setValidating(false));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!displayName.trim()) { setError("Vul je volledige naam in."); setLoading(false); return; }
    if (!phone || phone.length < 8) { setError("Vul een geldig telefoonnummer in (bijv. +31612345678)."); setLoading(false); return; }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) { setError(signUpError.message); setLoading(false); return; }

    if (signUpData.user) {
      // Save profile
      await supabase.from("profiles").upsert({
        id: signUpData.user.id,
        phone: phone.trim(),
        display_name: displayName.trim(),
      });

      // Mark token as used
      await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/validate-invite?action=use`,
        {
          method: "POST",
          headers: {
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, userId: signUpData.user.id }),
        }
      );
    }

    setSuccess(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-3xl text-center mb-8">Casita Valencia</h1>
        <div className="bg-card rounded-xl shadow-md p-6 space-y-4">
          {validating ? (
            <p className="text-center text-muted-foreground text-sm">Uitnodiging verifiëren...</p>
          ) : !token || !valid ? (
            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="font-serif text-xl">Ongeldige uitnodiging</h2>
              <p className="text-sm text-muted-foreground">
                Deze uitnodigingslink is ongeldig of verlopen. Vraag een nieuwe uitnodiging aan bij de beheerder.
              </p>
            </div>
          ) : success ? (
            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-serif text-xl">Account aangemaakt!</h2>
              <p className="text-sm text-muted-foreground">Je kunt nu inloggen met je e-mail en wachtwoord.</p>
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-primary text-primary-foreground rounded-lg py-2.5 font-medium hover:bg-primary/90 transition-colors mt-2"
              >
                Naar inloggen
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="font-serif text-xl">Account aanmaken</h2>
              <p className="text-sm text-muted-foreground">
                Je bent uitgenodigd als beheerder.
                {expiresAt && (
                  <> Deze link is geldig tot {new Date(expiresAt).toLocaleString("nl-NL", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}.</>
                )}
              </p>
              {error && <p className="text-destructive text-sm">{error}</p>}
              <div>
                <label className="block text-sm font-medium mb-1">Volledige naam *</label>
                <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Jan de Vries" className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">E-mail *</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Telefoonnummer (WhatsApp) *</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+31612345678" className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" required />
                <p className="text-xs text-muted-foreground mt-1">Inclusief landcode. Wordt gebruikt voor wachtwoordreset via WhatsApp.</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Wachtwoord *</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" required minLength={6} />
                <p className="text-xs text-muted-foreground mt-1">Minimaal 6 tekens.</p>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground rounded-lg py-2.5 font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
                {loading ? "Aanmaken..." : "Account aanmaken"}
              </button>
            </form>
          )}
        </div>
        <p className="text-center mt-4">
          <a href="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">← Naar inloggen</a>
        </p>
      </div>
    </div>
  );
}
