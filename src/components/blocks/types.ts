// Translatable string type for multilingual support
export type TranslatableString = {
  nl: string;
  en: string;
  es: string;
};

export interface HeroBlockData {
  heading: TranslatableString;
  subtitle: TranslatableString;
  backgroundImage: string;
  ctaText: TranslatableString;
  ctaLink: string;
}

export interface TextBlockData {
  content: TranslatableString;
  alignment: "left" | "center" | "right";
}

export interface GalleryImage {
  src: string;
  alt: TranslatableString;
  caption: TranslatableString;
}

export interface GalleryBlockData {
  images: GalleryImage[];
  layout: "grid" | "carousel" | "masonry";
  columns: number;
}

export interface PricingSeason {
  name: TranslatableString;
  period: TranslatableString;
  pricePerNight: number;
  minNights: number;
}

export interface PricingExtra {
  name: TranslatableString;
  price: number;
  required: boolean;
  perPerson: boolean;
}

export interface PricingBlockData {
  currency: string;
  seasons: PricingSeason[];
  extras: PricingExtra[];
  footnote: TranslatableString;
}

export interface Testimonial {
  name: string;
  country: string;
  rating: number;
  text: TranslatableString;
  date: string;
  avatar: string;
}

export interface ReviewsBlockData {
  testimonials: Testimonial[];
  showRating: boolean;
  layout: "cards" | "list" | "carousel";
}

export interface AmenityCategory {
  name: TranslatableString;
  icon: string;
  items: TranslatableString[];
}

export interface AmenitiesBlockData {
  heading: TranslatableString;
  categories: AmenityCategory[];
}

export interface BookingCtaBlockData {
  heading: TranslatableString;
  description: TranslatableString;
  whatsappNumber: string;
  whatsappMessage: TranslatableString;
  showEmailAlternative: boolean;
  email: string;
  style: "prominent" | "subtle" | "inline";
}

export interface NearbyPlace {
  name: TranslatableString;
  distance: string;
  icon: string;
}

export interface LocationMapBlockData {
  heading: TranslatableString;
  latitude: number;
  longitude: number;
  zoom: number;
  description: TranslatableString;
  nearbyPlaces: NearbyPlace[];
  showExactLocation: boolean;
}

export interface FaqItem {
  question: TranslatableString;
  answer: TranslatableString;
}

export interface FaqBlockData {
  heading: TranslatableString;
  items: FaqItem[];
}

export type BlockData =
  | HeroBlockData
  | TextBlockData
  | GalleryBlockData
  | PricingBlockData
  | ReviewsBlockData
  | AmenitiesBlockData
  | BookingCtaBlockData
  | LocationMapBlockData
  | FaqBlockData;

export interface PageBlock {
  id: string;
  page_id: string;
  type: string;
  position: number;
  data: Record<string, any>;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  meta_description: string | null;
  status: "draft" | "published";
  owner_id: string | null;
  created_at: string;
  updated_at: string;
}

// Helper to get translated string
export function tr(value: TranslatableString | string | undefined, lang: string): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return (value as any)[lang] || value.en || value.nl || "";
}

// Default empty translatable string
export function emptyTr(): TranslatableString {
  return { nl: "", en: "", es: "" };
}
