import {
  AnnouncementBar,
  Header,
  MainNav,
  Footer,
  FloatingWhatsapp,
} from "@/components/SiteShell";
import { StoreProvider } from "@/context/StoreContext";
import { CartDrawer } from "@/components/CartDrawer";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <div className="flex min-h-full flex-col pb-16 md:pb-0">
        <AnnouncementBar />
        <Header />
        <MainNav />
        <div className="flex-1">{children}</div>
        <Footer />
        <FloatingWhatsapp />
        <CartDrawer />
        <MobileBottomNav />
      </div>
    </StoreProvider>
  );
}
