import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/SiteShell";
import {
  ShieldIcon,
  TruckIcon,
  CheckBadgeIcon,
  HeadsetIcon,
  SparkIcon,
  ArrowRightIcon,
} from "@/components/icons";

export const metadata = {
  title: "About Us - OralCareBD",
  description:
    "Oral Care BD brings the best of Australian oral care products to your doorstep with quality and convenience.",
};

const values = [
  {
    icon: <ShieldIcon className="h-6 w-6" />,
    title: "100% Authentic",
    desc: "Every product is sourced directly from the manufacturer or authorized distributor.",
    accent: "emerald",
  },
  {
    icon: <CheckBadgeIcon className="h-6 w-6" />,
    title: "Expert Approved",
    desc: "Our catalog is curated with input from practicing dentists and oral health specialists.",
    accent: "blue",
  },
  {
    icon: <TruckIcon className="h-6 w-6" />,
    title: "Fast Delivery",
    desc: "Nationwide fulfilment across Bangladesh with cash on delivery and tracked shipping.",
    accent: "emerald",
  },
  {
    icon: <HeadsetIcon className="h-6 w-6" />,
    title: "24/7 Support",
    desc: "Our customer care team responds within minutes - call, WhatsApp or email us anytime.",
    accent: "blue",
  },
];

const stats = [
  { v: "10K+", l: "Happy Customers" },
  { v: "100+", l: "Products" },
  { v: "8", l: "Trusted Brands" },
  { v: "4.9", l: "Average Rating" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About OralCareBD"
        subtitle="Your trusted destination for authentic Australian oral care, delivered fresh to every corner of Bangladesh."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
      />

      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Story */}
        <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-dark">
              Our Story
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Bringing Australia&apos;s Best to Bangladesh
            </h2>
            <p className="mt-4 text-slate-600">
              OralCareBD started with a simple idea — every family in Bangladesh deserves access to the same high-quality, dentist-recommended oral care products available in Australia.
            </p>
            <p className="mt-3 text-slate-600">
              We work directly with Australian distributors and manufacturers to source 100% authentic Sensodyne, White Glo, TheraBreath, Steradent and more — then deliver them to your doorstep with fast, reliable shipping.
            </p>
            <p className="mt-3 text-slate-600">
              No fakes. No shortcuts. Just honest care, every day.
            </p>
            <div className="mt-6 flex gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-dark"
              >
                Shop Our Catalog <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                href="/contact-us"
                className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 hover:border-slate-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
          <div className="relative mx-auto h-80 w-full max-w-md sm:h-96">
            <div className="pointer-events-none absolute -top-6 -right-6 h-48 w-48 animate-blob rounded-full bg-emerald-200/60 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 -left-6 h-48 w-48 animate-blob rounded-full bg-sky-200/60 blur-3xl" />
            <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-400 via-emerald-500 to-brand-blue p-[3px] shadow-2xl">
              <div className="relative h-full w-full overflow-hidden rounded-[2.3rem] bg-white">
                <Image
                  src="/images/models/dentist.jpg"
                  alt="Dental professional in clinic"
                  fill
                  sizes="(min-width: 768px) 400px, 90vw"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand/30 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-16 overflow-hidden rounded-3xl bg-gradient-to-r from-brand via-emerald-500 to-brand-blue p-8 text-white">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.l} className="text-center">
                <div className="text-4xl font-extrabold">{s.v}</div>
                <div className="mt-1 text-sm opacity-90">{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="mt-16">
          <div className="mb-8 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-blue-dark">
              Our Promise
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
              What Makes Us Different
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => {
              const bubble =
                v.accent === "blue"
                  ? "bg-brand-blue-soft text-brand-blue-dark"
                  : "bg-brand-soft text-brand-dark";
              return (
                <div
                  key={v.title}
                  className="rounded-2xl bg-white p-6 ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-100"
                >
                  <span
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${bubble}`}
                  >
                    {v.icon}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-slate-900">{v.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Mission */}
        <section className="mt-16 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-8 ring-1 ring-emerald-100 sm:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <SparkIcon className="mx-auto h-8 w-8 text-brand" />
            <h2 className="mt-3 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              &ldquo;Oral health is the foundation of overall well-being.&rdquo;
            </h2>
            <p className="mt-4 text-slate-600">
              That belief drives everything we do — from the brands we stock to the way we handle every single order. We want every smile in Bangladesh to shine a little brighter.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
