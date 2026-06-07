import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ALL_SITE_LANGS, DEFAULT_SITE_LANG, type SiteLang } from "@/lib/site-i18n";

export const SITE_SETTINGS_QUERY_KEY = ["site_settings"] as const;

export function useEnabledLanguages(): { enabled: SiteLang[]; isLoading: boolean } {
  const { data, isLoading } = useQuery({
    queryKey: SITE_SETTINGS_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("enabled_languages")
        .limit(1)
        .single();
      if (error) throw error;
      return data;
    },
    staleTime: 60_000,
  });

  if (isLoading || !data) {
    return { enabled: ALL_SITE_LANGS, isLoading };
  }

  const filtered = (data.enabled_languages ?? []).filter((l): l is SiteLang =>
    (ALL_SITE_LANGS as string[]).includes(l),
  );
  // NL is the locked fallback — always ensure it's present.
  const enabled = filtered.includes(DEFAULT_SITE_LANG)
    ? filtered
    : [DEFAULT_SITE_LANG, ...filtered];

  return { enabled, isLoading: false };
}
