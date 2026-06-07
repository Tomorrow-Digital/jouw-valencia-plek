import { useEffect, useState } from "react";
import { detectSiteLang, saveSiteLang, DEFAULT_SITE_LANG, type SiteLang } from "@/lib/site-i18n";
import { useEnabledLanguages } from "./useEnabledLanguages";

export function useSiteLang(initial?: SiteLang) {
  const { enabled } = useEnabledLanguages();
  const [lang, setLangState] = useState<SiteLang>(() => initial ?? detectSiteLang());

  // If the current language has become disabled (admin toggled it off, or stored value is stale),
  // fall back to NL and persist that choice.
  useEffect(() => {
    if (!enabled.includes(lang)) {
      const fallback = enabled.includes(DEFAULT_SITE_LANG) ? DEFAULT_SITE_LANG : enabled[0];
      if (fallback && fallback !== lang) {
        setLangState(fallback);
        saveSiteLang(fallback);
      }
    }
  }, [enabled, lang]);

  const setLang = (next: SiteLang) => {
    setLangState(next);
    saveSiteLang(next);
  };

  return { lang, setLang, enabled };
}
