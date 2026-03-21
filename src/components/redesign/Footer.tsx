import { Link } from "react-router-dom";
import { type SiteLang, st } from "@/lib/site-i18n";
import logoWhite from "@/assets/logo-white.png";

interface FooterProps {
  lang: SiteLang;
}

export function Footer({ lang }: FooterProps) {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-surface-container-low py-16 px-8">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <Link to="/">
            <img src={logoWhite} alt="Casita Valencia" className="h-12 w-auto mb-4 brightness-0" />
          </Link>
          <p className="text-on-surface-variant text-sm leading-relaxed max-w-xs">
            {st("footer.tagline", lang)}
          </p>
        </div>
        <div>
          <h4 className="font-body font-semibold text-xs uppercase tracking-widest mb-4 text-primary">
            {st("footer.connect", lang)}
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:text-foreground transition-colors">
                {st("footer.instagram", lang)}
              </a>
            </li>
            <li>
              <Link to="/p/contact" className="text-on-surface-variant hover:text-foreground transition-colors">
                {st("footer.contactUs", lang)}
              </Link>
            </li>
            <li>
              <span className="text-on-surface-variant">{st("footer.newsletter", lang)}</span>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-body font-semibold text-xs uppercase tracking-widest mb-4 text-primary">
            {st("footer.location", lang)}
          </h4>
          <p className="text-sm text-on-surface-variant whitespace-pre-line">
            {st("footer.address", lang)}
          </p>
        </div>
      </div>
      <div className="max-w-screen-xl mx-auto mt-12 pt-8 border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
        <p>© {year} {st("footer.rights", lang)}</p>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1">
          <Link to="/privacy-policy" className="hover:text-foreground transition-colors">Privacybeleid</Link>
          <Link to="/terms-of-service" className="hover:text-foreground transition-colors">Algemene Voorwaarden</Link>
          <Link to="/data-deletion" className="hover:text-foreground transition-colors">Gegevens verwijderen</Link>
        </div>
      </div>
    </footer>
  );
}
