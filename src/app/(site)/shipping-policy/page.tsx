import Link from "next/link";
import { PageHero } from "@/components/SiteShell";
import {
  TruckIcon,
  CheckBadgeIcon,
  ShieldIcon,
  ArrowRightIcon,
} from "@/components/icons";

export const metadata = {
  title: "Shipping & Delivery - OralCareBD",
  description: "Shipping zones, delivery timelines and costs across Bangladesh.",
};

export default function ShippingPolicyPage() {
  return (
    <>
      <PageHero
        title="Shipping & Delivery"
        subtitle="Fast, tracked delivery across Bangladesh — free over ৳1,500."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Shipping Policy" },
        ]}
      />

      <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero stats */}
        <div className="grid gap-5 sm:grid-cols-3">
          <StatCard
            icon={<TruckIcon className="h-5 w-5" />}
            number="1–2"
            unit="days"
            label="Inside Dhaka"
          />
          <StatCard
            icon={<CheckBadgeIcon className="h-5 w-5" />}
            number="3–5"
            unit="days"
            label="Outside Dhaka"
          />
          <StatCard
            icon={<ShieldIcon className="h-5 w-5" />}
            number="৳1,500+"
            unit=""
            label="Free Shipping"
          />
        </div>

        {/* Zones table */}
        <section className="mt-10 overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200">
          <div className="border-b border-slate-100 bg-brand-soft px-6 py-5">
            <h2 className="text-lg font-black text-slate-900">
              Shipping Zones & Costs
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Delivery charges apply to orders under ৳1,500. All orders above
              qualify for free shipping.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-3">Zone</th>
                  <th className="px-6 py-3">Delivery Time</th>
                  <th className="px-6 py-3">Standard Charge</th>
                  <th className="px-6 py-3">Free Shipping</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <ZoneRow
                  zone="Dhaka Metro"
                  time="1–2 business days"
                  charge="৳60"
                  free="orders ৳1,000+"
                />
                <ZoneRow
                  zone="Dhaka Suburbs"
                  time="2–3 business days"
                  charge="৳90"
                  free="orders ৳1,200+"
                />
                <ZoneRow
                  zone="Chattogram, Sylhet, Rajshahi"
                  time="3–4 business days"
                  charge="৳120"
                  free="orders ৳1,500+"
                />
                <ZoneRow
                  zone="All Other Districts"
                  time="3–5 business days"
                  charge="৳150"
                  free="orders ৳1,500+"
                />
                <ZoneRow
                  zone="Remote / Island Areas"
                  time="5–7 business days"
                  charge="৳200"
                  free="orders ৳2,000+"
                />
              </tbody>
            </table>
          </div>
        </section>

        {/* Process */}
        <section className="mt-12">
          <h2 className="text-2xl font-black text-slate-900">How We Ship</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StepCard
              step="01"
              title="Order Placed"
              desc="Your order is received and payment is verified."
            />
            <StepCard
              step="02"
              title="Packed & Prepared"
              desc="Items are picked, inspected, and packed within 24 hours."
            />
            <StepCard
              step="03"
              title="In Transit"
              desc="Handed over to Steadfast, Pathao or RedX with tracking."
            />
            <StepCard
              step="04"
              title="Delivered"
              desc="Hand-delivered to your door with SMS confirmation."
            />
          </div>
        </section>

        {/* Carriers */}
        <section className="mt-12">
          <h2 className="text-2xl font-black text-slate-900">
            Our Delivery Partners
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {["Steadfast Courier", "Pathao Courier", "RedX"].map((name) => (
              <div
                key={name}
                className="rounded-2xl bg-white p-5 text-center ring-1 ring-slate-200"
              >
                <div className="flex h-12 items-center justify-center text-lg font-black text-slate-900">
                  {name}
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  Nationwide tracked delivery
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-12 space-y-3">
          <h2 className="text-2xl font-black text-slate-900">Shipping FAQ</h2>
          {[
            {
              q: "Do you offer same-day delivery?",
              a: "Yes — orders placed before 12 PM within Dhaka Metro can be delivered the same day for a ৳200 express fee. Select Same Day at checkout.",
            },
            {
              q: "Can I change my shipping address after ordering?",
              a: "Yes, contact us on WhatsApp within 2 hours of placing the order. Once dispatched, the address cannot be changed.",
            },
            {
              q: "What happens if I'm not home during delivery?",
              a: "Our courier will call you to reschedule. If unreachable for 3 attempts, the order is returned to our warehouse and a refund is processed.",
            },
            {
              q: "Do you ship outside Bangladesh?",
              a: "Not currently. We only deliver within Bangladesh. International shipping is planned for 2027.",
            },
            {
              q: "How do I track my order?",
              a: "You'll receive a tracking SMS + email within 24 hours of dispatch. You can also track anytime on our Track Order page.",
            },
          ].map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl bg-white p-5 ring-1 ring-slate-200"
            >
              <summary className="flex cursor-pointer items-start justify-between gap-4 text-sm font-bold text-slate-900">
                {item.q}
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-dark transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-slate-600">{item.a}</p>
            </details>
          ))}
        </section>

        {/* CTA */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-brand via-brand to-brand-dark p-8 text-white">
          <div>
            <h2 className="text-xl font-black">Ready to Shop?</h2>
            <p className="mt-1 text-sm opacity-90">
              Free delivery on orders over ৳1,500 — nationwide.
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-brand-dark hover:bg-slate-100"
          >
            Shop Now
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </main>
    </>
  );
}

function StatCard({
  icon,
  number,
  unit,
  label,
}: {
  icon: React.ReactNode;
  number: string;
  unit: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 text-center ring-1 ring-slate-200">
      <div className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand-dark">
        {icon}
      </div>
      <div className="mt-3 flex items-baseline justify-center gap-1">
        <span className="text-3xl font-black text-slate-900">{number}</span>
        {unit && <span className="text-sm font-semibold text-slate-500">{unit}</span>}
      </div>
      <div className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">
        {label}
      </div>
    </div>
  );
}

function ZoneRow({
  zone,
  time,
  charge,
  free,
}: {
  zone: string;
  time: string;
  charge: string;
  free: string;
}) {
  return (
    <tr className="hover:bg-slate-50">
      <td className="px-6 py-4 font-bold text-slate-900">{zone}</td>
      <td className="px-6 py-4 text-slate-700">{time}</td>
      <td className="px-6 py-4 font-bold text-slate-900">{charge}</td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-bold text-brand-dark">
          {free}
        </span>
      </td>
    </tr>
  );
}

function StepCard({
  step,
  title,
  desc,
}: {
  step: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
      <div className="display-font text-3xl font-black text-brand/30">
        {step}
      </div>
      <h3 className="mt-2 text-base font-black text-slate-900">{title}</h3>
      <p className="mt-1 text-xs text-slate-600">{desc}</p>
    </div>
  );
}
