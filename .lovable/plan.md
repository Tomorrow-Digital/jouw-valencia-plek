

# Casa Valencia — Boutique Guesthouse Website

## Overview
A single-page, bilingual (NL/EN) website for a private guesthouse in Valencia with a custom booking engine, Mediterranean design aesthetic, and fully configurable pricing system.

## Sections & Features

### 1. Sticky Navigation
- Transparent over hero, solid white with blur on scroll
- Section links: De Ruimte, Voorzieningen, Omgeving, Prijzen & Boeken, Reviews, Contact
- Mobile hamburger menu with slide-in drawer
- NL/EN language toggle

### 2. Hero Section
- Full-screen image with grain texture overlay
- Animated headline "Jouw eigen plek in Valencia" + subtitle
- CTA scrolls to booking section

### 3. De Ruimte (The Space)
- 3 cards (Kamer, Badkamer, Buitenkeuken) with hover effects
- Lightbox gallery on click (swipeable, keyboard nav, close on X/outside)
- Short vibe paragraph below

### 4. Voorzieningen (Amenities)
- Icon grid (4 cols desktop, 2 mobile) with 12 amenities
- Lucide icons + labels, no descriptions

### 5. De Omgeving (Location)
- Google Maps iframe placeholder
- 3 info blocks: Valencia centrum, Strand, Supermarkt & restaurants
- Area description paragraph

### 6. Prijzen & Boeken (Core Section)
- **Custom calendar**: 2-month view, navigable, color-coded dates
- **PRICING_CONFIG** object driving all pricing logic
- Live pricing breakdown: per-night rates across price periods, subtotal, cleaning fee, discounts, total
- Minimum stay validation
- **Booking form**: name, email, phone, guests, arrival time, message
- Client-side validation + success state with summary
- Seasonal pricing table below

### 7. Reviews
- 3-4 hardcoded review cards with stars, names, flags
- Horizontal scroll on mobile, grid on desktop

### 8. FAQ
- Accordion with 8 questions, smooth animations

### 9. Huisregels (House Rules)
- Icon list: check-in/out times, no smoking, quiet hours, etc.

### 10. Contact & Footer
- Email (mailto), WhatsApp (pre-filled), Instagram links
- Host profile with photo
- Copyright footer

## Design System
- **Fonts**: DM Serif Display (headings) + DM Sans (body) via Google Fonts
- **Colors**: Warm white `#FAF7F2`, terracotta `#C4745A`, olive `#6B7F5E`, charcoal `#2D2D2D`
- **Style**: Layered shadows (no borders), concentric border radii, grain texture overlay
- **Animations**: Framer Motion for fade-in-on-scroll, hover micro-interactions, lightbox transitions

## Technical Approach
- All config (pricing, reviews, FAQ, amenities, i18n) as objects at top of file
- Calendar built from scratch using `date-fns`
- `framer-motion` for animations
- Fully responsive, accessible (aria labels, keyboard nav)
- No backend — pure UI state management

