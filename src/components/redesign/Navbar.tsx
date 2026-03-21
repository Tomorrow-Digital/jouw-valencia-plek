import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { type SiteLang, st, saveSiteLang } from "@/lib/site-i18n";
import logoColor from "@/assets/logo-color.png";
import logoWhite from "@/assets/logo-white.png";
import flagNl from "@/assets/flag-nl.svg";
import flagEn from "@/assets/flag-en.svg";
import flagEs from "@/assets/flag-es.svg";

interface NavbarProps {
  lang: SiteLang;
  onLangChange: (lang: SiteLang) => void;
  static?: boolean;
  previewViewport?: "desktop" | "tablet" | "mobile";
}

const langs: SiteLang[] = ["nl", "en", "es"];
const langLabels: Record<SiteLang, string> = { nl: "Nederlands", en: "English", es: "Español" };
const flagMap: Record<SiteLang, string> = { nl: flagNl, en: flagEn, es: flagEs };

export function Navbar({ lang, onLangChange, static: isStatic, previewViewport }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === "/" || location.pathname === "/home";
  const isForcedViewport = Boolean(previewViewport);
  const isSmallViewport = previewViewport === "tablet" || previewViewport === "mobile";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setLangOpen(false);
  }, [previewViewport]);

  const navItems = [
    { to: "/p/kamers", label: st("nav.rooms", lang) },
    { to: "/p/omgeving", label: st("nav.surroundings", lang) },
    { to: "/p/boeken", label: st("nav.pricing", lang) },
    { to: "/p/contact", label: st("nav.contact", lang) },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLang = (l: SiteLang) => {
    saveSiteLang(l);
    onLangChange(l);
    setLangOpen(false);
  };

  const showWhiteLogo = isHome && !scrolled && !mobileOpen;

  const desktopNavClass = isForcedViewport
    ? `${isSmallViewport ? "hidden" : "flex"} items-center gap-10`
    : "hidden md:flex items-center gap-10";

  const desktopActionsClass = isForcedViewport
    ? `${isSmallViewport ? "hidden" : "flex"} items-center gap-4`
    : "hidden md:flex items-center gap-4";

  const mobileButtonClass = isForcedViewport
    ? `${isSmallViewport ? "block" : "hidden"} p-2`
    : "md:hidden p-2";

  const mobileMenuVisible = mobileOpen && (!isForcedViewport || isSmallViewport);
  const mobileMenuClass = isForcedViewport
    ? "bg-white border-t border-outline-variant/20 px-6 py-6 space-y-4"
    : "md:hidden bg-white border-t border-outline-variant/20 px-6 py-6 space-y-4";

  return (
    <nav className={`${isStatic ? "relative" : "fixed top-0"} w-full z-50 transition-all duration-300 ${
      isStatic || scrolled || !isHome ? "bg-white/80 backdrop-blur-xl shadow-sm" : "bg-transparent"
    }`}>
      <div className={`flex justify-between items-center py-3 max-w-screen-2xl mx-auto ${isForcedViewport && isSmallViewport ? "px-4" : "px-6 md:px-8"}`}>
        <Link to="/">
          <img
            src={showWhiteLogo ? logoWhite : logoColor}
            alt="Casita Valencia"
            className="h-14 w-auto"
          />
        </Link>

        <div className={desktopNavClass}>
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`font-sans tracking-wide text-sm uppercase transition-colors ${
                isActive(item.to)
                  ? "text-primary-container font-semibold border-b-2 border-primary-container pb-1"
                  : showWhiteLogo
                    ? "text-white font-bold hover:text-white"
                    : "text-on-surface-variant hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className={desktopActionsClass}>
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 p-2 rounded-full hover:bg-black/5 transition-colors"
            >
              <img src={flagMap[lang]} alt={langLabels[lang]} className="w-6 h-4 object-cover rounded-sm" />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-outline-variant/20 py-1 min-w-[160px]">
                {langs.map((l) => (
                  <button
                    key={l}
                    onClick={() => handleLang(l)}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-surface-container-low transition-colors flex items-center gap-3 ${
                      l === lang ? "text-primary font-medium" : "text-foreground"
                    }`}
                  >
                    <img src={flagMap[l]} alt={langLabels[l]} className="w-6 h-4 object-cover rounded-sm" />
                    {langLabels[l]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/p/boeken"
            className="bg-primary-container text-white px-6 py-2.5 rounded-full font-body text-sm font-semibold tracking-wide hover:opacity-80 transition-opacity active:scale-95"
          >
            {st("nav.bookNow", lang)}
          </Link>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className={mobileButtonClass}>
          {mobileOpen ? (
            <X className={`w-6 h-6 ${showWhiteLogo ? "text-white" : ""}`} />
          ) : (
            <Menu className={`w-6 h-6 ${showWhiteLogo ? "text-white" : ""}`} />
          )}
        </button>
      </div>

      {mobileMenuVisible && (
        <div className={mobileMenuClass}>
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={`block font-sans text-lg ${
                isActive(item.to) ? "text-primary-container font-semibold" : "text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-4 border-t border-outline-variant/20">
            {langs.map((l) => (
              <button
                key={l}
                onClick={() => { handleLang(l); setMobileOpen(false); }}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm ${
                  l === lang ? "bg-primary/10 ring-2 ring-primary" : "bg-surface-container-low"
                }`}
              >
                <img src={flagMap[l]} alt={langLabels[l]} className="w-5 h-3.5 object-cover rounded-sm" />
                <span className="text-xs font-medium">{l.toUpperCase()}</span>
              </button>
            ))}
          </div>
          <Link
            to="/p/boeken"
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
