import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/redesign/Navbar";
import { Footer } from "@/components/redesign/Footer";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { detectSiteLang, type SiteLang } from "@/lib/site-i18n";
import type { Page, PageBlock } from "@/components/blocks/types";

export default function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();
  const [lang, setLang] = useState<SiteLang>(detectSiteLang);
  const [page, setPage] = useState<Page | null>(null);
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) { setNotFound(true); setLoading(false); return; }

    async function load() {
      const { data: pageData } = await supabase
        .from("pages")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (!pageData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setPage(pageData as unknown as Page);

      const { data: blocksData } = await supabase
        .from("page_blocks")
        .select("*")
        .eq("page_id", pageData.id)
        .order("position", { ascending: true });

      if (blocksData) setBlocks(blocksData as unknown as PageBlock[]);
      setLoading(false);
    }

    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar lang={lang} onLangChange={setLang} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-serif font-bold text-foreground mb-2">404</h1>
            <p className="text-muted-foreground">
              {lang === "nl" ? "Pagina niet gevonden" : lang === "es" ? "Página no encontrada" : "Page not found"}
            </p>
          </div>
        </div>
        <Footer lang={lang} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {page?.meta_description && (
        <meta name="description" content={page.meta_description} />
      )}
      <Navbar lang={lang} onLangChange={setLang} />
      <main className="flex-1">
        <BlockRenderer blocks={blocks} lang={lang} />
      </main>
      <Footer lang={lang} />
    </div>
  );
}
