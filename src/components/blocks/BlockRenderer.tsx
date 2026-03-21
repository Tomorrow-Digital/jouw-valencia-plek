import { HeroBlock } from "./HeroBlock";
import { TextBlock } from "./TextBlock";
import { GalleryBlock } from "./GalleryBlock";
import { PricingBlock } from "./PricingBlock";
import { ReviewsBlock } from "./ReviewsBlock";
import { AmenitiesBlock } from "./AmenitiesBlock";
import { BookingCtaBlock } from "./BookingCtaBlock";
import { LocationMapBlock } from "./LocationMapBlock";
import { FaqBlock } from "./FaqBlock";
import { BookingBlock } from "./BookingBlock";
import { FeatureBlock } from "./FeatureBlock";
import type { PageBlock } from "./types";

const blockComponents: Record<string, React.ComponentType<{ data: Record<string, any>; lang: string }>> = {
  hero: HeroBlock,
  text: TextBlock,
  gallery: GalleryBlock,
  pricing: PricingBlock,
  reviews: ReviewsBlock,
  amenities: AmenitiesBlock,
  booking_cta: BookingCtaBlock,
  location_map: LocationMapBlock,
  faq: FaqBlock,
  booking: BookingBlock,
  feature: FeatureBlock,
};

interface BlockRendererProps {
  blocks: PageBlock[];
  lang: string;
}

export function BlockRenderer({ blocks, lang }: BlockRendererProps) {
  return (
    <div className="flex flex-col">
      {blocks
        .filter((block) => block.is_visible)
        .sort((a, b) => a.position - b.position)
        .map((block) => {
          const Component = blockComponents[block.type];
          if (!Component) return null;
          return <Component key={block.id} data={block.data} lang={lang} />;
        })}
    </div>
  );
}
