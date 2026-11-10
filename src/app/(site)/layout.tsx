import {
  AnnouncementBar,
  Header,
  MainNav,
  Footer,
  FloatingWhatsapp,
} from "@/components/SiteShell";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <AnnouncementBar />
      <Header />
      <MainNav />
      <div className="flex-1">{children}</div>
      <Footer />
      <FloatingWhatsapp />
    </div>
  );
}
