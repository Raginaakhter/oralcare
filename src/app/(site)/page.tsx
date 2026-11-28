import Link from "next/link";
import HeroCarousel, { type HeroSlide } from "./HeroCarousel";
import { ArrowRightIcon, InstagramIcon, MailIcon, SparkIcon, StarIcon, QuoteIcon } from "@/components/icons";
import { ProductCard } from "@/components/ProductCard";
import { SmartImage } from "@/components/SmartImage";
import { Stars } from "@/components/Stars";
import { DealCountdown } from "@/components/DealCountdown";
import { NewsletterForm } from "@/components/NewsletterForm";
import { categories as categoryArt } from "@/lib/site-data";
import { formatPriceBDT, initials } from "@/lib/format";
import {
  getActiveBanners,
  getActiveDeals,
  getBlogPosts,
  getBrands,
  getCategories,
  getFeaturedReviews,
  getInstagramPosts,
  getLooks,
  getProducts,
  getPublicFooter,
  getReviewSummary,
  getTestimonials,
} from "@/lib/api/server";
import type {
  ActiveDeal,
  Banner,
  BlogPostSummary,
  Brand,
  Category,
  InstagramPost,
  Product,
  PublicLook,
  RatingSummary,
  Review,
  Testimonial,
} from "@/lib/api/types";

export default async function Home() {
  const [banners, promos, categories, brands, featured, newest, deals, looks, blog, testimonials, reviews, summary, instagram, footer] =
    await Promise.all([
      getActiveBanners("hero"),
      getActiveBanners("promo"),
      getCategories(),
      getBrands(),
      getProducts({ isFeatured: true, limit: 8, sort: "popularity" }),
      getProducts({ limit: 16, sort: "newest" }),
      getActiveDeals(),
      getLooks(),
      getBlogPosts({ limit: 3 }),
      getTestimonials("expert"),
      getFeaturedReviews(),
      getReviewSummary(),
      getInstagramPosts(),
      getPublicFooter(),
    ]);

  // Featured first, then fill with the newest arrivals (no duplicates).
  const seen = new Set<string>();
  const showcase = [...featured.items, ...newest.items].filter((p) => (seen.has(p._id) ? false : (seen.add(p._id), true)));
  const instagramHandle = footer?.socialLinks.find((s) => s.platform === "instagram")?.url;

  return (
    <>
      {banners.length > 0 && <HeroCarousel slides={banners.map(bannerToSlide)} />}
      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <CategoryStrip categories={categories} />
        {deals[0] && <DealOfTheDay deal={deals[0]} />}
        {promos.length > 0 && <PromoBanners banners={promos} />}
        <BestSellers products={showcase.slice(0, 16)} />
        {looks.length > 0 && <ShopTheLook looks={looks} />}
        {brands.length > 0 && <BrandStrip brands={brands} />}
        {blog.items.length > 0 && <HealthTips posts={blog.items} />}
        {(testimonials.length > 0 || reviews.length > 0) && (
          <TestimonialAndReviews expert={testimonials[0]} reviews={reviews} summary={summary} />
        )}
        {instagram.length > 0 && <InstagramGrid posts={instagram} profileUrl={instagramHandle} />}
        {footer?.settings?.newsletterEnabled !== false && <Newsletter settings={footer?.settings ?? null} />}
      </main>
    </>
  );
}

/** Map a CMS banner (GET /banners/active) onto the carousel's slide shape. */
function bannerToSlide(b: Banner): HeroSlide {
  return {
    img: b.desktopImage || b.backgroundImage || b.mobileImage || "",
    mobileImg: b.mobileImage,
    alt: b.imageAlt || b.title,
    tag: b.subtitle || "OralCareBD",
    title: b.title,
    description: b.description || "",
    cta: { label: b.buttonText || "Shop Now", href: b.buttonLink || "/shop" },
    secondary:
      b.secondaryButtonText && b.secondaryButtonLink ? { label: b.secondaryButtonText, href: b.secondaryButtonLink } : undefined,
    align: b.textAlignment,
    textColor: b.textColor,
    overlayColor: b.overlayColor,
    overlayOpacity: b.overlayOpacity,
  };
}

/* ---------- Category strip ---------- */

function CategoryStrip({ categories }: { categories: Category[] }) {
  if (!categories.length) return null;
  // Circle colours alternate; a category without its own image falls back to a bundled icon.
  const items = categories.slice(0, 7).map((c, i) => {
    const art = categoryArt[i % categoryArt.length];
    return { label: c.name, img: c.image || art.img, border: art.border, href: `/shop?category=${c.slug}` };
  });

  return (
    <section className="mt-8 sm:mt-12">
      <div className="flex gap-3 overflow-x-auto pb-4 pt-1 no-scrollbar sm:grid sm:grid-cols-4 lg:grid-cols-7 sm:gap-6 sm:overflow-visible">
        {items.map((c, i) => (
          <Link key={c.label} href={c.href} className="group flex shrink-0 w-24 sm:w-auto flex-col items-center text-center">
            <span
              className={`flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center overflow-hidden rounded-full border-[5px] sm:border-[6px] bg-white ${c.border} transition duration-500 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-brand/15`}
            >
              <SmartImage
                src={c.img}
                alt={c.label}
                width={96}
                height={96}
                className="h-14 w-14 sm:h-16 sm:w-16 rounded-full object-contain transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3"
              />
            </span>
            <span className="mt-2 text-xs sm:text-sm font-semibold text-slate-800 line-clamp-1 sm:line-clamp-none">{c.label}</span>
            <span
              className={`mt-0.5 inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium ${
                i % 2 === 0 ? "text-brand-dark" : "text-brand-blue-dark"
              }`}
            >
              Shop <ArrowRightIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ---------- Deal of the Day (GET /deals/active) ---------- */

function DealOfTheDay({ deal }: { deal: ActiveDeal }) {
  const p = deal.product;
  const href = `/product/${p.slug}`;
  return (
    <section className="mt-10 sm:mt-12 overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-brand via-brand-dark to-brand-blue-dark p-1 shadow-xl shadow-brand/15">
      <div className="relative grid gap-6 rounded-[20px] bg-white p-4 sm:p-6 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-10 md:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 animate-blob rounded-full bg-brand-soft/60 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-56 w-56 animate-blob rounded-full bg-slate-200/60 blur-3xl" />

        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-dark">
            <SparkIcon className="h-3.5 w-3.5" />
            Deal of the Day
          </span>
          <h3 className="mt-3 text-xl font-extrabold leading-tight text-slate-900 sm:text-3xl">
            {deal.title}
            {(deal.badgeText || p.discountPercent > 0) && (
              <>
                <br className="hidden sm:inline" />{" "}
                <span className="text-brand-blue-dark">{deal.badgeText || `${p.discountPercent}% Off Today`}</span>
              </>
            )}
          </h3>
          {deal.description && <p className="mt-2 sm:mt-3 max-w-md text-xs sm:text-sm text-slate-600">{deal.description}</p>}
          <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              href={href}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-md hover:bg-brand-dark"
            >
              Grab This Deal <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <div className="text-xs sm:text-sm text-slate-500">
              <span className="font-bold text-slate-900">{formatPriceBDT(p.price)}</span>{" "}
              {p.price < p.regularPrice && <span className="text-slate-400 line-through">{formatPriceBDT(p.regularPrice)}</span>}{" "}
              <span className="text-brand-dark">
                · {p.inStock ? (p.stockQuantity <= 10 ? `Only ${p.stockQuantity} left` : "In stock") : "Sold out"}
              </span>
            </div>
          </div>
        </div>

        <DealCountdown endsAt={deal.endsAt} initialSeconds={deal.secondsRemaining} />

        <Link href={href} className="relative z-10 flex h-48 w-full items-center justify-center sm:h-56 md:h-64">
          <div className="pointer-events-none absolute h-48 w-48 sm:h-56 sm:w-56 animate-spin-slow rounded-full border border-dashed border-slate-300/60" />
          <div className="relative h-full w-full animate-float">
            <SmartImage
              src={deal.image || p.thumbnail}
              alt={`Featured deal: ${p.productName}`}
              fill
              sizes="(min-width: 768px) 300px, 60vw"
              className="object-contain"
              style={{ mixBlendMode: "multiply" }}
            />
          </div>
        </Link>
      </div>
    </section>
  );
}

/* ---------- Promo banners (GET /banners/active?placement=promo) ---------- */

function PromoBanners({ banners }: { banners: Banner[] }) {
  const tints = [
    "from-teal-100 via-cyan-50 to-white",
    "from-violet-100 via-indigo-50 to-white",
    "from-pink-100 via-rose-50 to-amber-50",
  ];
  return (
    <section className={`mt-12 grid gap-5 ${banners.length >= 3 ? "lg:grid-cols-3" : banners.length === 2 ? "lg:grid-cols-2" : ""}`}>
      {banners.slice(0, 3).map((b, i) => (
        <Link
          key={b._id}
          href={b.buttonLink || "/shop"}
          className={`group relative flex items-center justify-between overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br ${tints[i % 3]} p-4 sm:p-6 ring-1 ring-brand/15 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/15`}
        >
          <div className="relative z-10 max-w-[62%] sm:max-w-[55%]">
            {b.subtitle && (
              <div className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${i % 2 ? "text-brand-blue-dark" : "text-brand-dark"}`}>
                {b.subtitle}
              </div>
            )}
            <h3 className="mt-1 sm:mt-2 text-base sm:text-xl font-extrabold leading-snug text-slate-900 break-words">{b.title}</h3>
            {b.description && <p className="mt-1 line-clamp-2 text-[11px] sm:text-xs text-slate-600">{b.description}</p>}
            <span className="mt-2 sm:mt-4 inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-brand-dark">
              {b.buttonText || "Shop Now"}
              <ArrowRightIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
          {(b.desktopImage || b.mobileImage) && (
            <div className="relative h-24 w-24 sm:h-32 sm:w-36 shrink-0">
              <SmartImage
                src={b.desktopImage || b.mobileImage}
                alt={b.imageAlt || ""}
                fill
                sizes="144px"
                className="object-contain transition-transform duration-500 group-hover:scale-110"
                style={{ mixBlendMode: "multiply" }}
              />
            </div>
          )}
        </Link>
      ))}
    </section>
  );
}

/* ---------- Best Sellers ---------- */

function BestSellers({ products }: { products: Product[] }) {
  return (
    <section className="mt-14 sm:mt-20">
      <SectionHeading
        eyebrow="Featured"
        title={
          <>
            Our <span className="rainbow-text">Hand-Picked</span> Favourites
          </>
        }
        description="Products our customers can't stop re-ordering - dentist-approved and shelf-authentic."
        cta={{ label: "View All Products", href: "/shop" }}
      />
      {products.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-white p-10 text-center text-sm text-slate-500 ring-1 ring-slate-100">
          New products are on their way — check back soon.
        </div>
      ) : (
        <div className="mt-8 sm:mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  cta,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  cta?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
      <div className="max-w-2xl">
        {eyebrow && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-soft to-brand-blue-soft px-2.5 py-1 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-brand-blue-dark ring-1 ring-brand-blue/10">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-brand to-fuchsia-500" />
            {eyebrow}
          </span>
        )}
        <h2 className="mt-2 sm:mt-3 text-2xl font-black leading-tight text-slate-900 sm:text-4xl md:text-5xl break-words">{title}</h2>
        {description && <p className="mt-2 sm:mt-3 max-w-xl text-xs sm:text-sm text-slate-600">{description}</p>}
      </div>
      {cta && (
        <Link
          href={cta.href}
          className="group inline-flex w-fit items-center gap-1.5 sm:gap-2 rounded-full bg-gradient-to-r from-brand via-brand-blue to-fuchsia-600 px-4 py-2 sm:px-5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-brand-blue/25 transition hover:-translate-y-0.5 hover:brightness-110"
        >
          {cta.label}
          <ArrowRightIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}

/* ---------- Shop the Look (GET /looks) ---------- */

function ShopTheLook({ looks }: { looks: PublicLook[] }) {
  const feature = looks.find((l) => l.layout === "feature") ?? looks[0];
  const tiles = looks.filter((l) => l._id !== feature._id).slice(0, 4);
  const featureImg = feature.image || feature.products[0]?.thumbnail;

  return (
    <section className="mt-14 sm:mt-20">
      <SectionHeading
        eyebrow="Shop The Look"
        title={
          <>
            Build Your <span className="rainbow-text">Dream Routine</span>
          </>
        }
        description="Mix and match to create the oral care routine that fits your life."
      />

      <div className="mt-8 sm:mt-10 grid gap-4 sm:gap-5 lg:grid-cols-6 lg:grid-rows-2">
        <Link
          href={feature.link}
          className={`group relative col-span-6 row-span-2 overflow-hidden rounded-2xl sm:rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 sm:p-8 text-white ring-1 ring-slate-800 ${
            tiles.length ? "lg:col-span-3" : ""
          }`}
        >
          <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 animate-blob rounded-full bg-brand/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 animate-blob rounded-full bg-brand-blue/40 blur-3xl" />
          <div className="relative flex h-full min-h-[260px] flex-col">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur">
              <SparkIcon className="h-3 w-3 text-amber-400" />
              {feature.tag || "Editor's Pick"}
            </span>
            <h3 className="mt-4 sm:mt-6 max-w-[70%] text-2xl sm:text-4xl lg:text-5xl font-black leading-tight break-words">{feature.title}</h3>
            {feature.description && <p className="mt-2 sm:mt-4 max-w-sm text-xs sm:text-sm text-slate-300">{feature.description}</p>}
            <div className="mt-auto flex items-end justify-between pt-6 sm:pt-8">
              {feature.fromPrice != null ? (
                <div>
                  <div className="text-[11px] sm:text-xs opacity-75">From</div>
                  <div className="display-font text-3xl sm:text-4xl font-black">{formatPriceBDT(feature.fromPrice)}</div>
                </div>
              ) : (
                <span />
              )}
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 sm:px-5 sm:py-3 text-xs font-bold text-slate-900 transition group-hover:gap-2">
                Shop Edit <ArrowRightIcon className="h-3.5 w-3.5" />
              </span>
            </div>
            {featureImg && (
              <div className="pointer-events-none absolute right-2 bottom-16 sm:right-6 sm:top-20 h-28 w-28 sm:h-48 sm:w-48 opacity-40 sm:opacity-100 animate-big-float">
                <SmartImage src={featureImg} alt="" fill sizes="200px" className="object-contain drop-shadow-2xl" />
              </div>
            )}
          </div>
        </Link>

        {tiles.map((l, i) => {
          const img = l.image || l.products[0]?.thumbnail;
          const blue = i % 2 === 1;
          return (
            <Link
              key={l._id}
              href={l.link}
              className={`group relative col-span-6 overflow-hidden rounded-3xl bg-gradient-to-br ${
                blue ? "from-brand-blue-soft via-white to-brand-soft" : "from-brand-soft via-white to-brand-soft"
              } p-5 ring-1 ring-brand/15 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/15 sm:col-span-3`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  {l.tag && (
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.15em] ${
                        blue ? "bg-brand-blue-soft text-brand-blue-dark" : "bg-brand-soft text-brand-dark"
                      }`}
                    >
                      {l.tag}
                    </span>
                  )}
                  <h4 className="mt-3 text-xl font-black text-slate-900">{l.title}</h4>
                  {l.description && <p className="mt-1 text-xs text-slate-600">{l.description}</p>}
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-slate-900">
                    {l.fromPrice != null ? `From ${formatPriceBDT(l.fromPrice)}` : "Shop Now"}
                    <ArrowRightIcon className="h-3 w-3 transition group-hover:translate-x-1" />
                  </span>
                </div>
                {img && (
                  <div className="relative h-24 w-24 shrink-0">
                    <SmartImage
                      src={img}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                      style={{ mixBlendMode: "multiply" }}
                    />
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- Brands marquee ---------- */

const BRAND_TONES = ["text-slate-800 italic", "text-teal-700", "text-brand-dark", "text-indigo-700", "text-sky-700"];

function BrandStrip({ brands }: { brands: Brand[] }) {
  const loop = [...brands, ...brands];
  return (
    <section className="marquee-container mt-10 overflow-hidden rounded-2xl bg-white py-6 ring-1 ring-slate-100">
      <div className="marquee-track flex items-center gap-14 pr-14">
        {loop.map((b, i) => (
          <Link
            key={`${b._id}-${i}`}
            href={`/shop?brand=${b.slug}`}
            aria-hidden={i >= brands.length ? "true" : undefined}
            tabIndex={i >= brands.length ? -1 : undefined}
            className={`whitespace-nowrap text-xl font-black tracking-tight opacity-80 hover:opacity-100 ${BRAND_TONES[i % BRAND_TONES.length]}`}
          >
            {b.name}
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ---------- Health tips (GET /blog) ---------- */

function HealthTips({ posts }: { posts: BlogPostSummary[] }) {
  return (
    <section className="mt-20">
      <SectionHeading
        eyebrow="Journal"
        title={
          <>
            Stories &amp; <span className="rainbow-text">Smile Tips</span>
          </>
        }
        description="Expert advice, product deep-dives and daily routines from our in-house dental team."
        cta={{ label: "Read All Articles", href: "/blog" }}
      />

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {posts.map((t, i) => {
          const tagCls = t.accent === "blue" ? "bg-brand-blue-soft text-brand-blue-dark" : "bg-brand-soft text-brand-dark";
          return (
            <Link
              key={t._id}
              href={`/blog/${t.slug}`}
              className="group relative overflow-hidden rounded-3xl bg-white ring-1 ring-slate-100 transition duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand/15"
            >
              <span className="absolute left-5 top-5 z-10 display-font text-6xl font-black text-white/70 mix-blend-overlay">0{i + 1}</span>
              <div
                className={`relative h-56 overflow-hidden bg-gradient-to-br ${
                  ["from-teal-100 to-cyan-50", "from-violet-100 to-pink-50", "from-amber-100 to-rose-50"][i % 3]
                }`}
              >
                <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 animate-blob rounded-full bg-brand/20 blur-3xl" />
                {t.coverImage && (
                  <SmartImage
                    src={t.coverImage}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-contain p-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2"
                  />
                )}
                {t.tag && (
                  <span
                    className={`absolute right-4 top-4 inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] shadow-sm ${tagCls}`}
                  >
                    {t.tag}
                  </span>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500">
                  <span>{t.readMinutes} min read</span>
                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                  <span>{t.author}</span>
                </div>
                <h3 className="mt-3 text-xl font-black leading-tight text-slate-900 group-hover:text-brand-dark">{t.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">{t.excerpt}</p>
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-brand-dark">
                    Read Article
                    <ArrowRightIcon className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-600 transition group-hover:bg-brand group-hover:text-white">
                    <ArrowRightIcon className="h-4 w-4 -rotate-45" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- Expert testimonial + customer reviews ---------- */

function TestimonialAndReviews({
  expert,
  reviews,
  summary,
}: {
  expert?: Testimonial;
  reviews: Review[];
  summary: RatingSummary | null;
}) {
  const latest = reviews[0];
  const total = summary?.totalReviews ?? 0;
  return (
    <section className="mt-14 sm:mt-20">
      <div className={`grid gap-6 ${expert && (latest || total) ? "lg:grid-cols-[1.2fr_1fr]" : ""}`}>
        {expert && (
          <div className="relative overflow-hidden rounded-2xl sm:rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 sm:p-10 text-white ring-1 ring-slate-800">
            <div className="pointer-events-none absolute -top-10 -right-10 h-72 w-72 animate-blob rounded-full bg-brand/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-72 w-72 animate-blob rounded-full bg-brand-blue/30 blur-3xl" />
            <QuoteIcon className="pointer-events-none absolute right-10 top-8 h-40 w-40 text-white/5" />

            <div className={`relative grid gap-6 sm:gap-8 items-center ${expert.image ? "sm:grid-cols-[auto_1fr]" : ""}`}>
              {expert.image && (
                <div className="relative h-32 w-28 sm:h-48 sm:w-40 shrink-0 mx-auto sm:mx-0 overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-brand via-brand to-brand-blue p-[3px] shadow-2xl">
                  <div className="relative h-full w-full overflow-hidden rounded-[20px] bg-white">
                    <SmartImage src={expert.image} alt={expert.name} fill sizes="160px" className="object-cover object-top" />
                  </div>
                  {expert.isVerified && (
                    <span className="absolute -right-1 -bottom-1 sm:-right-2 sm:-bottom-2 inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[10px] font-black uppercase text-slate-900 shadow-lg">
                      Verified
                    </span>
                  )}
                </div>
              )}

              <div className="text-center sm:text-left">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur">
                  Expert Voice
                </span>
                <blockquote className="mt-3 sm:mt-4 text-lg sm:text-2xl lg:text-3xl font-black leading-snug">&ldquo;{expert.quote}&rdquo;</blockquote>
                <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 sm:gap-4">
                  <div>
                    <div className="text-base sm:text-lg font-bold">{expert.name}</div>
                    {expert.role && <div className="text-xs text-slate-300">{expert.role}</div>}
                  </div>
                  <div className="flex -space-x-1 text-amber-400" aria-label={`${expert.rating} out of 5`}>
                    {Array.from({ length: expert.rating }).map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4 sm:h-5 sm:w-5" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {(latest || total > 0) && (
          <div className="relative overflow-hidden rounded-2xl sm:rounded-[2rem] bg-gradient-to-br from-brand-soft via-white to-brand-soft p-5 sm:p-10 ring-1 ring-brand/15">
            <div className="relative">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-brand-dark">
                    Reviews
                  </span>
                  <h3 className="mt-2 sm:mt-3 text-xl sm:text-2xl font-black leading-tight text-slate-900">What customers say</h3>
                </div>
                {summary && total > 0 && (
                  <div className="text-right">
                    <div className="display-font text-4xl sm:text-5xl font-black text-brand-dark">{summary.averageRating.toFixed(1)}</div>
                    <div className="flex items-center justify-end">
                      <Stars value={summary.averageRating} />
                    </div>
                    <div className="mt-0.5 text-[10px] font-semibold text-slate-500">
                      {total.toLocaleString()} review{total === 1 ? "" : "s"}
                    </div>
                  </div>
                )}
              </div>

              {summary && total > 0 && (
                <div className="mt-4 sm:mt-5 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((s) => {
                    const pct = Math.round(((summary.distribution[String(s)] ?? 0) / total) * 100);
                    return (
                      <div key={s} className="flex items-center gap-3 text-xs">
                        <span className="w-3 font-semibold text-slate-600">{s}</span>
                        <StarIcon className="h-3 w-3" />
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white">
                          <div className="h-full rounded-full bg-gradient-to-r from-brand to-brand-blue" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-8 text-right text-slate-500">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {latest && (
                <div className="mt-5 sm:mt-6 rounded-2xl bg-white p-4 sm:p-5 ring-1 ring-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-black text-brand-dark ring-2 ring-brand/15">
                      {initials(latest.userName)}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{latest.userName}</div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <Stars value={latest.rating} />
                        {latest.isVerifiedPurchase && <span>· Verified Buyer</span>}
                      </div>
                    </div>
                  </div>
                  <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm leading-relaxed text-slate-700">&ldquo;{latest.comment}&rdquo;</p>
                  {typeof latest.product === "object" && (
                    <Link href={`/product/${latest.product.slug}`} className="mt-2 inline-block text-[11px] font-bold text-brand-dark hover:underline">
                      on {latest.product.productName} →
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------- Instagram grid (GET /instagram-posts) ---------- */

function InstagramGrid({ posts, profileUrl }: { posts: InstagramPost[]; profileUrl?: string }) {
  const handle = profileUrl?.replace(/\/+$/, "").split("/").pop();
  return (
    <section className="mt-14">
      <div className="mb-6 flex items-end justify-between">
        <div>
          {handle && <span className="text-xs font-bold uppercase tracking-widest text-brand-dark">@{handle}</span>}
          <h2 className="mt-1 text-2xl font-extrabold text-slate-900">Follow Our Smile Journey</h2>
        </div>
        {profileUrl && (
          <a
            href={profileUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-blue-dark hover:underline"
          >
            Follow Us <InstagramIcon className="h-4 w-4" />
          </a>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {posts.slice(0, 6).map((p) => {
          const tile = (
            <>
              <SmartImage
                src={p.image}
                alt={p.caption ?? ""}
                fill
                sizes="(min-width: 1024px) 180px, (min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-brand/0 opacity-0 transition group-hover:bg-brand/70 group-hover:opacity-100">
                <InstagramIcon className="h-7 w-7 text-white" />
              </div>
            </>
          );
          const cls = "group relative aspect-square overflow-hidden rounded-xl bg-brand-soft ring-1 ring-slate-100";
          return p.link ? (
            <a key={p._id} href={p.link} target="_blank" rel="noreferrer" aria-label={p.caption || "Instagram post"} className={cls}>
              {tile}
            </a>
          ) : (
            <div key={p._id} className={cls}>
              {tile}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- Newsletter (POST /newsletter/subscribe) ---------- */

function Newsletter({ settings }: { settings: { newsletterTitle?: string; newsletterDescription?: string } | null }) {
  return (
    <section className="relative mt-8 sm:mt-10 overflow-hidden rounded-2xl bg-gradient-to-r from-teal-100 via-sky-50 to-violet-100 p-5 sm:p-8 ring-1 ring-teal-100">
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="flex items-start gap-3 sm:gap-4">
          <span className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-white text-brand ring-1 ring-brand/15">
            <MailIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">{settings?.newsletterTitle || "Join Our Smile Community!"}</h3>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-600">
              {settings?.newsletterDescription || "Subscribe to get exclusive offers, dental tips and latest product updates."}
            </p>
          </div>
        </div>
        <NewsletterForm source="home" />
      </div>
      <p className="mt-3 text-center text-[11px] sm:text-xs text-slate-500 lg:text-left">We respect your privacy. Unsubscribe anytime.</p>
    </section>
  );
}
