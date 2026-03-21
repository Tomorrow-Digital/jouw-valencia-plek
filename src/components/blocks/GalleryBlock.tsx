import { useState } from "react";
import { tr } from "./types";
import type { GalleryBlockData } from "./types";
import { X } from "lucide-react";

export function GalleryBlock({ data, lang }: { data: Record<string, any>; lang: string }) {
  const d = data as unknown as GalleryBlockData;
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const images = d.images || [];
  const columns = d.columns || 3;

  if (images.length === 0) return null;

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${Math.min(columns, 4)}, minmax(0, 1fr))` }}
        >
          {images.map((img, i) => (
            <div
              key={i}
              className="relative group aspect-[4/3] rounded-xl overflow-hidden cursor-pointer bg-muted"
              onClick={() => setLightboxIdx(i)}
            >
              <img
                src={img.src}
                alt={tr(img.alt, lang)}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              {tr(img.caption, lang) && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <p className="text-white text-sm">{tr(img.caption, lang)}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxIdx(null)}
        >
          <button
            onClick={() => setLightboxIdx(null)}
            className="absolute top-4 right-4 text-white hover:text-white/80"
          >
            <X size={32} />
          </button>
          <img
            src={images[lightboxIdx].src}
            alt={tr(images[lightboxIdx].alt, lang)}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
        </div>
      )}
    </section>
  );
}
