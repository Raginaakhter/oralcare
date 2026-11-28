/**
 * Server-only storefront chrome that reads CMS/catalog data (categories menu, footer).
 * Kept apart from SiteShell so client pages can import PageHero without
 * pulling server cache APIs into the browser bundle.
 */
import Link from "next/link";
import {
  TagIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
  TiktokIcon,
  WhatsappIcon,
} from "@/components/icons";
import { categories as fallbackCategories, site } from "@/lib/site-data";
import { getCategories, getPublicFooter, getShippingMethods } from "@/lib/api/server";
import { AnnouncementBar, Header, FloatingWhatsapp, type SiteContact } from "@/components/SiteShell";
import type { MenuCategory } from "@/components/MobileMenuDrawer";
import type { FooterSettings } from "@/lib/api/types";
import { SmartImage } from "@/components/SmartImage";
import { CategoryMenu } from "@/components/CategoryMenu";
import type { SocialPlatform } from "@/lib/api/types";

/** Phone + WhatsApp from the CMS footer settings; bundled store details only fill gaps. */
function contactFrom(settings: FooterSettings | null | undefined): SiteContact {
  const phone = settings?.contactPhone || site.phone;
  const wa = (settings?.whatsappNumber || settings?.contactPhone || "").replace(/D/g, "");
  return {
    phone,
    whatsappHref: wa ? `https://wa.me/${wa}` : site.phoneHref,
    telHref: `tel:${phone.replace(/[^0-9+]/g, "")}`,
  };
}

/** Top bar + header, fed by GET /footer, /categories and /shipping/methods. */
export async function SiteTop() {
  const [footer, categories, shipping] = await Promise.all([getPublicFooter(), getCategories(), getShippingMethods()]);
  const contact = contactFrom(footer?.settings);
  const menuCategories: MenuCategory[] = categories.map((c, i) => {
    const art = fallbackCategories[i % fallbackCategories.length];
    return { label: c.name, href: `/shop?category=${c.slug}`, img: c.image || art.img, bg: art.bg, ring: art.ring };
  });
  return (
    <>
      <AnnouncementBar
        contact={contact}
        freeShippingThreshold={shipping?.freeShippingThreshold ?? null}
        codAvailable={shipping ? shipping.methods.some((m) => m.codAvailable) : true}
      />
      <Header menuCategories={menuCategories} contact={contact} />
    </>
  );
}

export async function SiteWhatsapp() {
  const footer = await getPublicFooter();
  return <FloatingWhatsapp contact={contactFrom(footer?.settings)} />;
}

export function MainNav() {
  return (
    <nav className="relative w-full border-b border-slate-100 bg-white">
      {/* Scrolls sideways on small screens; visible overflow on desktop so the category menu can drop down */}
      <div className="mx-auto flex w-full max-w-7xl items-center gap-2 sm:gap-4 overflow-x-auto lg:overflow-visible no-scrollbar px-3 py-2 sm:px-6 lg:px-8 sm:py-3">
        {/* Shop All mega button */}
        <Link
          href="/shop"
          className="group inline-flex shrink-0 items-center gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-900 to-brand-blue-dark px-3.5 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-white shadow-md sm:shadow-lg shadow-slate-900/30 ring-1 ring-slate-800 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand/40"
        >
          <span className="flex h-4 w-4 sm:h-5 sm:w-5 flex-col items-center justify-center gap-[2.5px] sm:gap-[3px] transition group-hover:gap-[2px]">
            <span className="h-[2px] w-3.5 sm:w-4 rounded-full bg-brand" />
            <span className="h-[2px] w-3.5 sm:w-4 rounded-full bg-brand" />
            <span className="h-[2px] w-3.5 sm:w-4 rounded-full bg-brand" />
          </span>
          Shop All
          <span className="ml-1 hidden rounded-full bg-brand/20 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-brand sm:inline">
            100+
          </span>
        </Link>

        {/* Shop by Category — dropdown */}
        <CategoriesDropdown />

        {/* Quick nav links */}
        <ul className="hidden items-center gap-1 text-sm font-semibold text-slate-700 lg:flex shrink-0">
          <li>
            <Link
              href="/blog"
              className="group relative inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 transition hover:bg-slate-50"
            >
              <span className="relative">
                Blog
                <span className="pointer-events-none absolute inset-x-0 -bottom-1 h-[2px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-brand to-brand-blue transition-transform duration-300 group-hover:scale-x-100" />
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/about-us"
              className="group relative inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 transition hover:bg-slate-50"
            >
              <span className="relative">
                About
                <span className="pointer-events-none absolute inset-x-0 -bottom-1 h-[2px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-brand to-brand-blue transition-transform duration-300 group-hover:scale-x-100" />
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/contact-us"
              className="group relative inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 transition hover:bg-slate-50"
            >
              <span className="relative">
                Contact
                <span className="pointer-events-none absolute inset-x-0 -bottom-1 h-[2px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-brand to-brand-blue transition-transform duration-300 group-hover:scale-x-100" />
              </span>
            </Link>
          </li>
        </ul>

        <div className="ml-auto flex shrink-0 items-center gap-2 pl-2">
          {/* Offers pulse pill */}
          <Link
            href="/shop?category=specials"
            className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-gradient-to-r from-rose-500 via-brand to-brand-blue px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-black text-white shadow-md transition hover:shadow-lg shrink-0 whitespace-nowrap"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              <TagIcon className="h-3.5 w-3.5" />
              HOT OFFERS
            </span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </Link>
        </div>
      </div>
    </nav>
  );
}

async function CategoriesDropdown() {
  const apiCategories = await getCategories();
  // Real categories; the bundled art only supplies a default icon.
  const categories = apiCategories.map((c, i) => ({
    label: c.name,
    href: `/shop?category=${c.slug}`,
    img: c.image || fallbackCategories[i % fallbackCategories.length].img,
    description: c.description,
  }));
  return <CategoryMenu categories={categories} />;
}
//           </Link>
//         </div>
//       </div>
//     </div>
//   </div>
// );


const SOCIAL_ICONS: Partial<Record<SocialPlatform, React.ReactNode>> = {
  facebook: <FacebookIcon />,
  instagram: <InstagramIcon />,
  youtube: <YoutubeIcon />,
  tiktok: <TiktokIcon />,
  whatsapp: <WhatsappIcon />,
};

/** Footer content comes from the CMS (GET /footer); bundled defaults fill any gaps. */
export async function Footer() {
  const cms = await getPublicFooter();
  const settings = cms?.settings ?? null;

  const description = settings?.description || site.description;
  const phone = settings?.contactPhone || site.phone;
  const phoneHref = settings?.whatsappNumber
    ? `https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}`
    : settings?.contactPhone
    ? `tel:${settings.contactPhone.replace(/\s/g, "")}`
    : site.phoneHref;
  const email = settings?.contactEmail || site.email;
  const address = settings?.businessAddress || site.address;
  const copyright = settings?.copyrightText || site.copyright;

  // Link columns and social links come only from the CMS (Admin → Footer).
  const columns = (cms?.sections ?? [])
    .filter((s) => s.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((s) => ({
      title: s.title,
      links: s.links
        .filter((l) => l.isActive)
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((l) => ({ label: l.title, href: l.url, target: l.target })),
    }));

  const socials = (cms?.socialLinks ?? [])
    .filter((s) => s.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((s) => ({ key: s._id, href: s.url, icon: s.customIcon, platform: s.platform }));

  const paymentLogos = (cms?.paymentLogos ?? [])
    .filter((p) => p.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <footer
      className="mt-14 bg-white"
      style={{
        ...(settings?.backgroundColor ? { backgroundColor: settings.backgroundColor } : {}),
        ...(settings?.textColor ? { color: settings.textColor } : {}),
      }}
    >
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <SmartImage
            src={settings?.logo || "/images/logo.png"}
            alt="OralcareBD"
            width={200}
            height={62}
            // Short pages show the footer above the fold, where this small logo becomes the LCP.
            loading="eager"
            className="h-12 w-auto"
          />
          <p className="mt-4 max-w-xs text-sm text-slate-600">{description}</p>
          <div className="mt-5 flex gap-3">
            {socials.map((s) => (
              <SocialLink
                key={s.key}
                href={s.href}
                icon={
                  s.icon ? (
                    <SmartImage src={s.icon} alt={s.platform} width={16} height={16} className="h-4 w-4" />
                  ) : (
                    SOCIAL_ICONS[s.platform] ?? <span className="text-[10px] font-black uppercase">{s.platform[0]}</span>
                  )
                }
              />
            ))}
          </div>
        </div>

        {columns.slice(0, 2).map((col) => (
          <div key={col.title}>
            <h4 className="mb-3 text-sm font-bold text-slate-900">{col.title}</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              {col.links.map((l) => (
                <li key={`${l.label}-${l.href}`}>
                  <Link
                    href={l.href}
                    target={l.target}
                    rel={l.target === "_blank" ? "noreferrer" : undefined}
                    className="hover:text-brand-dark"
                    style={settings?.linkColor ? { color: settings.linkColor } : undefined}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="mb-3 text-sm font-bold text-slate-900">Contact Us</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>
              <a href={phoneHref} className="inline-flex items-center gap-2 hover:text-brand-dark">
                <PhoneIcon className="h-4 w-4 text-brand" /> {phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${email}`} className="inline-flex items-center gap-2 hover:text-brand-dark">
                <MailIcon className="h-4 w-4 text-brand" /> {email}
              </a>
            </li>
            <li className="inline-flex items-center gap-2">
              <PinIcon className="h-4 w-4 text-brand" />
              {settings?.googleMapsUrl ? (
                <a href={settings.googleMapsUrl} target="_blank" rel="noreferrer" className="hover:text-brand-dark">
                  {address}
                </a>
              ) : (
                address
              )}
            </li>
          </ul>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {paymentLogos.length
              ? paymentLogos.map((p) => (
                  <SmartImage
                    key={p._id}
                    src={p.imageUrl}
                    alt={p.altText || p.name}
                    width={48}
                    height={24}
                    className="h-6 w-auto rounded bg-white object-contain"
                  />
                ))
              : ["COD", "bKash", "Nagad", "Card"].map((p) => (
                  <span key={p} className="rounded bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
                    {p}
                  </span>
                ))}
          </div>
        </div>
      </div>
      {columns.length > 2 && (
        <div className="mx-auto flex w-full max-w-7xl flex-wrap gap-x-8 gap-y-2 px-4 pb-8 text-sm text-slate-600 sm:px-6 lg:px-8">
          {columns.slice(2).flatMap((col) =>
            col.links.map((l) => (
              <Link key={`${col.title}-${l.href}`} href={l.href} target={l.target} className="hover:text-brand-dark">
                {l.label}
              </Link>
            ))
          )}
        </div>
      )}
      <div className="border-t border-slate-100">
        <div className="mx-auto w-full max-w-7xl px-4 py-4 text-center text-xs text-slate-500 sm:px-6 lg:px-8">
          {copyright}
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex h-8 w-8 items-center justify-center rounded-full text-brand-dark ring-1 ring-brand/15 transition hover:bg-brand hover:text-white"
    >
      {icon}
    </a>
  );
}

/* Floating WhatsApp FAB - sticky bottom-right (above mobile bottom nav) */
