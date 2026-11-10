export type AdminHeroSlide = {
  id: string;
  img: string;
  alt: string;
  tag: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  objectPosition: string;
  order: number;
  published: boolean;
};

export const heroSlides: AdminHeroSlide[] = [
  {
    id: "slide-1",
    img: "https://images.unsplash.com/photo-1654373535457-383a0a4d00f9?w=1920&q=80",
    alt: "Bright confident smile with white teeth",
    tag: "Signature Smiles",
    titleLine1: "Your Smile Is",
    titleLine2: "Our Priority",
    description: "From gentle whitening to sensitivity relief — professional-grade oral care that lets your smile speak first.",
    ctaLabel: "Shop Whitening",
    ctaHref: "/shop?category=teeth-whitening",
    secondaryLabel: "See Bestsellers",
    secondaryHref: "/shop",
    objectPosition: "60% center",
    order: 1,
    published: true,
  },
  {
    id: "slide-2",
    img: "/images/models/dentist.jpg",
    alt: "Dentist examining patient in modern clinic",
    tag: "Trusted by Dental Experts",
    titleLine1: "Dentist-Approved Care,",
    titleLine2: "Delivered to Your Door",
    description: "Every product on our shelves is recommended by dental professionals — authentic, enamel-safe and sourced directly from Australia.",
    ctaLabel: "Shop Genuine Products",
    ctaHref: "/shop",
    secondaryLabel: "Browse Categories",
    secondaryHref: "/categories",
    objectPosition: "center 40%",
    order: 2,
    published: true,
  },
  {
    id: "slide-3",
    img: "https://images.unsplash.com/photo-1777446523856-e7acffa844a7?w=1920&q=80",
    alt: "Bamboo toothbrushes with eucalyptus leaves",
    tag: "Clean Every Day",
    titleLine1: "Clean Rituals,",
    titleLine2: "Fresh Results",
    description: "Build a routine you look forward to — brushes, pastes and rinses picked for everyday enamel-safe freshness.",
    ctaLabel: "Shop Daily Care",
    ctaHref: "/shop?category=toothpaste",
    secondaryLabel: "Browse Brushes",
    secondaryHref: "/shop?category=toothbrushes",
    objectPosition: "70% center",
    order: 3,
    published: true,
  },
  {
    id: "slide-4",
    img: "/images/models/model-2.jpg",
    alt: "Confident smile with white teeth",
    tag: "Everyday Confidence",
    titleLine1: "Confidence in",
    titleLine2: "Every Smile",
    description: "Simple routines, serious science. Build the smile you love with products you can trust every day.",
    ctaLabel: "Build My Routine",
    ctaHref: "/shop",
    secondaryLabel: "Smile Tips",
    secondaryHref: "/blog",
    objectPosition: "70% 35%",
    order: 4,
    published: true,
  },
  {
    id: "slide-5",
    img: "/images/models/model-1.jpg",
    alt: "Serene smile portrait",
    tag: "Daily Freshness",
    titleLine1: "Fresh Breath,",
    titleLine2: "All Day Long",
    description: "Dentist-formulated rinses, whitening pastes and daily care that keep every smile its brightest.",
    ctaLabel: "Shop Best Sellers",
    ctaHref: "/shop",
    secondaryLabel: "Explore Offers",
    secondaryHref: "/shop?category=specials",
    objectPosition: "70% 30%",
    order: 5,
    published: true,
  },
];

export function getSlideByIndex(index: string) {
  const i = parseInt(index, 10);
  if (isNaN(i) || i < 0 || i >= heroSlides.length) return undefined;
  return heroSlides[i];
}
