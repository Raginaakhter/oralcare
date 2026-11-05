import { PageHero } from "@/components/SiteShell";
import {
  ReturnIcon,
  TruckIcon,
  ShieldIcon,
  CheckBadgeIcon,
  WhatsappIcon,
  ArrowRightIcon,
} from "@/components/icons";
import { site } from "@/lib/site-data";

export const metadata = {
  title: "Return & Refund Policy - OralCareBD",
  description:
    "7-day easy return policy on all unopened items. How to request a refund or replacement.",
};

const steps = [
  {
    n: "01",
    title: "Contact Us Within 7 Days",
    desc: "WhatsApp or email us within 7 days of delivery with your order number and reason.",
    accent: "emerald",
  },
  {
    n: "02",
    title: "Pack the Item",
    desc: "Keep the product unopened and in its original packaging with the invoice inside.",
    accent: "blue",
  },
  {
    n: "03",
    title: "Pickup Arranged",
    desc: "Our courier collects the parcel from your doorstep at no cost.",
    accent: "emerald",
  },
  {
    n: "04",
    title: "Refund Processed",
    desc: "Once we inspect the item, your refund lands back in your account in 5-7 business days.",
    accent: "blue",
  },
];

const eligible = [
  "Unopened products in original packaging",
  "Items received damaged in transit (within 48 hours of delivery)",
  "Wrong item delivered",
  "Expired or short-dated products",
];

const nonEligible = [
  "Opened hygiene-sealed items (toothbrushes, mouth guards, floss, mouthwash)",
  "Items marked \"final sale\" on the product page",
  "Products damaged after delivery due to misuse",
  "Returns requested after 7 days of delivery",
];

export default function ReturnPolicyPage() {
  return (
    <>
      <PageHero
        title="Return &amp; Refund Policy"
        subtitle="We stand behind every product we sell. Here's how returns work."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Return & Refund Policy" },
        ]}
      />

      <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero card */}
        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-100 via-white to-sky-100 p-8 ring-1 ring-emerald-100 sm:p-10">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-dark shadow-sm">
                <ReturnIcon className="h-3.5 w-3.5" />
                Hassle-Free Returns
              </span>
              <h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                7-Day Easy Returns
              </h2>
              <p className="mt-3 max-w-xl text-slate-600">
                Not what you expected? Return unopened products within 7 days of delivery for a full refund — no questions asked.
              </p>
            </div>
            <a
              href={site.phoneHref}
              className="inline-flex items-center gap-2 self-start rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-dark"
            >
              <WhatsappIcon className="h-4 w-4" />
              Request Return
            </a>
          </div>
        </section>

        {/* Steps */}
        <section className="mt-12">
          <h2 className="mb-6 text-2xl font-extrabold text-slate-900">
            How It Works
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => {
              const bubble =
                s.accent === "blue"
                  ? "bg-brand-blue-soft text-brand-blue-dark"
                  : "bg-brand-soft text-brand-dark";
              return (
                <div
                  key={s.n}
                  className="rounded-2xl bg-white p-6 ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-100"
                >
                  <span
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-xl text-sm font-extrabold ${bubble}`}
                  >
                    {s.n}
                  </span>
                  <h3 className="mt-4 text-base font-bold text-slate-900">{s.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Eligible / Non-eligible */}
        <section className="mt-12 grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 ring-1 ring-emerald-100">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand-dark">
              <CheckBadgeIcon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-xl font-extrabold text-slate-900">
              Eligible for Return
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              {eligible.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-white p-8 ring-1 ring-rose-100">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <ReturnIcon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-xl font-extrabold text-slate-900">
              Not Eligible for Return
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              {nonEligible.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-rose-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Refund timeline + delivery */}
        <section className="mt-12 grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl bg-gradient-to-br from-brand-soft via-white to-sky-50 p-8 ring-1 ring-emerald-100">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white text-brand ring-1 ring-emerald-100">
              <TruckIcon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-lg font-extrabold text-slate-900">
              Refund Timelines
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <span className="font-semibold text-slate-900">bKash / Nagad:</span> 2-3 business days
              </li>
              <li>
                <span className="font-semibold text-slate-900">Credit / Debit card:</span> 5-7 business days
              </li>
              <li>
                <span className="font-semibold text-slate-900">COD orders:</span> bank transfer within 5 business days
              </li>
            </ul>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-brand-blue-soft via-white to-emerald-50 p-8 ring-1 ring-blue-100">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white text-brand-blue-dark ring-1 ring-blue-100">
              <ShieldIcon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-lg font-extrabold text-slate-900">
              Our Promise
            </h3>
            <p className="mt-3 text-sm text-slate-600">
              If a product isn&apos;t right for you, we&apos;ll make it right. We cover return shipping on all defective or wrongly-shipped items — no excuses.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="mt-12 rounded-3xl bg-gradient-to-r from-brand via-emerald-500 to-brand-blue p-8 text-center text-white">
          <h3 className="text-2xl font-extrabold">Need to return something?</h3>
          <p className="mx-auto mt-2 max-w-md text-sm opacity-90">
            Our care team handles returns personally — tap below and we&apos;ll take care of the rest.
          </p>
          <a
            href={site.phoneHref}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-dark hover:bg-slate-100"
          >
            Start a Return <ArrowRightIcon className="h-4 w-4" />
          </a>
        </div>
      </main>
    </>
  );
}
