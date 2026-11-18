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
    img: "/images/hero/hero-1.jpg",
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
    img: "/images/hero/hero-2.jpg",
    alt: "Modern dental clinic with chair and equipment",
    tag: "Clinic-Grade Quality",
    titleLine1: "Clinic-Grade Care,",
    titleLine2: "At Home",
    description: "Formulas trusted by dental clinics across Australia — now part of your daily routine in Bangladesh.",
    ctaLabel: "Shop Clinic Picks",
    ctaHref: "/shop",
    secondaryLabel: "Browse Categories",
    secondaryHref: "/categories",
    objectPosition: "center 60%",
    order: 2,
    published: true,
  },
  {
    id: "slide-3",
    img: "/images/hero/hero-3.jpg",
    alt: "Bamboo toothbrushes in a glass jar with eucalyptus leaves",
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
    img: "/images/hero/hero-4.jpg",
    alt: "Dentist talking to patient in a modern dental office",
    tag: "Trusted by Dental Experts",
    titleLine1: "Dentist-Approved Care,",
    titleLine2: "Delivered to Your Door",
    description: "Every product on our shelves is recommended by dental professionals — authentic, enamel-safe and sourced directly from Australia.",
    ctaLabel: "Shop Genuine Products",
    ctaHref: "/shop",
    secondaryLabel: "Meet the Experts",
    secondaryHref: "/about-us",
    objectPosition: "center 40%",
    order: 4,
    published: true,
  },
];

export function getSlideByIndex(index: string) {
  const i = parseInt(index, 10);
  if (isNaN(i) || i < 0 || i >= heroSlides.length) return undefined;
  return heroSlides[i];
}
