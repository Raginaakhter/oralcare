import Link from "next/link";
import { PageHero } from "@/components/SiteShell";
import {
  ArrowRightIcon,
  SparkIcon,
  WhatsappIcon,
  MailIcon,
  ShieldIcon,
  TruckIcon,
  ReturnIcon,
  HeadsetIcon,
} from "@/components/icons";
import { site } from "@/lib/site-data";

export const metadata = {
  title: "FAQ - OralCareBD",
  description: "Frequently asked questions about orders, delivery, products and returns.",
};

const groups = [
  {
    title: "Orders & Payment",
    icon: <ShieldIcon className="h-5 w-5" />,
    accent: "emerald",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept bKash, Nagad, Visa, Mastercard and Cash on Delivery (COD) for most locations in Bangladesh.",
      },
      {
        q: "Is Cash on Delivery available everywhere?",
        a: "COD is available for most areas inside Dhaka, Chittagong and major district towns. Pay the courier when your order arrives.",
      },
      {
        q: "Can I change my order after placing it?",
        a: "Yes - contact us within 2 hours of placing the order via WhatsApp (+61 451 807 841) and we'll update it before dispatch.",
      },
      {
        q: "Do you offer discounts for bulk orders?",
        a: "We do - message our team on WhatsApp for volume pricing on 10+ items.",
      },
    ],
  },
  {
    title: "Shipping & Delivery",
    icon: <TruckIcon className="h-5 w-5" />,
    accent: "blue",
    items: [
      {
        q: "How long does delivery take?",
        a: "Dhaka deliveries arrive in 1-2 business days. Outside Dhaka is typically 3-5 business days depending on your location.",
      },
      {
        q: "Is delivery free?",
        a: "Yes - delivery is free on all orders over ৳1,500. Orders below that pay a flat ৳120 shipping charge.",
      },
      {
        q: "Can I track my order?",
        a: "Absolutely. You'll get an SMS + email with your courier tracking link as soon as your order is dispatched.",
      },
      {
        q: "Do you deliver outside Bangladesh?",
        a: "Not currently. We only deliver within Bangladesh at the moment.",
      },
    ],
  },
  {
    title: "Products & Authenticity",
    icon: <SparkIcon className="h-5 w-5" />,
    accent: "emerald",
    items: [
      {
        q: "Are your products 100% authentic?",
        a: "Yes - every product is sourced directly from manufacturers or authorized distributors in Australia. We never sell counterfeits.",
      },
      {
        q: "Do you check expiry dates?",
        a: "Every product is quality-checked before dispatch. We guarantee at least 12 months of shelf life on every item unless stated otherwise.",
      },
      {
        q: "Can you recommend a product for my routine?",
        a: "Yes - WhatsApp our care team with your current routine and concerns, and we'll suggest the right picks for you.",
      },
      {
        q: "What if a product is out of stock?",
        a: "Message us on WhatsApp and we'll let you know the restock ETA - usually 1-2 weeks.",
      },
    ],
  },
  {
    title: "Returns & Refunds",
    icon: <ReturnIcon className="h-5 w-5" />,
    accent: "blue",
    items: [
      {
        q: "What is your return policy?",
        a: "Unopened items can be returned within 7 days of delivery. Hygiene-sealed items (toothbrushes, mouth guards) are non-returnable once opened.",
      },
      {
        q: "How do I request a refund?",
        a: "Call or WhatsApp us within 7 days of delivery. We'll arrange a pickup and refund to your original payment method within 5-7 business days.",
      },
      {
        q: "What if my order arrives damaged?",
        a: "Send us a photo on WhatsApp within 48 hours of delivery and we'll replace the item at no cost.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <>
      <PageHero
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about orders, delivery, products and returns."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
      />

      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            {groups.map((g) => {
              const bubble =
                g.accent === "blue"
                  ? "bg-brand-blue-soft text-brand-blue-dark"
                  : "bg-brand-soft text-brand-dark";
              return (
                <section key={g.title}>
                  <div className="mb-5 flex items-center gap-3">
                    <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${bubble}`}>
                      {g.icon}
                    </span>
                    <h2 className="text-xl font-extrabold text-slate-900">{g.title}</h2>
                  </div>
                  <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-100">
                    {g.items.map((it) => (
                      <details key={it.q} className="group">
                        <summary className="flex cursor-pointer items-start justify-between gap-4 px-6 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
                          {it.q}
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-dark transition group-open:rotate-45">
                            +
                          </span>
                        </summary>
                        <div className="px-6 pb-5 text-sm text-slate-600">{it.a}</div>
                      </details>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-3xl bg-gradient-to-br from-brand via-emerald-500 to-brand-blue p-6 text-white">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                <HeadsetIcon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 text-lg font-extrabold">Still have questions?</h3>
              <p className="mt-1 text-sm opacity-90">
                Our customer care team is just a tap away.
              </p>
              <div className="mt-5 space-y-2">
                <a
                  href={site.phoneHref}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-brand-dark hover:bg-slate-100"
                >
                  <WhatsappIcon className="h-4 w-4" />
                  WhatsApp Us
                </a>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/30 hover:bg-white/20"
                >
                  <MailIcon className="h-4 w-4" />
                  Email Us
                </a>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Quick Links</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {[
                  { label: "Shipping & Delivery", href: "/return-refund-policy" },
                  { label: "Privacy Policy", href: "/privacy-policy" },
                  { label: "Return & Refund Policy", href: "/return-refund-policy" },
                  { label: "Contact Us", href: "/contact-us" },
                ].map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="inline-flex items-center gap-1.5 hover:text-brand-dark"
                    >
                      <ArrowRightIcon className="h-3 w-3" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
