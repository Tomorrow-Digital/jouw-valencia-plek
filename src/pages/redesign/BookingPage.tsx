import { useState, useEffect } from "react";
import { Navbar } from "@/components/redesign/Navbar";
import { Footer } from "@/components/redesign/Footer";
import { type SiteLang, detectSiteLang } from "@/lib/site-i18n";
import { supabase } from "@/integrations/supabase/client";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import type { PageBlock } from "@/components/blocks/types";

const BOOKING_PAGE_ID = "a1000000-0000-0000-0000-000000000004";

export default function BookingPage() {
  const [lang, setLang] = useState<SiteLang>(detectSiteLang);
  const [blocks, setBlocks] = useState<PageBlock[]>([]);

  useEffect(() => {
    supabase
      .from("page_blocks")
      .select("*")
      .eq("page_id", BOOKING_PAGE_ID)
      .order("position", { ascending: true })
      .then(({ data }) => {
        if (data) setBlocks(data as unknown as PageBlock[]);
      });
  }, []);

  // If no blocks exist yet, inject a default booking block
  const displayBlocks = blocks.length > 0
    ? blocks
    : [{ id: "default-booking", page_id: BOOKING_PAGE_ID, type: "booking", position: 0, data: {}, is_visible: true, created_at: "", updated_at: "" }];

  return (
    <div className="bg-surface text-foreground font-body">
      <Navbar lang={lang} onLangChange={setLang} />
      <main className="pt-32 pb-24">
        <BlockRenderer blocks={displayBlocks} lang={lang} />
      </main>
      <Footer lang={lang} />
    </div>
  );
}
