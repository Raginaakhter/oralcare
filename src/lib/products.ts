export type Product = {
  slug: string;
  name: string;
  price: string;
  rating: number;
  reviews: number;
  badge?: string;
  badgeColor?: string;
  img: string;
  href: string;
  category: string;
  brand: string;
  description: string;
};

export const products: Product[] = [
  {
    slug: "white-glo-whitening-kit",
    name: "White Glo Teeth Whitening Kit Advanced",
    price: "৳5,499",
    rating: 4.8,
    reviews: 312,
    badge: "HOT",
    badgeColor: "bg-rose-500",
    img: "/images/products/p01.png",
    href: "/product/white-glo-whitening-kit",
    category: "teeth-whitening",
    brand: "White Glo",
    description:
      "Professional-grade teeth whitening kit with red + blue light spectrum. Removes up to 10 years of yellow stains, enamel-safe, no sensitivity.",
  },
  {
    slug: "white-glo-sleep-grind-guard",
    name: "White Glo Sleep Grind Guard",
    price: "৳1,649",
    rating: 4.5,
    reviews: 128,
    img: "/images/products/p02.png",
    href: "/product/white-glo-sleep-grind-guard",
    category: "toothbrushes",
    brand: "White Glo",
    description:
      "Mouldable night guard that protects teeth from grinding (bruxism) during sleep.",
  },
  {
    slug: "white-glo-purple-toothpaste",
    name: "White Glo Purple Toothpaste 205g",
    price: "৳1,149",
    rating: 4.6,
    reviews: 204,
    badge: "NEW",
    badgeColor: "bg-brand",
    img: "/images/products/p03.png",
    href: "/product/white-glo-purple-toothpaste",
    category: "toothpaste",
    brand: "White Glo",
    description:
      "Purple colour corrector that neutralises yellow tones for an instantly brighter smile.",
  },
  {
    slug: "white-glo-pro-white-205g",
    name: "White Glo Professional White Whitening Toothpaste 205g",
    price: "৳1,149",
    rating: 4.6,
    reviews: 189,
    img: "/images/products/p04.png",
    href: "/product/white-glo-pro-white-205g",
    category: "toothpaste",
    brand: "White Glo",
    description:
      "Family-size professional whitening paste with mild abrasives to remove surface stains.",
  },
  {
    slug: "white-glo-pro-white-115g",
    name: "White Glo Professional White Whitening Toothpaste 115g",
    price: "৳749",
    rating: 4.5,
    reviews: 276,
    img: "/images/products/p05.png",
    href: "/product/white-glo-pro-white-115g",
    category: "toothpaste",
    brand: "White Glo",
    description: "Everyday whitening toothpaste in a travel-friendly 115g size.",
  },
  {
    slug: "white-glo-pro-choice-150g",
    name: "White Glo Professional Choice Whitening 150g",
    price: "৳899",
    rating: 4.4,
    reviews: 142,
    img: "/images/products/p06.png",
    href: "/product/white-glo-pro-choice-150g",
    category: "toothpaste",
    brand: "White Glo",
    description:
      "Extra-strength whitening formula recommended for coffee, tea and red-wine drinkers.",
  },
  {
    slug: "steradent-cleaning-tablets",
    name: "Steradent Denture Cleaning Tablets 30 pack",
    price: "৳699",
    rating: 4.3,
    reviews: 96,
    img: "/images/products/p07.png",
    href: "/product/steradent-cleaning-tablets",
    category: "specials",
    brand: "Steradent",
    description:
      "Extra-strength intensive whitening tablets that kill 99.9% of bacteria on dentures.",
  },
  {
    slug: "white-glo-charcoal",
    name: "White Glo Charcoal Deep Stain Remover 205g",
    price: "৳1,199",
    rating: 4.5,
    reviews: 221,
    img: "/images/products/p08.png",
    href: "/product/white-glo-charcoal",
    category: "toothpaste",
    brand: "White Glo",
    description:
      "Activated charcoal formula that lifts deep stains without harming enamel.",
  },
  {
    slug: "white-glo-accelerator-kit",
    name: "White Glo Accelerator Kit",
    price: "৳3,499",
    rating: 4.7,
    reviews: 158,
    badge: "HOT",
    badgeColor: "bg-rose-500",
    img: "/images/products/p09.png",
    href: "/product/white-glo-accelerator-kit",
    category: "teeth-whitening",
    brand: "White Glo",
    description:
      "Serum + LED accelerator for salon-level whitening results at home.",
  },
  {
    slug: "ultrafresh-mint-spray",
    name: "Ultrafresh Breath Fresheners Cool Mint Spray 12mL",
    price: "৳699",
    rating: 4.4,
    reviews: 87,
    img: "/images/products/p10.png",
    href: "/product/ultrafresh-mint-spray",
    category: "floss-mouthwash",
    brand: "Ultrafresh",
    description:
      "Pocket-size cool mint spray for instant fresh breath, anywhere, anytime.",
  },
  {
    slug: "therabreath-icy-mint",
    name: "TheraBreath Mouthwash Invigorating Icy Mint 473mL",
    price: "৳2,399",
    rating: 4.7,
    reviews: 304,
    img: "/images/products/p11.png",
    href: "/product/therabreath-icy-mint",
    category: "floss-mouthwash",
    brand: "TheraBreath",
    description:
      "Dentist-formulated alcohol-free mouthwash with oxygenating technology for 24-hour fresh breath.",
  },
  {
    slug: "therabreath-fresh-breath",
    name: "TheraBreath Fresh Breath Oral Rinse Mild Mint 473mL",
    price: "৳2,249",
    rating: 4.8,
    reviews: 412,
    badge: "HOT",
    badgeColor: "bg-rose-500",
    img: "/images/products/p12.png",
    href: "/product/therabreath-fresh-breath",
    category: "floss-mouthwash",
    brand: "TheraBreath",
    description:
      "Mild mint formula gentle enough for sensitive mouths, strong enough to eliminate bad breath.",
  },
  {
    slug: "sensodyne-deep-clean",
    name: "Sensodyne Deep Clean Toothpaste 100g",
    price: "৳1,099",
    rating: 4.6,
    reviews: 198,
    img: "/images/products/p13.png",
    href: "/product/sensodyne-deep-clean",
    category: "toothpaste",
    brand: "Sensodyne",
    description:
      "Daily sensitivity relief combined with a deep-clean formula for healthy gums.",
  },
  {
    slug: "sensodyne-daily-care",
    name: "Sensodyne Daily Care Fluoride Toothpaste 100g",
    price: "৳1,099",
    rating: 4.5,
    reviews: 265,
    img: "/images/products/p14.png",
    href: "/product/sensodyne-daily-care",
    category: "toothpaste",
    brand: "Sensodyne",
    description:
      "Everyday fluoride protection designed for sensitive teeth. 100g family tube.",
  },
  {
    slug: "sensodyne-daily-whitening-2pack",
    name: "Sensodyne Daily Care + Whitening Toothpaste 100g x 2 pack",
    price: "৳1,799",
    rating: 4.7,
    reviews: 173,
    badge: "VALUE PACK",
    badgeColor: "bg-brand",
    img: "/images/products/p15.png",
    href: "/product/sensodyne-daily-whitening-2pack",
    category: "specials",
    brand: "Sensodyne",
    description:
      "Twin-pack of daily whitening + sensitivity care for the whole family.",
  },
  {
    slug: "sensodyne-daily-whitening-50g",
    name: "Sensodyne Daily Care & Whitening Toothpaste 50g",
    price: "৳649",
    rating: 4.5,
    reviews: 135,
    img: "/images/products/p16.png",
    href: "/product/sensodyne-daily-whitening-50g",
    category: "toothpaste",
    brand: "Sensodyne",
    description:
      "Travel-size whitening sensitivity paste — perfect for on-the-go smiles.",
  },
];

export const categoryLabels: Record<string, string> = {
  toothbrushes: "Toothbrushes",
  toothpaste: "Toothpaste",
  "teeth-whitening": "Teeth Whitening",
  "floss-mouthwash": "Floss & Mouthwash",
  specials: "Specials & Offers",
};

export function getProductsByCategory(cat?: string) {
  if (!cat) return products;
  return products.filter((p) => p.category === cat);
}

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}
