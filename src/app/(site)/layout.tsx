import { Suspense } from "react";
import { MainNav, Footer, SiteTop, SiteWhatsapp } from "@/components/SiteChrome";
import { StoreProvider } from "@/context/StoreContext";
import { CartDrawer } from "@/components/CartDrawer";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <div className="flex min-h-full flex-col pb-16 md:pb-0">
        <SiteTop />
        <MainNav />
        <div className="flex-1">{children}</div>
        <Footer />
        <SiteWhatsapp />
        <CartDrawer />
        {/* Reads the pathname, which is runtime data on dynamic routes. */}
        <Suspense fallback={null}>
          <MobileBottomNav />
        </Suspense>
      </div>
    </StoreProvider>
  );
}
