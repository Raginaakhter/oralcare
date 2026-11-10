export type Category = {
  slug: string;
  label: string;
  description: string;
  img: string;
  bg: string;
  ring: string;
  featured?: boolean;
};

export const adminCategories: Category[] = [
  {
    slug: "toothbrushes",
    label: "Toothbrushes",
    description: "Manual and electric toothbrushes for every mouth.",
    img: "/images/cat-toothbrush.png",
    bg: "bg-emerald-50",
    ring: "ring-emerald-100",
    featured: true,
  },
  {
    slug: "toothpaste",
    label: "Toothpaste",
    description: "Daily whitening, sensitivity and gum-health pastes.",
    img: "/images/cat-toothpaste.png",
    bg: "bg-brand-blue-soft",
    ring: "ring-blue-100",
    featured: true,
  },
  {
    slug: "teeth-whitening",
    label: "Teeth Whitening",
    description: "Professional kits, purple pastes and charcoal formulas.",
    img: "/images/cat-whitening.png",
    bg: "bg-emerald-50",
    ring: "ring-emerald-100",
    featured: true,
  },
  {
    slug: "floss-mouthwash",
    label: "Floss & Mouthwash",
    description: "Dentist-formulated rinses and flosses for freshness.",
    img: "/images/cat-mouthwash.png",
    bg: "bg-brand-blue-soft",
    ring: "ring-blue-100",
    featured: true,
  },
  {
    slug: "electric-brushes",
    label: "Electric Brushes",
    description: "Oscillating and sonic brushes for a deeper clean.",
    img: "/images/cat-electric-brush.png",
    bg: "bg-emerald-50",
    ring: "ring-emerald-100",
  },
  {
    slug: "dental-floss",
    label: "Dental Floss",
    description: "Waxed, unwaxed and tape-style floss options.",
    img: "/images/cat-floss.png",
    bg: "bg-brand-blue-soft",
    ring: "ring-blue-100",
  },
  {
    slug: "kids-oral-care",
    label: "Kids Oral Care",
    description: "Gentle brushes, fruity pastes and fun routines for kids.",
    img: "/images/cat-kids.png",
    bg: "bg-emerald-50",
    ring: "ring-emerald-100",
  },
];

export function getCategoryBySlug(slug: string) {
  return adminCategories.find((c) => c.slug === slug);
}
