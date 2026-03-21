import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Globe, Menu, X } from "lucide-react";
import { type SiteLang, st, saveSiteLang } from "@/lib/site-i18n";

interface NavbarProps {
  lang: SiteLang;
  onLangChange: (lang: SiteLang) => void;
}

const langs: SiteLang[] = ["nl", "en", "es"];
const langLabels: Record<SiteLang, string> = { nl: "Nederlands", en: "English", es: "Español" };

export function Navbar({ lang, onLangChange }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { to: "/rooms", label: st("nav.rooms", lang) },
    { to: "/surroundings", label: st("nav.surroundings", lang) },
    { to: "/booking", label: st("nav.pricing", lang) },
    { to: "/contact", label: st("nav.contact", lang) },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLang = (l: SiteLang) => {
    saveSiteLang(l);
    onLangChange(l);
    setLangOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm">
      <div className="flex justify-between items-center px-6 md:px-8 py-4 max-w-screen-2xl mx-auto">
        <Link to="/home" className="text-2xl font-serif italic text-foreground">
          Casita Valencia
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`font-serif tracking-wide text-sm uppercase transition-colors ${
                isActive(item.to)
                  ? "text-primary-container font-semibold border-b-2 border-primary-container pb-1"
                  : "text-on-surface-variant hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {/* Language switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 text-on-surface-variant hover:text-foreground transition-colors p-2"
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs font-medium uppercase">{lang}</span>
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-outline-variant/20 py-1 min-w-[140px]">
                {langs.map((l) => (
                  <button
                    key={l}
                    onClick={() => handleLang(l)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-surface-container-low transition-colors ${
                      l === lang ? "text-primary font-medium" : "text-foreground"
                    }`}
                  >
                    {langLabels[l]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/booking"
            className="bg-primary-container text-white px-6 py-2.5 rounded-full font-body text-sm font-semibold tracking-wide hover:opacity-80 transition-opacity active:scale-95"
          >
            {st("nav.bookNow", lang)}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-outline-variant/20 px-6 py-6 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={`block font-serif text-lg ${
                isActive(item.to) ? "text-primary-container font-semibold" : "text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-4 border-t border-outline-variant/20">
            {langs.map((l) => (
              <button
                key={l}
                onClick={() => { handleLang(l); setMobileOpen(false); }}
                className={`px-3 py-1.5 rounded-full text-sm ${
                  l === lang ? "bg-primary text-white" : "bg-surface-container-low text-foreground"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <Link
            to="/booking"
            onClick={() => setMobileOpen(false)}
            className="block text-center bg-primary-container text-white px-6 py-3 rounded-full font-semibold"
          >
            {st("nav.bookNow", lang)}
          </Link>
        </div>
      )}
    </nav>
  );
}
