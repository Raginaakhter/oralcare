import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  AnnouncementBar,
  Header,
  MainNav,
  Footer,
  FloatingWhatsapp,
} from "@/components/SiteShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OralCareBD — Quality Care for Every Smile",
  description:
    "Your trusted destination for authentic oral care products. Quality care for every smile, every day.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-800">
        <AnnouncementBar />
        <Header />
        <MainNav />
        <div className="flex-1">{children}</div>
        <Footer />
        <FloatingWhatsapp />
      </body>
    </html>
  );
}
