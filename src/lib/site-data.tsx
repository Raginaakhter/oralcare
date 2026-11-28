/**
 * Presentation-only defaults. All catalog and content data comes from the API.
 */

/** Colour treatments (and a default icon) cycled across categories in the strip/menus. */
export const categories = [
  { img: "/images/cat-toothbrush.png", bg: "bg-teal-100", border: "border-teal-200", ring: "ring-teal-400" },
  { img: "/images/cat-toothpaste.png", bg: "bg-sky-100", border: "border-sky-200", ring: "ring-sky-400" },
  { img: "/images/cat-whitening.png", bg: "bg-violet-100", border: "border-violet-200", ring: "ring-violet-400" },
  { img: "/images/cat-mouthwash.png", bg: "bg-pink-100", border: "border-pink-200", ring: "ring-pink-400" },
  { img: "/images/cat-electric-brush.png", bg: "bg-amber-100", border: "border-amber-200", ring: "ring-amber-400" },
  { img: "/images/cat-floss.png", bg: "bg-emerald-100", border: "border-emerald-200", ring: "ring-emerald-400" },
  { img: "/images/cat-kids.png", bg: "bg-indigo-100", border: "border-indigo-200", ring: "ring-indigo-400" },
];

/**
 * Store details used on static policy pages, and as a fallback when the CMS
 * footer settings (Admin → Footer) leave a field empty.
 */
export const site = {
  name: "Oralcarebd",
  tagline: "Quality Care for Every Smile",
  phone: "+61 451 807 841",
  phoneHref: "https://wa.me/61451807841",
  email: "smile@oralcarebd.com",
  address: "Sydney, NSW 2000, Australia",
  copyright: "© 2026 All Rights Reserved By Oral Care BD",
  description:
    "Oral Care BD brings the best of Australian oral care products to your doorstep with quality and convenience.",
};
