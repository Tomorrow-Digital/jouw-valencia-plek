import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

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
        <h1 className="font-serif text-3xl text-center mb-8">Casa Valencia</h1>
        <form onSubmit={handleSubmit} className="bg-card rounded-xl shadow-md p-6 space-y-4">
          <h2 className="font-serif text-xl mb-2">
            {mode === "login" ? "Admin Login" : "Account aanmaken"}
          </h2>
          {error && <p className="text-destructive text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}
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
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground rounded-lg py-2.5 font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Laden..." : mode === "login" ? "Inloggen" : "Registreren"}
          </button>
          <p className="text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>Nog geen account? <button type="button" onClick={() => { setMode("register"); setError(""); setSuccess(""); }} className="text-primary hover:underline">Registreren</button></>
            ) : (
              <>Al een account? <button type="button" onClick={() => { setMode("login"); setError(""); setSuccess(""); }} className="text-primary hover:underline">Inloggen</button></>
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