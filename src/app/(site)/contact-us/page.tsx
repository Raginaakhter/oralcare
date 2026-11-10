import { PageHero } from "@/components/SiteShell";
import {
  PhoneIcon,
  MailIcon,
  PinIcon,
  WhatsappIcon,
  FacebookIcon,
  InstagramIcon,
  SparkIcon,
  ArrowRightIcon,
} from "@/components/icons";
import { site } from "@/lib/site-data";

export const metadata = {
  title: "Contact Us - OralCareBD",
  description: "Get in touch with OralCareBD - WhatsApp, email, or visit us.",
};

const contactCards: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  accent: "emerald" | "blue";
}[] = [
  {
    icon: <PhoneIcon className="h-6 w-6" />,
    label: "Call / WhatsApp",
    value: site.phone,
    href: site.phoneHref,
    accent: "emerald",
  },
  {
    icon: <MailIcon className="h-6 w-6" />,
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
    accent: "blue",
  },
  {
    icon: <PinIcon className="h-6 w-6" />,
    label: "Address",
    value: site.address,
    accent: "emerald",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Get in Touch"
        subtitle="Questions about a product, your order, or oral care in general? We reply within hours."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact Us" }]}
      />

      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Quick contact cards */}
        <section className="grid gap-5 sm:grid-cols-3">
          {contactCards.map((c) => {
            const bubble =
              c.accent === "blue"
                ? "bg-brand-blue-soft text-brand-blue-dark"
                : "bg-brand-soft text-brand-dark";
            const inner = (
              <>
                <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${bubble}`}>
                  {c.icon}
                </span>
                <div className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  {c.label}
                </div>
                <div className="mt-1 text-base font-semibold text-slate-900 group-hover:text-brand-dark">
                  {c.value}
                </div>
              </>
            );
            return c.href ? (
              <a
                key={c.label}
                href={c.href}
                className="group rounded-2xl bg-white p-6 ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-100"
              >
                {inner}
              </a>
            ) : (
              <div
                key={c.label}
                className="group rounded-2xl bg-white p-6 ring-1 ring-slate-100"
              >
                {inner}
              </div>
            );
          })}
        </section>

        {/* Form + Map */}
        <section className="mt-12 grid gap-10 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl bg-white p-8 ring-1 ring-slate-100">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 animate-blob rounded-full bg-emerald-100/60 blur-3xl" />
            <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 animate-blob rounded-full bg-sky-100/60 blur-3xl" />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-dark">
                <SparkIcon className="h-3.5 w-3.5" />
                Send Us a Message
              </span>
              <h2 className="mt-3 text-2xl font-extrabold text-slate-900">
                We&apos;d Love to Hear From You
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Fill in your details and we&apos;ll get back to you within 24 hours.
              </p>

              <form action="#" className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full Name" name="name" placeholder="Your full name" />
                  <Field label="Phone" name="phone" placeholder="01XXXXXXXXX" />
                </div>
                <Field label="Email Address" name="email" type="email" placeholder="you@example.com" />
                <Field label="Subject" name="subject" placeholder="How can we help?" />
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    placeholder="Tell us a bit more..."
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-dark"
                >
                  Send Message <ArrowRightIcon className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand via-emerald-500 to-brand-blue p-8 text-white">
              <h3 className="text-xl font-extrabold">Prefer to Chat?</h3>
              <p className="mt-2 text-sm opacity-90">
                Our customer care team is online all day — tap to start a WhatsApp chat.
              </p>
              <a
                href={site.phoneHref}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-brand-dark hover:bg-slate-100"
              >
                <WhatsappIcon className="h-4 w-4" />
                Chat on WhatsApp
              </a>
            </div>

            <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Business Hours</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li className="flex justify-between">
                  <span>Sunday - Thursday</span>
                  <span className="font-semibold text-slate-900">9:00 AM - 9:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Friday</span>
                  <span className="font-semibold text-slate-900">2:00 PM - 9:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-semibold text-slate-900">10:00 AM - 8:00 PM</span>
                </li>
              </ul>
            </div>

            <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Follow Us</h3>
              <div className="mt-4 flex gap-3">
                <SocialIcon icon={<FacebookIcon />} href="https://facebook.com/" label="Facebook" />
                <SocialIcon icon={<InstagramIcon />} href="https://instagram.com/" label="Instagram" />
                <SocialIcon icon={<WhatsappIcon />} href={site.phoneHref} label="WhatsApp" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-slate-700">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
    </div>
  );
}

function SocialIcon({ icon, href, label }: { icon: React.ReactNode; href: string; label: string }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-brand-dark transition hover:bg-brand hover:text-white"
    >
      {icon}
    </a>
  );
}
