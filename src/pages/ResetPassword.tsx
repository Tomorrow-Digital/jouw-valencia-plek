import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for the recovery event from the URL hash
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setSessionReady(true);
      }
    });

    // Also check if we already have a session (user clicked link)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setSessionReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Wachtwoord moet minimaal 6 tekens bevatten.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Wachtwoorden komen niet overeen.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => navigate("/admin"), 2000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-3xl text-center mb-8">Casita Valencia</h1>
        <div className="bg-card rounded-xl shadow-md p-6 space-y-4">
          {success ? (
            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-serif text-xl">Wachtwoord gewijzigd</h2>
              <p className="text-sm text-muted-foreground">Je wordt doorgestuurd naar het admin-paneel...</p>
            </div>
          ) : !sessionReady ? (
            <div className="text-center space-y-3">
              <h2 className="font-serif text-xl">Wachtwoord herstellen</h2>
              <p className="text-sm text-muted-foreground">
                De reset-link wordt geverifieerd...
              </p>
              <p className="text-xs text-muted-foreground">
                Als je hier via een link bent gekomen, wacht even tot de sessie is geladen.
                Werkt het niet? Vraag een nieuwe reset-link aan.
              </p>
              <a href="/login" className="text-sm text-primary hover:underline">
                ← Terug naar login
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="font-serif text-xl">Nieuw wachtwoord instellen</h2>
              {error && <p className="text-destructive text-sm">{error}</p>}
              <div>
                <label className="block text-sm font-medium mb-1">Nieuw wachtwoord</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                  minLength={6}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bevestig wachtwoord</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? "Opslaan..." : "Wachtwoord wijzigen"}
              </button>
            </form>
          )}
        </div>
        <p className="text-center mt-4">
          <a href="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← Terug naar login
          </a>
        </p>
      </div>
    </div>
  );
}
