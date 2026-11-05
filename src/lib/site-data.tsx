import {
  ShieldIcon,
  WalletIcon,
  TruckIcon,
  ReturnIcon,
  HeadsetIcon,
} from "@/components/icons";

export const categories = [
  { label: "Toothbrushes", img: "/images/cat-toothbrush.png", bg: "bg-emerald-50", ring: "ring-emerald-100", href: "/shop?category=toothbrushes" },
  { label: "Toothpaste", img: "/images/cat-toothpaste.png", bg: "bg-brand-blue-soft", ring: "ring-blue-100", href: "/shop?category=toothpaste" },
  { label: "Teeth Whitening", img: "/images/cat-whitening.png", bg: "bg-emerald-50", ring: "ring-emerald-100", href: "/shop?category=teeth-whitening" },
  { label: "Floss & Mouthwash", img: "/images/cat-mouthwash.png", bg: "bg-brand-blue-soft", ring: "ring-blue-100", href: "/shop?category=floss-mouthwash" },
  { label: "Electric Brushes", img: "/images/cat-electric-brush.png", bg: "bg-emerald-50", ring: "ring-emerald-100", href: "/shop?category=toothbrushes" },
  { label: "Dental Floss", img: "/images/cat-floss.png", bg: "bg-brand-blue-soft", ring: "ring-blue-100", href: "/shop?category=floss-mouthwash" },
  { label: "Kids Oral Care", img: "/images/cat-kids.png", bg: "bg-emerald-50", ring: "ring-emerald-100", href: "/shop" },
];

export const brands = [
  { name: "White Glo", className: "text-slate-800 italic" },
  { name: "SENSODYNE", className: "text-teal-700" },
  { name: "TheraBreath", className: "text-emerald-700" },
  { name: "Steradent", className: "text-indigo-700" },
  { name: "Ultrafresh", className: "text-sky-700" },
  { name: "Colgate", className: "text-red-600" },
  { name: "Oral-B", className: "text-blue-700 italic" },
  { name: "LISTERINE", className: "text-emerald-800" },
];

export const trustItems = [
  { title: "100% Authentic", sub: "Original Products", icon: <ShieldIcon /> },
  { title: "Secure Payment", sub: "100% Safe & Secure", icon: <WalletIcon /> },
  { title: "Fast Delivery", sub: "All Over Bangladesh", icon: <TruckIcon /> },
  { title: "Easy Returns", sub: "7 Days Return Policy", icon: <ReturnIcon /> },
  { title: "Expert Support", sub: "24/7 Customer Service", icon: <HeadsetIcon /> },
];

export const footerCols = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/shop" },
      { label: "Toothbrushes", href: "/shop?category=toothbrushes" },
      { label: "Toothpaste", href: "/shop?category=toothpaste" },
      { label: "Teeth Whitening", href: "/shop?category=teeth-whitening" },
      { label: "Floss & Mouthwash", href: "/shop?category=floss-mouthwash" },
      { label: "Specials & Offers", href: "/shop?category=specials" },
    ],
  },
  {
    title: "Information",
    links: [
      { label: "About Us", href: "/about-us" },
      { label: "Contact Us", href: "/contact-us" },
      { label: "Blog", href: "/blog" },
      { label: "Return & Refund Policy", href: "/return-refund-policy" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Customer Service",
    links: [
      { label: "My Account", href: "/my-account" },
      { label: "Wishlist", href: "/wishlist" },
      { label: "Cart", href: "/cart" },
    ],
  },
];

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
