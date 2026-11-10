import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://oralcarebd.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "OralCareBD — Quality Care for Every Smile",
    template: "%s | OralCareBD",
  },
  description:
    "Your trusted destination for authentic Australian oral care products in Bangladesh. Dentist-approved, enamel-safe, delivered nationwide.",
  keywords: [
    "oral care Bangladesh",
    "teeth whitening Dhaka",
    "White Glo",
    "Sensodyne",
    "TheraBreath",
    "authentic dental products",
  ],
  authors: [{ name: "OralCareBD" }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "OralCareBD",
    title: "OralCareBD — Quality Care for Every Smile",
    description:
      "Authentic Australian oral care products delivered across Bangladesh. Dentist-approved, enamel-safe.",
    images: [{ url: "/images/logo.png", width: 200, height: 62, alt: "OralCareBD" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "OralCareBD — Quality Care for Every Smile",
    description:
      "Authentic Australian oral care products delivered across Bangladesh.",
    images: ["/images/logo.png"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-slate-800">{children}</body>
    </html>
  );
}
