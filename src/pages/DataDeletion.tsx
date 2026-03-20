import { useState, useEffect, useRef, forwardRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Trash2,
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Mail,
  ChevronUp,
  Home,
  ChevronRight,
  ArrowLeft,
  Send,
  Loader2,
  XCircle,
  Info,
  Lock,
  Eye,
  Database,
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

const LAST_UPDATED = "20 maart 2025";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: EASE } },
};

const N8N_WEBHOOK_URL = import.meta.env.VITE_DELETION_WEBHOOK_URL || "[N8N_WEBHOOK_URL]";
const N8N_STATUS_URL = import.meta.env.VITE_DELETION_STATUS_URL || "[N8N_STATUS_WEBHOOK_URL]";

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

type RequestType = "delete_all" | "delete_specific" | "data_access";

interface FormData {
  name: string;
  email: string;
  phone: string;
  request_type: RequestType;
  details: string;
  confirmed: boolean;
}

interface StatusResponse {
  status: "pending" | "processing" | "completed" | "email_sent" | "verified";
  confirmation_code: string;
  created_at: string;
  completed_at: string | null;
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

const DataDeletion = () => {
  const [searchParams] = useSearchParams();
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Query params
  const statusParam = searchParams.get("status");
  const idParam = searchParams.get("id");
  const codeParam = searchParams.get("code");

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    request_type: "delete_all",
    details: "",
    confirmed: false,
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  // Status check state (Meta callback)
  const [statusData, setStatusData] = useState<StatusResponse | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState(false);

  const confirmRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Gegevens verwijderen | Casita Valencia";
    const metaDesc = document.querySelector('meta[name="description"]');
    const originalDesc = metaDesc?.getAttribute("content") || "";
    if (metaDesc)
      metaDesc.setAttribute(
        "content",
        "Vraag verwijdering van uw persoonsgegevens aan bij Casita Valencia. Wij verwerken uw verzoek conform de AVG/GDPR binnen 30 dagen.",
      );
    return () => {
      document.title = "Casa Valencia — Jouw eigen plek in Valencia";
      if (metaDesc) metaDesc.setAttribute("content", originalDesc);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Status check for Meta callback
  useEffect(() => {
    if (idParam && codeParam) {
      setStatusLoading(true);
      fetch(`${N8N_STATUS_URL}?id=${encodeURIComponent(idParam)}&code=${encodeURIComponent(codeParam)}`)
        .then((res) => {
          if (!res.ok) throw new Error("Not found");
          return res.json();
        })
        .then((data) => {
          setStatusData(data);
          setStatusLoading(false);
        })
        .catch(() => {
          setStatusError(true);
          setStatusLoading(false);
        });
    }
  }, [idParam, codeParam]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // ─── VALIDATION ───
  const validate = (): boolean => {
    const errors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.name.trim()) errors.name = "Vul uw volledige naam in.";
    if (!formData.email.trim()) errors.email = "Vul een geldig e-mailadres in.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Dit e-mailadres is niet geldig.";
    if (!formData.confirmed) errors.confirmed = "U dient de bevestiging aan te vinken.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ─── SUBMIT ───
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || cooldown) return;

    setSubmitting(true);
    setSubmitError(false);

    try {
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          request_type: formData.request_type,
          details: formData.details.trim() || undefined,
          source: "casitavalencia.nl",
          submitted_at: new Date().toISOString(),
          language: "nl",
        }),
      });

      if (!res.ok) throw new Error("Failed");

      setSubmitted(true);
      setCooldown(true);
      setTimeout(() => {
        confirmRef.current?.focus();
      }, 100);
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── RENDER: STATUS CHECK (Meta callback) ───
  if (idParam && codeParam) {
    return (
      <PageShell showBackToTop={showBackToTop} scrollToTop={scrollToTop}>
        <div className="max-w-[720px] mx-auto py-16 px-4">
          {statusLoading && (
            <div className="text-center py-20">
              <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Status ophalen…</p>
            </div>
          )}

          {statusError && (
            <StatusCard
              icon={<AlertTriangle className="w-10 h-10 text-destructive" />}
              title="Verzoek niet gevonden"
              description="Wij konden geen verwijderingsverzoek vinden met deze gegevens. Als u denkt dat dit een fout is, neem dan contact met ons op via info@casitavalencia.nl."
            />
          )}

          {statusData && (statusData.status === "pending" || statusData.status === "processing" || statusData.status === "email_sent" || statusData.status === "verified") && (
            <StatusCard
              icon={<Clock className="w-10 h-10 text-primary" />}
              title="Uw verwijderingsverzoek wordt verwerkt"
              description="Wij hebben uw verzoek ontvangen en zijn bezig met het verwijderen van uw gegevens. Dit kan tot 30 dagen duren."
            >
              <div className="mt-6 bg-muted/50 rounded-xl p-5 space-y-2 text-sm">
                <p><strong className="text-foreground">Bevestigingscode:</strong> {statusData.confirmation_code}</p>
                <p><strong className="text-foreground">Datum verzoek:</strong> {new Date(statusData.created_at).toLocaleDateString("nl-NL", { year: "numeric", month: "long", day: "numeric" })}</p>
              </div>
            </StatusCard>
          )}

          {statusData && statusData.status === "completed" && (
            <StatusCard
              icon={<CheckCircle2 className="w-10 h-10 text-secondary" />}
              title="Uw gegevens zijn verwijderd"
              description={`Uw verwijderingsverzoek is volledig verwerkt${statusData.completed_at ? ` op ${new Date(statusData.completed_at).toLocaleDateString("nl-NL", { year: "numeric", month: "long", day: "numeric" })}` : ""}. Alle persoonsgegevens die niet onder een wettelijke bewaarplicht vallen, zijn verwijderd.`}
            >
              <div className="mt-6 bg-muted/50 rounded-xl p-5 space-y-2 text-sm">
                <p><strong className="text-foreground">Bevestigingscode:</strong> {statusData.confirmation_code}</p>
              </div>
            </StatusCard>
          )}

          <div className="text-center mt-8">
            <Link to="/" className="text-primary hover:underline text-sm font-medium">← Terug naar de homepage</Link>
          </div>
        </div>
      </PageShell>
    );
  }

  // ─── RENDER: POST-VERIFICATION CONFIRMED ───
  if (statusParam === "confirmed") {
    return (
      <PageShell showBackToTop={showBackToTop} scrollToTop={scrollToTop}>
        <div className="max-w-[720px] mx-auto py-16 px-4">
          <StatusCard
            icon={<CheckCircle2 className="w-10 h-10 text-secondary" />}
            title="Uw gegevens zijn verwijderd"
            description="Uw verwijderingsverzoek is verwerkt. Alle persoonsgegevens die niet onder een wettelijke bewaarplicht vallen, zijn verwijderd uit onze systemen. U ontvangt hiervan ook een bevestiging per e-mail."
          />
          <div className="text-center mt-8">
            <Link to="/" className="text-primary hover:underline text-sm font-medium">← Terug naar de homepage</Link>
          </div>
        </div>
      </PageShell>
    );
  }

  // ─── RENDER: MAIN PAGE ───
  return (
    <PageShell showBackToTop={showBackToTop} scrollToTop={scrollToTop}>
      <div id="deletion-content" className="max-w-[720px] mx-auto px-4 sm:px-6 py-10 md:py-14 pb-24">
        {/* ─── INTRO ─── */}
        <motion.section className="mb-12" initial="hidden" animate="visible" variants={fadeUp}>
          <p className="text-muted-foreground leading-relaxed">
            Casita Valencia neemt de privacy van haar gasten serieus. Conform de Algemene Verordening Gegevensbescherming
            (AVG/GDPR), in het bijzonder Artikelen 17 en 21, heeft u het recht om uw persoonsgegevens te laten verwijderen.
            Wij verwerken uw verzoek binnen <strong className="text-foreground">30 dagen</strong>.
          </p>
        </motion.section>

        {/* ─── INFO CARDS ─── */}
        <motion.div
          className="grid gap-5 sm:grid-cols-2 mb-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } }, hidden: {} }}
        >
          <motion.div variants={fadeUp}>
            <InfoCard icon={<Database className="w-5 h-5" />} title="Wat wordt verwijderd">
              <ul className="space-y-1.5 text-sm">
                <li>• Boekingsgegevens (naam, e-mail, telefoon, reisdata)</li>
                <li>• Contactformulier-berichten</li>
                <li>• WhatsApp-gespreksnotities</li>
                <li>• Geanonimiseerde analytics vallen buiten het verzoek</li>
              </ul>
            </InfoCard>
          </motion.div>

          <motion.div variants={fadeUp}>
            <InfoCard icon={<AlertTriangle className="w-5 h-5" />} title="Wat NIET kan worden verwijderd" variant="warning">
              <ul className="space-y-1.5 text-sm">
                <li>• <strong>Financiële administratie</strong> — facturen en betalingsgegevens moeten conform Spaans en Nederlands belastingrecht 7 jaar bewaard blijven</li>
                <li>• Gegevens benodigd voor lopende juridische verplichtingen</li>
              </ul>
            </InfoCard>
          </motion.div>
        </motion.div>

        {/* ─── PROCESS STEPPER ─── */}
        <motion.section
          className="mb-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
        >
          <h2 className="font-serif text-xl md:text-2xl text-foreground mb-6 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <Info className="w-5 h-5" />
            </div>
            Hoe het proces werkt
          </h2>

          <div className="relative pl-8 space-y-8">
            {/* Vertical line */}
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />

            {[
              { step: 1, title: "Formulier invullen", desc: "Vul het onderstaande formulier in met uw gegevens.", icon: <FileText className="w-4 h-4" /> },
              { step: 2, title: "Verificatie-e-mail", desc: "U ontvangt een e-mail om uw identiteit te bevestigen.", icon: <Mail className="w-4 h-4" /> },
              { step: 3, title: "Verwerking", desc: "Na bevestiging verwerken wij uw verzoek binnen 30 dagen.", icon: <Clock className="w-4 h-4" /> },
              { step: 4, title: "Bevestiging", desc: "U ontvangt een bevestiging wanneer uw gegevens zijn verwijderd.", icon: <CheckCircle2 className="w-4 h-4" /> },
            ].map((s) => (
              <div key={s.step} className="relative flex gap-4">
                <div className="absolute -left-8 w-[30px] h-[30px] rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center text-primary flex-shrink-0 z-10">
                  {s.icon}
                </div>
                <div className="pt-0.5">
                  <p className="font-semibold text-foreground text-sm">{s.step}. {s.title}</p>
                  <p className="text-muted-foreground text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ─── FORM OR CONFIRMATION ─── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeUp}
        >
          <h2 className="font-serif text-xl md:text-2xl text-foreground mb-2 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            Verwijderingsverzoek indienen
          </h2>
          <p className="text-muted-foreground text-sm mb-6 ml-12">
            Alle velden met een <span className="text-destructive">*</span> zijn verplicht.
          </p>

          {submitted ? (
            <div ref={confirmRef} tabIndex={-1} className="bg-secondary/10 border border-secondary/30 rounded-xl p-8 text-center outline-none">
              <CheckCircle2 className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-serif text-foreground mb-2">Uw verzoek is ontvangen</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Wij hebben uw verwijderingsverzoek ontvangen. U ontvangt binnen enkele minuten een verificatie-e-mail op{" "}
                <strong className="text-foreground">{formData.email}</strong>. Klik op de link in die e-mail om uw verzoek te bevestigen.
                Zonder bevestiging wordt het verzoek niet verwerkt.
              </p>
              <p className="text-sm text-muted-foreground">
                Controleer ook uw spam-map. Heeft u na 15 minuten geen e-mail ontvangen? Neem contact met ons op via{" "}
                <a href="mailto:info@casitavalencia.nl" className="text-primary hover:underline">info@casitavalencia.nl</a>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-muted/30 border border-border rounded-xl p-6 sm:p-8 space-y-6" noValidate>
              {/* Trust indicator */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-primary/5 rounded-lg px-3 py-2">
                <Lock className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span>Uw verzoek wordt versleuteld verstuurd. Wij verwerken uw gegevens conform de AVG/GDPR.</span>
              </div>

              {/* Name */}
              <div>
                <Label htmlFor="del-name" className="text-foreground">
                  Volledige naam <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="del-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={cn("mt-1.5", formErrors.name && "border-destructive")}
                  placeholder="Uw voor- en achternaam"
                  aria-invalid={!!formErrors.name}
                  aria-describedby={formErrors.name ? "del-name-error" : undefined}
                  maxLength={100}
                />
                {formErrors.name && <p id="del-name-error" className="text-destructive text-xs mt-1" role="alert">{formErrors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="del-email" className="text-foreground">
                  E-mailadres <span className="text-destructive">*</span>
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">Het e-mailadres waarmee u heeft geboekt of contact opgenomen.</p>
                <Input
                  id="del-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={cn("mt-1.5", formErrors.email && "border-destructive")}
                  placeholder="uw@email.nl"
                  aria-invalid={!!formErrors.email}
                  aria-describedby={formErrors.email ? "del-email-error" : undefined}
                  maxLength={255}
                />
                {formErrors.email && <p id="del-email-error" className="text-destructive text-xs mt-1" role="alert">{formErrors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="del-phone" className="text-foreground">Telefoonnummer</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Optioneel — helpt bij het vinden van WhatsApp-gerelateerde data.</p>
                <Input
                  id="del-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1.5"
                  placeholder="+31 6 12345678"
                  maxLength={20}
                />
              </div>

              {/* Request type */}
              <div>
                <Label className="text-foreground">
                  Type verzoek <span className="text-destructive">*</span>
                </Label>
                <div className="mt-2 space-y-2">
                  {[
                    { value: "delete_all" as RequestType, label: "Verwijder al mijn gegevens" },
                    { value: "delete_specific" as RequestType, label: "Verwijder specifieke gegevens" },
                    { value: "data_access" as RequestType, label: "Ik wil weten welke gegevens u van mij heeft (inzageverzoek)" },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                        formData.request_type === opt.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/40",
                      )}
                    >
                      <input
                        type="radio"
                        name="request_type"
                        value={opt.value}
                        checked={formData.request_type === opt.value}
                        onChange={() => setFormData({ ...formData, request_type: opt.value })}
                        className="accent-primary w-4 h-4"
                      />
                      <span className="text-sm text-foreground">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div>
                <Label htmlFor="del-details" className="text-foreground">Toelichting</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Optioneel — ruimte voor specifieke wensen of verduidelijking.</p>
                <Textarea
                  id="del-details"
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="mt-1.5 min-h-[100px]"
                  placeholder="Bijvoorbeeld: verwijder alleen mijn boeking van juni 2024…"
                  maxLength={1000}
                />
              </div>

              {/* Confirmation checkbox */}
              <div>
                <label className={cn(
                  "flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors",
                  formErrors.confirmed ? "border-destructive bg-destructive/5" : "border-border hover:bg-muted/40",
                )}>
                  <Checkbox
                    checked={formData.confirmed}
                    onCheckedChange={(c) => setFormData({ ...formData, confirmed: c === true })}
                    className="mt-0.5"
                    aria-invalid={!!formErrors.confirmed}
                    aria-describedby={formErrors.confirmed ? "del-confirm-error" : undefined}
                  />
                  <span className="text-sm text-foreground leading-relaxed">
                    Ik begrijp dat dit verzoek onomkeerbaar is en dat bepaalde gegevens op grond van wettelijke verplichtingen bewaard moeten blijven. <span className="text-destructive">*</span>
                  </span>
                </label>
                {formErrors.confirmed && <p id="del-confirm-error" className="text-destructive text-xs mt-1" role="alert">{formErrors.confirmed}</p>}
              </div>

              {/* Submit error */}
              {submitError && (
                <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Er is iets misgegaan</p>
                    <p className="text-sm text-muted-foreground">
                      Probeer het opnieuw of neem contact op via{" "}
                      <a href="mailto:info@casitavalencia.nl" className="text-primary hover:underline">info@casitavalencia.nl</a>.
                    </p>
                  </div>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={submitting || cooldown}
                className="w-full sm:w-auto active:scale-[0.97] transition-transform"
                size="lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Versturen…
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Verzoek indienen
                  </>
                )}
              </Button>
            </form>
          )}
        </motion.section>

        {/* ─── CROSS-LINKS ─── */}
        <motion.section
          className="mt-14 bg-muted/40 rounded-xl p-6 sm:p-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
        >
          <h2 className="font-serif text-lg text-foreground mb-3">Heeft u vragen?</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            Neem gerust contact met ons op via{" "}
            <a href="mailto:info@casitavalencia.nl" className="text-primary hover:underline font-medium">info@casitavalencia.nl</a>.
            Lees ook ons{" "}
            <Link to="/privacy-policy" className="text-primary hover:underline font-medium">Privacybeleid</Link>
            {" "}en onze{" "}
            <Link to="/terms-of-service" className="text-primary hover:underline font-medium">Algemene Voorwaarden</Link>.
          </p>
        </motion.section>
      </div>
    </PageShell>
  );
};

// ═══════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════

const PageShell = ({ children, showBackToTop, scrollToTop }: { children: React.ReactNode; showBackToTop: boolean; scrollToTop: () => void }) => (
  <div className="min-h-screen bg-background" lang="nl">
    <a
      href="#deletion-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
    >
      Ga naar inhoud
    </a>

    {/* Header */}
    <header className="bg-background border-b border-border sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="font-serif text-lg">Casita Valencia</span>
        </Link>
      </div>
    </header>

    {/* Hero */}
    <motion.div className="bg-muted/40 border-b border-border" initial="hidden" animate="visible" variants={fadeUp}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <li>
              <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
                <Home className="w-3.5 h-3.5" />
                Home
              </Link>
            </li>
            <li><ChevronRight className="w-3.5 h-3.5" /></li>
            <li className="text-foreground font-medium">Gegevens verwijderen</li>
          </ol>
        </nav>
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex w-12 h-12 rounded-xl bg-primary/10 items-center justify-center flex-shrink-0 mt-1">
            <Trash2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-serif text-foreground leading-tight">Gegevens verwijderen</h1>
            <p className="mt-2 text-muted-foreground">Dien een verzoek in om uw persoonsgegevens te laten verwijderen</p>
          </div>
        </div>
      </div>
    </motion.div>

    {children}

    {/* Back to top */}
    {showBackToTop && (
      <motion.button
        onClick={scrollToTop}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed bottom-6 right-6 w-10 h-10 bg-foreground text-background rounded-full shadow-lg flex items-center justify-center hover:bg-foreground/90 active:scale-95 transition-all z-30"
        aria-label="Terug naar boven"
      >
        <ChevronUp className="w-5 h-5" />
      </motion.button>
    )}
  </div>
);

const StatusCard = ({ icon, title, description, children }: { icon: React.ReactNode; title: string; description: string; children?: React.ReactNode }) => (
  <motion.div
    className="bg-muted/30 border border-border rounded-xl p-8 text-center"
    initial="hidden"
    animate="visible"
    variants={fadeUp}
  >
    <div className="flex justify-center mb-4">{icon}</div>
    <h2 className="text-xl font-serif text-foreground mb-2">{title}</h2>
    <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">{description}</p>
    {children}
  </motion.div>
);

const InfoCard = ({ icon, title, children, variant = "info" }: { icon: React.ReactNode; title: string; children: React.ReactNode; variant?: "info" | "warning" }) => (
  <div className={cn(
    "rounded-xl p-5 border h-full",
    variant === "warning"
      ? "bg-destructive/5 border-destructive/20"
      : "bg-primary/5 border-primary/15",
  )}>
    <div className="flex items-center gap-2 mb-3">
      <div className={cn("text-sm", variant === "warning" ? "text-destructive" : "text-primary")}>{icon}</div>
      <h3 className="font-semibold text-foreground text-sm">{title}</h3>
    </div>
    <div className="text-muted-foreground">{children}</div>
  </div>
);

export default DataDeletion;
