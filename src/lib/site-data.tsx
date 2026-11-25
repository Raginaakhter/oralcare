/**
 * Presentation-only defaults. All catalog and content data comes from the API.
 */

/** Colour treatments (and a default icon) cycled across categories in the strip/menus. */
export const categories = [
  { img: "/images/cat-toothbrush.png", bg: "bg-[#c9dde4]", border: "border-[#c9dde4]", ring: "ring-brand/60" },
  { img: "/images/cat-toothpaste.png", bg: "bg-slate-200", border: "border-slate-200", ring: "ring-slate-400" },
  { img: "/images/cat-whitening.png", bg: "bg-[#c9dde4]", border: "border-[#c9dde4]", ring: "ring-brand/60" },
  { img: "/images/cat-mouthwash.png", bg: "bg-slate-200", border: "border-slate-200", ring: "ring-slate-400" },
  { img: "/images/cat-electric-brush.png", bg: "bg-[#c9dde4]", border: "border-[#c9dde4]", ring: "ring-brand/60" },
  { img: "/images/cat-floss.png", bg: "bg-slate-200", border: "border-slate-200", ring: "ring-slate-400" },
  { img: "/images/cat-kids.png", bg: "bg-[#c9dde4]", border: "border-[#c9dde4]", ring: "ring-brand/60" },
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
