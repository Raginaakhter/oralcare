import Link from "next/link";
import { PageHero } from "@/components/SiteShell";
import { ShieldIcon, CheckBadgeIcon, MailIcon } from "@/components/icons";

export const metadata = {
  title: "Terms & Conditions - OralCareBD",
  description: "The rules that govern your use of OralCareBD.",
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: [
      "By accessing or using OralCareBD (the \"Service\"), you agree to be bound by these Terms & Conditions. If you disagree with any part, please do not use the Service.",
      "We may update these terms at any time. Continued use after changes means you accept the revised terms.",
    ],
  },
  {
    title: "2. Account Registration",
    body: [
      "You must provide accurate, current, and complete information when creating an account. You are responsible for maintaining the security of your account credentials.",
      "You must notify us immediately of any unauthorized use of your account.",
    ],
  },
  {
    title: "3. Product Information & Pricing",
    body: [
      "We strive to display accurate product information and pricing. However, errors may occur. We reserve the right to correct errors, cancel orders, and refuse service at our discretion.",
      "All prices are in Bangladeshi Taka (৳) and inclusive of applicable taxes unless otherwise stated.",
    ],
  },
  {
    title: "4. Orders & Payment",
    body: [
      "All orders are subject to acceptance and availability. We may cancel orders due to pricing errors, stockouts, or suspected fraud.",
      "Accepted payment methods: bKash, Nagad, Visa/Mastercard, and Cash on Delivery (where available).",
      "Your payment is processed securely by third-party providers. We do not store full card details.",
    ],
  },
  {
    title: "5. Shipping & Delivery",
    body: [
      "Delivery times are estimates and not guaranteed. Shipping is covered by our Shipping Policy.",
      "Risk of loss passes to you upon delivery. You must inspect the package upon receipt and report damaged items within 48 hours.",
    ],
  },
  {
    title: "6. Returns & Refunds",
    body: [
      "Unopened products may be returned within 7 days of delivery for a full refund. See our Return & Refund Policy for full details.",
      "Hygiene-sealed items (toothbrushes, mouth guards, flossers) are non-returnable once the seal is broken.",
    ],
  },
  {
    title: "7. Intellectual Property",
    body: [
      "All content on OralCareBD (logos, images, text, design) is owned by us or licensed to us. You may not copy, reproduce, or distribute it without permission.",
      "Product names and brand marks belong to their respective owners.",
    ],
  },
  {
    title: "8. Prohibited Uses",
    body: [
      "You may not use the Service for any illegal purpose, to harass others, to transmit malware, to attempt unauthorized access to our systems, or to scrape data at scale.",
    ],
  },
  {
    title: "9. Limitation of Liability",
    body: [
      "To the maximum extent permitted by law, OralCareBD is not liable for indirect, incidental, or consequential damages arising from your use of the Service.",
      "Our total liability for any claim is limited to the amount you paid for the specific product giving rise to the claim.",
    ],
  },
  {
    title: "10. Health Disclaimer",
    body: [
      "Products sold on OralCareBD are not a substitute for professional dental or medical advice. Consult a licensed dentist for health concerns.",
      "Always read product labels carefully and follow directions for use.",
    ],
  },
  {
    title: "11. Governing Law",
    body: [
      "These terms are governed by the laws of Bangladesh. Disputes shall be resolved exclusively in the courts of Dhaka, Bangladesh.",
    ],
  },
  {
    title: "12. Contact Us",
    body: [
      "Questions about these terms? Email us at smile@oralcarebd.com or WhatsApp +61 451 807 841.",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero
        title="Terms & Conditions"
        subtitle="Last updated: November 10, 2026"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Terms" }]}
      />

      <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Intro card */}
        <div className="flex items-start gap-4 rounded-3xl bg-brand-soft p-6 ring-1 ring-brand/15">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-brand-dark">
            <ShieldIcon className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-black text-slate-900">
              Please Read Carefully
            </h2>
            <p className="mt-1 text-sm text-slate-700">
              These terms govern your use of OralCareBD. By placing an order,
              creating an account, or browsing our site, you agree to be bound
              by the terms below.
            </p>
          </div>
        </div>

        {/* TOC */}
        <aside className="mt-8 rounded-2xl bg-white p-6 ring-1 ring-slate-200">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            On this page
          </div>
          <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            {sections.map((s, i) => (
              <li key={s.title}>
                <a
                  href={`#section-${i + 1}`}
                  className="inline-flex items-center gap-2 text-slate-700 hover:text-brand-dark"
                >
                  <CheckBadgeIcon className="h-3.5 w-3.5 text-brand" />
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        {/* Sections */}
        <div className="mt-8 space-y-6">
          {sections.map((s, i) => (
            <section
              id={`section-${i + 1}`}
              key={s.title}
              className="scroll-mt-24 rounded-2xl bg-white p-6 ring-1 ring-slate-200 sm:p-8"
            >
              <h2 className="text-lg font-black text-slate-900">{s.title}</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-700">
                {s.body.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-gradient-to-br from-brand-soft via-white to-brand-soft p-8 ring-1 ring-brand/15">
          <div>
            <h3 className="text-lg font-black text-slate-900">Still have questions?</h3>
            <p className="mt-1 text-sm text-slate-600">
              Email us and we&apos;ll respond within 48 hours.
            </p>
          </div>
          <a
            href="mailto:smile@oralcarebd.com"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand/30 hover:-translate-y-0.5 hover:bg-brand-dark"
          >
            <MailIcon className="h-4 w-4" />
            smile@oralcarebd.com
          </a>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
          <Link href="/privacy-policy" className="hover:text-brand-dark">
            Privacy Policy
          </Link>
          <span>·</span>
          <Link href="/return-refund-policy" className="hover:text-brand-dark">
            Return & Refund
          </Link>
          <span>·</span>
          <Link href="/shipping-policy" className="hover:text-brand-dark">
            Shipping Policy
          </Link>
        </div>
      </main>
    </>
  );
}
