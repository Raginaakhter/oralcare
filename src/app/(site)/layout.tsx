import {
  AnnouncementBar,
  Header,
  MainNav,
  Footer,
  FloatingWhatsapp,
} from "@/components/SiteShell";
import { StoreProvider } from "@/context/StoreContext";
import { CartDrawer } from "@/components/CartDrawer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <div className="flex min-h-full flex-col">
        <AnnouncementBar />
        <Header />
        <MainNav />
        <div className="flex-1">{children}</div>
        <Footer />
        <FloatingWhatsapp />
        <CartDrawer />
      </div>
    </StoreProvider>
  );
}
