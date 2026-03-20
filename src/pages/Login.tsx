import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (mode === "forgot") {
      try {
        const { data, error } = await supabase.functions.invoke("request-password-reset", {
          body: { email },
        });
        if (error) throw error;
        if (data?.method === "whatsapp") {
          setSuccess("Er is een reset-link verstuurd via WhatsApp naar het telefoonnummer dat bij dit account hoort.");
        } else {
          setSuccess("Als dit e-mailadres bij ons bekend is, ontvang je een reset-link via e-mail of WhatsApp.");
        }
      } catch {
        setSuccess("Als dit e-mailadres bij ons bekend is, ontvang je een reset-link via e-mail of WhatsApp.");
      }
      setLoading(false);
      return;
    }

    if (mode === "register") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Account aangemaakt! Je kunt nu inloggen.");
        setMode("login");
      }
      setLoading(false);
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        navigate("/admin");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-3xl text-center mb-8">Casita Valencia</h1>
        <form onSubmit={handleSubmit} className="bg-card rounded-xl shadow-md p-6 space-y-4">
          <h2 className="font-serif text-xl mb-2">
            {mode === "login" ? "Admin Login" : mode === "register" ? "Account aanmaken" : "Wachtwoord vergeten"}
          </h2>
          {mode === "forgot" && (
            <p className="text-sm text-muted-foreground">
              Vul je e-mailadres in. Als er een telefoonnummer aan je account gekoppeld is, ontvang je de reset-link via WhatsApp. Anders via e-mail.
            </p>
          )}
          {error && <p className="text-destructive text-sm">{error}</p>}
          {success && <p className="text-sm" style={{ color: "hsl(var(--primary))" }}>{success}</p>}
          <div>
            <label className="block text-sm font-medium mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
          {mode !== "forgot" && (
            <div>
              <label className="block text-sm font-medium mb-1">Wachtwoord</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                required
                minLength={6}
              />
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground rounded-lg py-2.5 font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading
              ? "Laden..."
              : mode === "login"
              ? "Inloggen"
              : mode === "register"
              ? "Registreren"
              : "Verstuur reset-link"}
          </button>

          {mode === "login" && (
            <button
              type="button"
              onClick={() => { setMode("forgot"); setError(""); setSuccess(""); }}
              className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Wachtwoord vergeten?
            </button>
          )}

          <p className="text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>Nog geen account? <button type="button" onClick={() => { setMode("register"); setError(""); setSuccess(""); }} className="text-primary hover:underline">Registreren</button></>
            ) : (
              <button type="button" onClick={() => { setMode("login"); setError(""); setSuccess(""); }} className="text-primary hover:underline">
                ← Terug naar inloggen
              </button>
            )}
          </p>
        </form>
        <p className="text-center mt-4">
          <a href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">← Terug naar website</a>
        </p>
      </div>
    </div>
  );
}