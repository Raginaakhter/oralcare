import Image from "next/image";
import Link from "next/link";
import HeroCarousel from "./HeroCarousel";
import {
  ArrowRightIcon,
  CheckBadgeIcon,
  InstagramIcon,
  MailIcon,
  SparkIcon,
  StarIcon,
  CartIcon,
  HeartIcon,
  QuoteIcon,
} from "@/components/icons";
import { categories, brands, trustItems } from "@/lib/site-data";
import { products } from "@/lib/products";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <HeroCarousel slides={heroSlides} />
      <TrustBar />
      <CategoryStrip />
      <DealOfTheDay />
      <PromoBanners />
      <BestSellers />
      <ShopTheLook />
      <BrandStrip />
      <HealthTips />
      <TestimonialAndReviews />
      <InstagramGrid />
      <Newsletter />
    </main>
  );
}

/* ---------- Hero slides ---------- */

function HeroImage({
  model,
  modelAlt,
  product,
  productAlt,
  accent,
  objectPosition = "center",
}: {
  model: string;
  modelAlt: string;
  product: string;
  productAlt: string;
  accent: "emerald" | "blue" | "mixed";
  objectPosition?: string;
}) {
  const borderGrad =
    accent === "blue"
      ? "from-sky-400 via-brand-blue to-brand"
      : accent === "emerald"
      ? "from-brand via-emerald-400 to-sky-400"
      : "from-rose-400 via-brand to-brand-blue";

  return (
    <div className="relative mx-auto h-[26rem] w-full max-w-md sm:h-[30rem]">
      <div className="pointer-events-none absolute -top-10 -right-10 h-56 w-56 animate-blob rounded-full bg-rose-300/45 blur-3xl" />
      <div className="pointer-events-none absolute top-16 -left-14 h-60 w-60 animate-blob rounded-full bg-emerald-300/50 blur-3xl" />
      <div className="pointer-events-none absolute bottom-6 right-12 h-52 w-52 animate-blob rounded-full bg-sky-300/50 blur-3xl" />
      <div className="pointer-events-none absolute bottom-16 -left-6 h-44 w-44 animate-blob rounded-full bg-amber-200/60 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 right-0 h-40 w-40 animate-blob rounded-full bg-violet-200/50 blur-3xl" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 animate-spin-slow rounded-full border border-dashed border-emerald-300/50" />

      <div
        className={`relative mx-auto h-full w-[86%] overflow-hidden rounded-[2.5rem] bg-gradient-to-br ${borderGrad} p-[3px] shadow-2xl shadow-emerald-300/50`}
      >
        <div className="relative h-full w-full overflow-hidden rounded-[2.3rem] bg-white">
          <Image
            src={model}
            alt={modelAlt}
            fill
            priority
            sizes="(min-width: 768px) 420px, 85vw"
            className="object-cover"
            style={{ objectPosition }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand/30 via-transparent to-brand-blue/10" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-rose-200/20" />
        </div>
      </div>

      <SparkIcon className="pointer-events-none absolute right-6 top-8 h-6 w-6 animate-pulse text-amber-400 drop-shadow" />
      <SparkIcon className="pointer-events-none absolute left-4 top-24 h-4 w-4 animate-pulse text-brand-blue drop-shadow" />
      <SparkIcon className="pointer-events-none absolute right-10 bottom-32 h-5 w-5 animate-pulse text-rose-400 drop-shadow" />
      <SparkIcon className="pointer-events-none absolute left-10 bottom-12 h-4 w-4 animate-pulse text-brand drop-shadow" />

      <div className="absolute -right-2 bottom-24 z-20 animate-float sm:right-0">
        <div className="relative flex h-32 w-32 items-center justify-center rounded-3xl bg-white/85 p-2 shadow-2xl shadow-emerald-300/50 ring-1 ring-white/60 backdrop-blur-md sm:h-36 sm:w-36">
          <Image
            src={product}
            alt={productAlt}
            width={144}
            height={144}
            className="h-full w-full object-contain"
            style={{ mixBlendMode: "multiply" }}
          />
          <span className="absolute -top-2 -right-2 flex h-10 w-10 animate-pulse-ring items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-brand text-[10px] font-bold text-white shadow-lg">
            NEW
          </span>
        </div>
      </div>

      <div className="absolute -left-2 top-10 z-20 flex items-center gap-2 rounded-2xl bg-white/80 px-3 py-2 shadow-xl shadow-emerald-200/50 ring-1 ring-white/60 backdrop-blur-md">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-dark text-white">
          <CheckBadgeIcon className="h-5 w-5" />
        </span>
        <div className="text-left leading-tight">
          <div className="text-[12px] font-bold text-slate-900">Dentist Approved</div>
          <div className="text-[10px] text-slate-500">Expert certified</div>
        </div>
      </div>

      <div className="absolute left-4 bottom-6 z-20 flex items-center gap-2 rounded-2xl bg-white/80 px-3 py-2 shadow-xl shadow-emerald-200/50 ring-1 ring-white/60 backdrop-blur-md">
        <Stars value={5} />
        <div className="text-[11px] font-bold text-slate-900">4.9/5</div>
      </div>

      <div className="absolute right-4 top-28 z-20 flex flex-col items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-rose-500 p-3 text-center text-white shadow-xl">
        <span className="text-[10px] font-bold uppercase tracking-wider">Save</span>
        <span className="text-xl font-extrabold leading-none">25%</span>
      </div>
    </div>
  );
}

const heroSlides = [
  {
    tag: "Trusted by Dental Experts",
    title: (
      <>
        Dentist-Approved Care,{" "}
        <br />
        <span className="shimmer-text">Delivered to Your Door</span>
      </>
    ),
    description:
      "Every product on our shelves is recommended by dental professionals — authentic, enamel-safe and sourced directly from Australia.",
    cta: "Shop Genuine Products",
    secondary: "Meet the Experts",
    bg: "bg-gradient-to-br from-emerald-100 via-rose-50 to-sky-100",
    products: (
      <HeroImage
        model="/images/hero/hero-2.png"
        modelAlt="Dr. Farhana Islam - BDS, Oral Health Specialist"
        product="/images/products/p04.png"
        productAlt="White Glo Professional White Whitening Toothpaste"
        accent="emerald"
        objectPosition="center top"
      />
    ),
  },
  {
    tag: "Expert Dental Care",
    title: (
      <>
        Professional Products{" "}
        <br />
        <span className="shimmer-text">From the Dentist&apos;s Chair</span>
      </>
    ),
    description:
      "The same whitening and sensitivity ranges your dentist reaches for - now delivered straight to your door.",
    cta: "Shop Dental Care",
    secondary: "Browse Categories",
    bg: "bg-gradient-to-br from-sky-100 via-amber-50 to-emerald-100",
    products: (
      <HeroImage
        model="/images/models/dentist.jpg"
        modelAlt="Dental professional with patient in clinic"
        product="/images/products/p03.png"
        productAlt="White Glo Purple Toothpaste"
        accent="blue"
        objectPosition="70% center"
      />
    ),
  },
  {
    tag: "Daily Freshness",
    title: (
      <>
        Fresh Breath,{" "}
        <br />
        <span className="shimmer-text">Confident Smiles</span>
      </>
    ),
    description:
      "Dentist-formulated rinses, whitening pastes and daily care that keep every smile its brightest.",
    cta: "Shop Best Sellers",
    secondary: "Explore Offers",
    bg: "bg-gradient-to-br from-violet-100 via-emerald-50 to-sky-100",
    products: (
      <HeroImage
        model="/images/models/model-2.jpg"
        modelAlt="Joyful woman laughing with white teeth"
        product="/images/products/p11.png"
        productAlt="TheraBreath Icy Mint Mouthwash"
        accent="mixed"
        objectPosition="center top"
      />
    ),
  },
];

/* ---------- Stats Bento (By the Numbers) ---------- */

function TrustBar() {
  return (
    <section className="mt-8">
      <div className="grid gap-4 md:grid-cols-4">
        {/* Big headline card */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 text-white ring-1 ring-slate-800 md:row-span-2">
          <div className="pointer-events-none absolute -right-10 -bottom-10 h-40 w-40 animate-blob rounded-full bg-brand/30 blur-3xl" />
          <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 animate-blob rounded-full bg-sky-400/30 blur-3xl" />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
              By the Numbers
            </span>
            <h3 className="mt-5 text-3xl font-black leading-tight">
              Dentist-approved <br /> care at{" "}
              <span className="rainbow-text">every price point</span>
            </h3>
            <p className="mt-4 text-sm text-slate-300">
              Built on trust — see why thousands of families in Bangladesh pick OralCareBD.
            </p>
          </div>
          <div className="relative mt-16 flex items-end gap-2">
            {[8, 14, 10, 16, 12, 20, 18, 24, 20].map((h, i) => (
              <span
                key={i}
                className="w-3 rounded-t bg-gradient-to-t from-brand to-brand-blue"
                style={{ height: `${h * 3}px` }}
              />
            ))}
          </div>
        </div>

        {/* Metric tiles */}
        <StatTile number="10K+" label="Happy Customers" tone="emerald" />
        <StatTile number="100+" label="Authentic Products" tone="blue" />
        <StatTile number="4.9" label="Average Rating" tone="emerald" suffix="★" />
        <StatTile number="24/7" label="Expert Support" tone="blue" />
      </div>

      {/* Quick trust bullets */}
      <div className="mt-4 grid gap-3 rounded-2xl bg-gradient-to-r from-emerald-50 via-white to-sky-50 p-4 ring-1 ring-emerald-100 sm:grid-cols-5">
        {trustItems.map((t, i) => {
          const isBlue = i % 2 === 1;
          const bubble = isBlue
            ? "bg-brand-blue-soft text-brand-blue-dark"
            : "bg-brand-soft text-brand-dark";
          return (
            <div key={t.title} className="flex items-center gap-2.5">
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${bubble}`}>
                {t.icon}
              </span>
              <div className="leading-tight">
                <div className="text-xs font-bold text-slate-800">{t.title}</div>
                <div className="text-[10px] text-slate-500">{t.sub}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function StatTile({
  number,
  label,
  tone,
  suffix,
}: {
  number: string;
  label: string;
  tone: "emerald" | "blue";
  suffix?: string;
}) {
  const bg =
    tone === "blue"
      ? "bg-gradient-to-br from-brand-blue-soft via-white to-sky-100"
      : "bg-gradient-to-br from-brand-soft via-white to-emerald-100";
  const num = tone === "blue" ? "text-brand-blue-dark" : "text-brand-dark";
  return (
    <div
      className={`relative overflow-hidden rounded-3xl ${bg} p-6 ring-1 ring-emerald-100 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-100`}
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 animate-blob rounded-full bg-white/60 blur-2xl" />
      <div className="relative">
        <div className={`display-font text-5xl font-black ${num}`}>
          {number}
          {suffix && <span className="ml-1 text-amber-400">{suffix}</span>}
        </div>
        <div className="mt-2 text-xs font-bold uppercase tracking-[0.15em] text-slate-700">
          {label}
        </div>
      </div>
    </div>
  );
}

/* ---------- Category strip ---------- */

function CategoryStrip() {
  return (
    <section className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-7">
      {categories.map((c, i) => (
        <Link
          key={c.label}
          href={c.href}
          className="group flex flex-col items-center text-center"
        >
          <span
            className={`flex h-24 w-24 items-center justify-center overflow-hidden rounded-full ${c.bg} ring-2 ${c.ring} transition duration-500 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-emerald-100`}
          >
            <Image
              src={c.img}
              alt={c.label}
              width={96}
              height={96}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3"
            />
          </span>
          <span className="mt-3 text-sm font-semibold text-slate-800">{c.label}</span>
          <span
            className={`mt-1 inline-flex items-center gap-1 text-xs font-medium ${
              i % 2 === 0 ? "text-brand-dark" : "text-brand-blue-dark"
            }`}
          >
            Shop Now <ArrowRightIcon className="h-3 w-3" />
          </span>
        </Link>
      ))}
    </section>
  );
}

/* ---------- Deal of the Day ---------- */

function DealOfTheDay() {
  return (
    <section className="mt-12 overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-brand-blue-dark p-1 shadow-xl shadow-emerald-100">
      <div className="relative grid gap-6 rounded-[20px] bg-white p-6 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-10 md:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 animate-blob rounded-full bg-emerald-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-56 w-56 animate-blob rounded-full bg-blue-100/60 blur-3xl" />

        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-dark">
            <SparkIcon className="h-3.5 w-3.5" />
            Deal of the Day
          </span>
          <h3 className="mt-3 text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl">
            Advanced Whitening Kit <br />
            <span className="text-brand-blue-dark">Up to 25% Off Today</span>
          </h3>
          <p className="mt-3 max-w-md text-sm text-slate-600">
            Remove deep-set stains and achieve a brighter smile with the
            professional-grade whitening kit.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <Link
              href="/product/white-glo-whitening-kit"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-dark"
            >
              Grab This Deal <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <div className="text-sm text-slate-500">
              <span className="font-bold text-slate-900">৳5,499</span>{" "}
              <span className="text-brand-dark">· Limited stock</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex justify-center gap-3 md:flex-col md:items-center md:gap-2">
          <Countdown value="02" label="Days" accent="emerald" />
          <Countdown value="14" label="Hrs" accent="blue" />
          <Countdown value="38" label="Min" accent="emerald" />
          <Countdown value="52" label="Sec" accent="blue" />
        </div>

        <div className="relative z-10 flex h-56 w-full items-center justify-center md:h-64">
          <div className="pointer-events-none absolute h-56 w-56 animate-spin-slow rounded-full border border-dashed border-emerald-300/60" />
          <div className="relative h-full w-full animate-float">
            <Image
              src="/images/products/p01.png"
              alt="Featured deal: Advanced Whitening Kit"
              fill
              sizes="(min-width: 768px) 300px, 60vw"
              className="object-contain"
              style={{ mixBlendMode: "multiply" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Countdown({
  value,
  label,
  accent,
}: {
  value: string;
  label: string;
  accent: "emerald" | "blue";
}) {
  const cls =
    accent === "blue"
      ? "bg-brand-blue-soft text-brand-blue-dark ring-blue-100"
      : "bg-brand-soft text-brand-dark ring-emerald-100";
  return (
    <div className={`flex h-14 w-14 flex-col items-center justify-center rounded-xl ring-1 ${cls}`}>
      <span className="text-lg font-extrabold leading-none">{value}</span>
      <span className="text-[9px] font-semibold uppercase tracking-wider">{label}</span>
    </div>
  );
}

/* ---------- Promo banners ---------- */

function PromoBanners() {
  return (
    <section className="mt-12 grid gap-5 lg:grid-cols-3">
      <PromoCard
        tag="Whitening"
        tagColor="text-brand-dark"
        title={<>Purple Power<br />Whitening</>}
        cta="Shop Whitening"
        gradient="from-emerald-50 via-white to-emerald-50"
        accent="emerald"
        image="/images/products/p03.png"
        href="/shop?category=teeth-whitening"
      />
      <PromoCard
        tag="Fresh Breath"
        tagColor="text-brand-blue-dark"
        title={<>Confidence,<br />All Day Long</>}
        cta="Shop Mouthwash"
        gradient="from-brand-blue-soft via-white to-sky-50"
        accent="blue"
        image="/images/products/p11.png"
        href="/shop?category=floss-mouthwash"
      />
      <PromoCard
        tag="Exclusive Offers"
        tagColor="text-brand-dark"
        title={<>Save More on<br />Top Brands</>}
        cta="Explore Offers"
        gradient="from-emerald-50 via-emerald-100/40 to-white"
        accent="emerald"
        image="/images/products/p09.png"
        href="/shop?category=specials"
        rightBadge
      />
    </section>
  );
}

function PromoCard({
  tag,
  tagColor,
  title,
  cta,
  gradient,
  accent,
  image,
  href,
  rightBadge,
}: {
  tag: string;
  tagColor: string;
  title: React.ReactNode;
  cta: string;
  gradient: string;
  accent: "emerald" | "blue";
  image: string;
  href: string;
  rightBadge?: boolean;
}) {
  const ringCls = accent === "blue" ? "ring-blue-100" : "ring-emerald-100";
  const btnCls =
    accent === "blue" ? "hover:text-brand-blue-dark" : "hover:text-brand-dark";
  return (
    <Link
      href={href}
      className={`group relative flex items-center justify-between overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} p-6 ring-1 ${ringCls} transition hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-100`}
    >
      <div className="relative z-10 max-w-[55%]">
        <div className={`text-xs font-bold uppercase tracking-wider ${tagColor}`}>
          {tag}
        </div>
        <h3 className="mt-2 text-xl font-extrabold leading-snug text-slate-900">
          {title}
        </h3>
        <span
          className={`mt-4 inline-flex items-center gap-1 text-sm font-semibold text-slate-800 ${btnCls}`}
        >
          {cta}
          <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
      <div className="relative h-32 w-36 shrink-0">
        <Image
          src={image}
          alt=""
          fill
          sizes="144px"
          className="object-contain transition-transform duration-500 group-hover:scale-110"
          style={{ mixBlendMode: "multiply" }}
        />
        {rightBadge && (
          <span className="absolute -right-2 -top-2 flex h-14 w-14 animate-pulse-ring items-center justify-center rounded-full bg-brand text-center text-[10px] font-bold leading-tight text-white shadow-md">
            UP TO<br />30%<br />OFF
          </span>
        )}
      </div>
    </Link>
  );
}

/* ---------- Best Sellers ---------- */

function BestSellers() {
  return (
    <section className="mt-20">
      <SectionHeading
        eyebrow="Featured"
        title={<>Our <span className="rainbow-text">Hand-Picked</span> Favourites</>}
        description="Sixteen products our customers can't stop re-ordering - dentist-approved and shelf-authentic."
        cta={{ label: "View All Products", href: "/shop" }}
      />

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </section>
  );
}

/* Reusable section heading */
function SectionHeading({
  eyebrow,
  title,
  description,
  cta,
  align = "left",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  cta?: { label: string; href: string };
  align?: "left" | "center";
}) {
  const alignCls = align === "center" ? "text-center mx-auto" : "";
  return (
    <div className={`flex flex-wrap items-end justify-between gap-4 ${align === "center" ? "flex-col" : ""}`}>
      <div className={`max-w-2xl ${alignCls}`}>
        {eyebrow && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-brand-dark">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            {eyebrow}
          </span>
        )}
        <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900 sm:text-4xl md:text-5xl">
          {title}
        </h2>
        {description && (
          <p className="mt-3 max-w-xl text-slate-600">{description}</p>
        )}
      </div>
      {cta && (
        <Link
          href={cta.href}
          className="group inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-brand-dark"
        >
          {cta.label}
          <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}

/* ---------- Shop the Look (NEW bento) ---------- */

function ShopTheLook() {
  return (
    <section className="mt-20">
      <SectionHeading
        eyebrow="Shop The Look"
        title={<>Build Your <span className="rainbow-text">Dream Routine</span></>}
        description="Mix and match to create the oral care routine that fits your life."
      />

      <div className="mt-10 grid gap-5 lg:grid-cols-6 lg:grid-rows-2">
        {/* Big feature card */}
        <Link
          href="/shop?category=teeth-whitening"
          className="group relative col-span-6 row-span-2 overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white ring-1 ring-slate-800 lg:col-span-3"
        >
          <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 animate-blob rounded-full bg-emerald-500/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 animate-blob rounded-full bg-brand-blue/40 blur-3xl" />
          <div className="relative flex h-full flex-col">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur">
              <SparkIcon className="h-3 w-3 text-amber-400" />
              Editor&apos;s Pick
            </span>
            <h3 className="mt-6 text-4xl font-black leading-tight sm:text-5xl">
              The <span className="rainbow-text">Whitening</span>
              <br /> Starter Edit
            </h3>
            <p className="mt-4 max-w-sm text-sm text-slate-300">
              Three items. Fourteen days. A visibly brighter smile.
            </p>
            <div className="mt-auto flex items-end justify-between pt-8">
              <div>
                <div className="text-xs opacity-75">From</div>
                <div className="display-font text-4xl font-black">৳749</div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-5 py-3 text-xs font-bold text-slate-900 transition group-hover:gap-2">
                Shop Edit <ArrowRightIcon className="h-3.5 w-3.5" />
              </span>
            </div>
            {/* Floating product */}
            <div className="pointer-events-none absolute right-6 top-20 h-48 w-48 animate-big-float">
              <Image
                src="/images/products/p04.png"
                alt="Whitening toothpaste"
                fill
                sizes="200px"
                className="object-contain drop-shadow-2xl"
                style={{ mixBlendMode: "screen" }}
              />
            </div>
          </div>
        </Link>

        {/* 4 smaller bento tiles */}
        <BentoTile
          tag="Morning"
          title="Daily Brush + Rinse"
          desc="Start the day fresh."
          img="/images/products/p13.png"
          tint="from-emerald-100 via-white to-emerald-50"
          accent="emerald"
          href="/shop?category=toothpaste"
        />
        <BentoTile
          tag="Night"
          title="Deep Sensitivity Care"
          desc="Protect while you sleep."
          img="/images/products/p14.png"
          tint="from-brand-blue-soft via-white to-sky-100"
          accent="blue"
          href="/shop?category=toothpaste"
        />
        <BentoTile
          tag="On the Go"
          title="Cool Mint Spray"
          desc="Instant fresh breath."
          img="/images/products/p10.png"
          tint="from-rose-50 via-white to-amber-50"
          accent="emerald"
          href="/product/ultrafresh-mint-spray"
        />
        <BentoTile
          tag="Pro Level"
          title="Charcoal Deep Clean"
          desc="Lift stubborn stains."
          img="/images/products/p08.png"
          tint="from-violet-100 via-white to-sky-50"
          accent="blue"
          href="/product/white-glo-charcoal"
        />
      </div>
    </section>
  );
}

function BentoTile({
  tag,
  title,
  desc,
  img,
  tint,
  accent,
  href,
}: {
  tag: string;
  title: string;
  desc: string;
  img: string;
  tint: string;
  accent: "emerald" | "blue";
  href: string;
}) {
  const tagCls =
    accent === "blue"
      ? "bg-brand-blue-soft text-brand-blue-dark"
      : "bg-brand-soft text-brand-dark";
  return (
    <Link
      href={href}
      className={`group relative col-span-6 overflow-hidden rounded-3xl bg-gradient-to-br ${tint} p-5 ring-1 ring-emerald-100 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-100 sm:col-span-3 lg:col-span-3 xl:col-span-3`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.15em] ${tagCls}`}
          >
            {tag}
          </span>
          <h4 className="mt-3 text-xl font-black text-slate-900">{title}</h4>
          <p className="mt-1 text-xs text-slate-600">{desc}</p>
          <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-slate-900">
            Shop Now
            <ArrowRightIcon className="h-3 w-3 transition group-hover:translate-x-1" />
          </span>
        </div>
        <div className="relative h-24 w-24 shrink-0">
          <Image
            src={img}
            alt=""
            fill
            sizes="96px"
            className="object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
            style={{ mixBlendMode: "multiply" }}
          />
        </div>
      </div>
    </Link>
  );
}

export function ProductCard({ product }: { product: (typeof products)[number] }) {
  const { name, price, rating, reviews, badge, badgeColor, img, href, brand } = product;
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl bg-white p-3 ring-1 ring-slate-100 transition duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-100/80 hover:ring-emerald-200">
      {badge && (
        <span
          className={`absolute left-4 top-4 z-10 rounded-full ${badgeColor} px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-white shadow-md`}
        >
          {badge}
        </span>
      )}

      {/* Quick action rail - top right */}
      <div className="absolute right-4 top-4 z-10 flex flex-col gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2">
        <button
          aria-label="Add to wishlist"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-500 shadow-md ring-1 ring-slate-100 transition hover:bg-rose-50 hover:text-rose-500"
        >
          <HeartIcon className="h-4 w-4" />
        </button>
        <button
          aria-label="Quick view"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-500 shadow-md ring-1 ring-slate-100 transition hover:bg-sky-50 hover:text-brand-blue-dark"
        >
          <SparkIcon className="h-4 w-4" />
        </button>
      </div>

      <Link
        href={href}
        className="relative block overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50/70 via-white to-sky-50/70"
      >
        <div className="relative aspect-square">
          <Image
            src={img}
            alt={name}
            fill
            sizes="(min-width: 1024px) 260px, (min-width: 640px) 33vw, 50vw"
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2"
          />
        </div>
        {/* Add to cart slide-up */}
        <div className="absolute inset-x-3 bottom-3 translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-brand-dark">
            <CartIcon className="h-3.5 w-3.5" />
            Add to Cart
          </button>
        </div>
      </Link>

      <div className="mt-4 px-1">
        <div className="text-[10px] font-black uppercase tracking-[0.15em] text-brand-dark">
          {brand}
        </div>
        <Link href={href}>
          <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-snug text-slate-900 hover:text-brand-dark">
            {name}
          </h3>
        </Link>
        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
          <Stars value={rating} />
          <span className="text-[11px]">({reviews.toLocaleString()})</span>
        </div>
        <div className="mt-3 flex items-end justify-between border-t border-slate-100 pt-3">
          <div>
            <div className="text-lg font-black text-slate-900">{price}</div>
          </div>
          <button
            aria-label="Add to cart"
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-dark text-white shadow-md shadow-emerald-200/60 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <CartIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

export function Stars({ value }: { value: number }) {
  return (
    <span className="flex items-center text-amber-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon
          key={i}
          className="h-3.5 w-3.5"
          fillClass={i < Math.round(value) ? "fill-amber-400" : "fill-slate-200"}
        />
      ))}
    </span>
  );
}

/* ---------- Brands marquee ---------- */

function BrandStrip() {
  const loop = [...brands, ...brands];
  return (
    <section className="marquee-container mt-10 overflow-hidden rounded-2xl bg-white py-6 ring-1 ring-slate-100">
      <div className="marquee-track flex items-center gap-14 pr-14">
        {loop.map((b, i) => (
          <span
            key={`${b.name}-${i}`}
            aria-hidden={i >= brands.length ? "true" : undefined}
            className={`whitespace-nowrap text-xl font-black tracking-tight opacity-80 ${b.className}`}
          >
            {b.name}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ---------- Health tips ---------- */

const healthTips = [
  {
    tag: "Daily Habits",
    title: "Brushing Right: The 2x2 Rule",
    excerpt: "Twice a day, two minutes each - a gentle 45° angle protects enamel and gums.",
    accent: "emerald",
    img: "/images/products/p04.png",
    href: "/blog",
  },
  {
    tag: "Whitening",
    title: "Whitening Without Sensitivity",
    excerpt: "How purple toothpastes neutralise yellow tones and when to switch to a kit.",
    accent: "blue",
    img: "/images/products/p03.png",
    href: "/blog",
  },
  {
    tag: "Fresh Breath",
    title: "Choosing the Right Mouthwash",
    excerpt: "Alcohol-free formulas for sensitive mouths, antiseptic rinses for deep clean.",
    accent: "emerald",
    img: "/images/products/p11.png",
    href: "/blog",
  },
];

function HealthTips() {
  return (
    <section className="mt-20">
      <SectionHeading
        eyebrow="Journal"
        title={<>Stories &amp; <span className="rainbow-text">Smile Tips</span></>}
        description="Expert advice, product deep-dives and daily routines from our in-house dental team."
        cta={{ label: "Read All Articles", href: "/blog" }}
      />

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {healthTips.map((t, i) => {
          const tagCls =
            t.accent === "blue"
              ? "bg-brand-blue-soft text-brand-blue-dark"
              : "bg-brand-soft text-brand-dark";
          return (
            <Link
              key={t.title}
              href={t.href}
              className="group relative overflow-hidden rounded-3xl bg-white ring-1 ring-slate-100 transition duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-100"
            >
              {/* Number stamp */}
              <span className="absolute left-5 top-5 z-10 display-font text-6xl font-black text-white/70 mix-blend-overlay">
                0{i + 1}
              </span>

              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-emerald-100 via-white to-sky-100">
                <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 animate-blob rounded-full bg-emerald-300/40 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 animate-blob rounded-full bg-sky-300/40 blur-3xl" />
                <Image
                  src={t.img}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-contain p-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2"
                  style={{ mixBlendMode: "multiply" }}
                />
                <span
                  className={`absolute right-4 top-4 inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] shadow-sm ${tagCls}`}
                >
                  {t.tag}
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500">
                  <span>5 min read</span>
                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                  <span>Dr. Farhana Islam</span>
                </div>
                <h3 className="mt-3 text-xl font-black leading-tight text-slate-900 group-hover:text-brand-dark">
                  {t.title}
                </h3>
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

/* ---------- Testimonial + Reviews ---------- */

function TestimonialAndReviews() {
  return (
    <section className="mt-20">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        {/* Big expert quote card */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white ring-1 ring-slate-800 sm:p-12">
          <div className="pointer-events-none absolute -top-10 -right-10 h-72 w-72 animate-blob rounded-full bg-brand/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-72 w-72 animate-blob rounded-full bg-brand-blue/30 blur-3xl" />

          {/* Huge quote mark */}
          <QuoteIcon className="pointer-events-none absolute right-10 top-8 h-40 w-40 text-white/5" />

          <div className="relative grid gap-8 md:grid-cols-[auto_1fr] md:items-center">
            <div className="relative h-40 w-32 shrink-0 overflow-hidden rounded-3xl bg-gradient-to-br from-brand via-emerald-400 to-brand-blue p-[3px] shadow-2xl sm:h-48 sm:w-40">
              <div className="relative h-full w-full overflow-hidden rounded-[22px] bg-white">
                <Image
                  src="/images/doctor.png"
                  alt="Dr. Farhana Islam"
                  fill
                  sizes="160px"
                  className="object-cover object-top"
                />
              </div>
              <span className="absolute -right-2 -bottom-2 inline-flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-[10px] font-black uppercase text-slate-900 shadow-lg">
                Verified
              </span>
            </div>

            <div>
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur">
                Expert Voice
              </span>
              <blockquote className="mt-4 text-2xl font-black leading-tight sm:text-3xl md:text-4xl">
                &ldquo;Oral health is the foundation of{" "}
                <span className="rainbow-text">overall well-being</span>. Choose the right care, for a lifetime of healthy smiles.&rdquo;
              </blockquote>
              <div className="mt-6 flex items-center gap-4">
                <div>
                  <div className="text-lg font-bold">Dr. Farhana Islam</div>
                  <div className="text-xs text-slate-300">BDS · Oral Health Specialist</div>
                </div>
                <div className="flex -space-x-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer review panel */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-8 ring-1 ring-emerald-100 sm:p-10">
          <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 animate-blob rounded-full bg-emerald-200/60 blur-3xl" />
          <div className="relative">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-brand-dark">
                  Reviews
                </span>
                <h3 className="mt-3 text-2xl font-black leading-tight text-slate-900">
                  Loved by thousands
                </h3>
              </div>
              <div className="text-right">
                <div className="display-font text-5xl font-black text-brand-dark">4.9</div>
                <div className="flex items-center justify-end gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} className="h-3.5 w-3.5" />
                  ))}
                </div>
                <div className="mt-0.5 text-[10px] font-semibold text-slate-500">
                  2,542 reviews
                </div>
              </div>
            </div>

            {/* Rating bars */}
            <div className="mt-5 space-y-1.5">
              {[
                { s: 5, p: 82 },
                { s: 4, p: 12 },
                { s: 3, p: 4 },
                { s: 2, p: 1 },
                { s: 1, p: 1 },
              ].map((r) => (
                <div key={r.s} className="flex items-center gap-3 text-xs">
                  <span className="w-3 font-semibold text-slate-600">{r.s}</span>
                  <StarIcon className="h-3 w-3" />
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand to-brand-blue"
                      style={{ width: `${r.p}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-slate-500">{r.p}%</span>
                </div>
              ))}
            </div>

            {/* Latest review */}
            <div className="mt-6 rounded-2xl bg-white p-5 ring-1 ring-slate-100">
              <div className="flex items-center gap-3">
                <span className="h-11 w-11 overflow-hidden rounded-full ring-2 ring-emerald-100">
                  <Image
                    src="/images/customer.png"
                    alt="Afsana Rahman"
                    width={44}
                    height={44}
                    className="h-full w-full object-cover"
                  />
                </span>
                <div>
                  <div className="text-sm font-bold text-slate-900">Afsana Rahman</div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <Stars value={5} />
                    <span>· Verified Buyer</span>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                &ldquo;Best quality products and super fast delivery! OralCareBD is my trusted online store for all oral care needs.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Instagram grid ---------- */

const instagramPosts = [
  { img: "/images/products/p01.png", tint: "from-emerald-100/70 to-white" },
  { img: "/images/products/p03.png", tint: "from-sky-100/70 to-white" },
  { img: "/images/products/p11.png", tint: "from-emerald-100/70 to-white" },
  { img: "/images/products/p08.png", tint: "from-blue-100/70 to-white" },
  { img: "/images/products/p12.png", tint: "from-emerald-100/70 to-white" },
  { img: "/images/products/p09.png", tint: "from-sky-100/70 to-white" },
];

function InstagramGrid() {
  return (
    <section className="mt-14">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-dark">
            @oralcarebd
          </span>
          <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
            Follow Our Smile Journey
          </h2>
        </div>
        <a
          href="https://www.instagram.com/"
          className="inline-flex items-center gap-1 text-sm font-semibold text-brand-blue-dark hover:underline"
        >
          Follow Us <InstagramIcon className="h-4 w-4" />
        </a>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {instagramPosts.map((p, i) => (
          <a
            key={i}
            href="#"
            className={`group relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br ${p.tint} ring-1 ring-slate-100`}
          >
            <Image
              src={p.img}
              alt=""
              fill
              sizes="(min-width: 1024px) 180px, (min-width: 640px) 33vw, 50vw"
              className="object-contain p-3 transition-transform duration-500 group-hover:scale-110"
              style={{ mixBlendMode: "multiply" }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-brand/0 opacity-0 transition group-hover:bg-brand/70 group-hover:opacity-100">
              <InstagramIcon className="h-7 w-7 text-white" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ---------- Newsletter ---------- */

function Newsletter() {
  return (
    <section className="relative mt-10 overflow-hidden rounded-2xl bg-emerald-50 p-6 sm:p-8">
      <div className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 sm:block">
        <Image src="/images/plant.png" alt="" width={85} height={125} className="h-28 w-auto" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-brand ring-1 ring-emerald-100">
            <MailIcon className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Join Our Smile Community!</h3>
            <p className="text-sm text-slate-600">
              Subscribe to get exclusive offers, dental tips and latest product updates.
            </p>
          </div>
        </div>
        <form action="#" className="flex w-full max-w-md rounded-full bg-white p-1 ring-1 ring-emerald-100">
          <input
            type="email"
            placeholder="Enter your email address"
            className="min-w-0 flex-1 bg-transparent px-5 text-sm outline-none placeholder:text-slate-400"
          />
          <button
            type="submit"
            className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            Subscribe
          </button>
        </form>
      </div>
      <p className="mt-3 text-center text-xs text-slate-500 lg:text-left">
        We respect your privacy. Unsubscribe anytime.
      </p>
    </section>
  );
}
