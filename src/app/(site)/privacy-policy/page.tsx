import { PageHero } from "@/components/SiteShell";
import { ShieldIcon, MailIcon, ArrowRightIcon } from "@/components/icons";
import { site } from "@/lib/site-data";

export const metadata = {
  title: "Privacy Policy - OralCareBD",
  description: "How OralCareBD collects, uses and protects your personal data.",
};

const sections = [
  {
    title: "What We Collect",
    body: [
      "Contact details you give us when you check out, create an account, or write to us — name, address, phone number and email.",
      "Order history and payment metadata (last 4 digits only — we do not store full card numbers).",
      "Standard web data from your visit — IP address, device type, pages viewed — to keep the site fast and safe.",
    ],
  },
  {
    title: "How We Use It",
    body: [
      "To process and deliver your orders, send tracking updates, and handle returns.",
      "To respond to your questions by phone, WhatsApp or email.",
      "To send occasional offers and dental tips — only if you asked us to by subscribing to our newsletter.",
      "To keep the site working: diagnosing issues, preventing fraud and improving the shopping experience.",
    ],
  },
  {
    title: "Who We Share It With",
    body: [
      "Trusted courier partners, so your order can be delivered.",
      "Payment processors (bKash, Nagad, Stripe) for secure transactions. They see what they need to charge your card, nothing more.",
      "We never sell your data to advertisers or third parties.",
    ],
  },
  {
    title: "Cookies",
    body: [
      "We use essential cookies to remember your cart and keep you logged in.",
      "Analytics cookies help us understand which pages people use. You can disable these in your browser without breaking the site.",
    ],
  },
  {
    title: "Your Rights",
    body: [
      "You can ask us for a copy of the personal data we hold about you.",
      "You can ask us to correct or delete it at any time.",
      "You can unsubscribe from marketing emails with one click at the bottom of any email we send.",
    ],
  },
  {
    title: "Changes to This Policy",
    body: [
      "If we change how we handle data, we'll post the updated policy here with a new effective date. Material changes get a notice at the top of this page for 30 days.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        title="Privacy Policy"
        subtitle="How we collect, use and protect your personal information."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
      />

      <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Intro card */}
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand via-emerald-500 to-brand-blue p-8 text-white">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
            <ShieldIcon className="h-6 w-6" />
          </span>
          <h2 className="mt-4 text-2xl font-extrabold">Your Trust Matters</h2>
          <p className="mt-3 max-w-2xl text-sm opacity-90">
            We built OralCareBD on trust — and that starts with how we treat your personal data. This policy explains what we collect, why we collect it, and what you can do about it.
          </p>
          <p className="mt-4 text-xs opacity-75">Effective date: 1 November 2026</p>
        </div>

        {/* Sections */}
        <div className="mt-10 space-y-8">
          {sections.map((s, i) => (
            <section
              key={s.title}
              className="rounded-2xl bg-white p-6 ring-1 ring-slate-100 sm:p-8"
            >
              <div className="flex items-start gap-4">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-sm font-extrabold text-brand-dark">
                  0{i + 1}
                </span>
                <div className="flex-1">
                  <h3 className="text-lg font-extrabold text-slate-900">{s.title}</h3>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    {s.body.map((line, j) => (
                      <li key={j} className="flex gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-10 rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-8 ring-1 ring-emerald-100">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Questions about your data?</h3>
              <p className="mt-1 text-sm text-slate-600">
                Email us anytime — we respond within 48 hours.
              </p>
            </div>
            <a
              href={`mailto:${site.email}`}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-dark"
            >
              <MailIcon className="h-4 w-4" />
              {site.email}
              <ArrowRightIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
