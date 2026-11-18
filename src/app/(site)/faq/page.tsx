"use client";

import React, { useState } from "react";
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
  SearchIcon,
} from "@/components/icons";
import { site } from "@/lib/site-data";

const initialGroups = [
  {
    title: "Orders & Payment",
    icon: <ShieldIcon className="h-5 w-5" />,
    accent: "emerald",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept bKash, Nagad, Visa, Mastercard, and Cash on Delivery (COD) across all 64 districts in Bangladesh.",
      },
      {
        q: "Is Cash on Delivery available everywhere in Bangladesh?",
        a: "Yes! COD is available for both inside Dhaka and all district/sub-district towns. You can inspect the outer parcel and pay the delivery rider in cash upon receiving.",
      },
      {
        q: "How do I pay with bKash or Nagad?",
        a: "During checkout, select bKash or Nagad. Send the total amount to our verified merchant/wallet number: 01712-345678. Then paste your Transaction ID (TrxID) in the checkout field.",
      },
      {
        q: "Can I cancel or modify my order after placing it?",
        a: "Yes. Simply message us on WhatsApp (+61 451 807 841) within 2 hours of placing the order before it is dispatched to the courier.",
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
        a: "Inside Dhaka deliveries arrive in 24 to 48 hours. Deliveries outside Dhaka take 2 to 4 business days via Steadfast or Pathao Express.",
      },
      {
        q: "How do I qualify for Free Delivery?",
        a: "Free delivery applies automatically on any order of ৳1,500 or more! For orders below ৳1,500, delivery is ৳60 inside Dhaka and ৳120 outside Dhaka.",
      },
      {
        q: "How can I track my shipment?",
        a: "As soon as your package is dispatched, you will receive an SMS and email with your tracking code. You can also track anytime on our 'Track Order' page.",
      },
    ],
  },
  {
    title: "Products & Authenticity",
    icon: <SparkIcon className="h-5 w-5" />,
    accent: "emerald",
    items: [
      {
        q: "Are your oral care products 100% authentic Australian imports?",
        a: "Yes, without exception. Every tube of toothpaste, whitening kit, and mouthwash is sourced directly from licensed Australian manufacturers and distributors. We provide tamper-evident hygiene seals on every unit.",
      },
      {
        q: "What shelf life is guaranteed?",
        a: "Every product sent from our Dhaka fulfillment center is guaranteed to have at least 12 to 24 months of remaining shelf life. We never sell near-expiry goods.",
      },
      {
        q: "Which product should I choose for sensitive teeth?",
        a: "Sensodyne Rapid Relief or Sensodyne Pronamel Daily Protection are clinically proven formulas containing Potassium Nitrate and Fluoride that soothe tooth nerves within 60 seconds.",
      },
      {
        q: "Is teeth whitening safe for daily use?",
        a: "Our White Glo PAP+ and Purple Color Corrector formulations are completely peroxide-free and enamel-safe, designed for daily or weekly use without neural sensitivity.",
      },
    ],
  },
  {
    title: "Returns & Refunds",
    icon: <ReturnIcon className="h-5 w-5" />,
    accent: "blue",
    items: [
      {
        q: "What is your 7-Day return policy?",
        a: "Unopened products in their original packaging can be returned within 7 days of delivery for a replacement or full refund. Due to health hygiene regulations, opened brushes or toothpastes with broken seals cannot be returned.",
      },
      {
        q: "How fast are bKash refunds processed?",
        a: "Once our courier picks up and inspects the return parcel, refunds are transferred directly back to your bKash or Nagad wallet within 24 to 48 hours.",
      },
      {
        q: "What if my parcel arrives damaged?",
        a: "Please photograph the parcel and message our WhatsApp helpline within 48 hours. We dispatch a brand new replacement immediately at zero extra charge.",
      },
    ],
  },
];

export default function FAQPage() {
  const [search, setSearch] = useState("");

  const filteredGroups = initialGroups
    .map((g) => ({
      ...g,
      items: g.items.filter(
        (it) =>
          !search.trim() ||
          it.q.toLowerCase().includes(search.toLowerCase()) ||
          it.a.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      <PageHero
        title="Frequently Asked Questions"
        subtitle="Quick answers about authentic Australian oral care, delivery zones, bKash payments, and 7-day returns."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
      />

      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="mb-10 mx-auto max-w-xl">
          <div className="relative">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions (e.g. shipping, bKash, sensitivity, returns)..."
              className="h-12 w-full rounded-full border border-slate-200 bg-white pl-5 pr-12 text-sm shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <span className="pointer-events-none absolute right-4 top-3.5 text-slate-400">
              <SearchIcon className="h-5 w-5" />
            </span>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          {/* FAQ Accordion Groups */}
          <div className="space-y-10">
            {filteredGroups.length === 0 ? (
              <div className="rounded-3xl bg-white p-12 text-center ring-1 ring-slate-100 shadow-sm">
                <h3 className="text-base font-bold text-slate-900">
                  No matching questions found
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Try another keyword or message our live team on WhatsApp.
                </p>
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mt-4 rounded-full bg-brand px-5 py-2 text-xs font-bold text-white hover:bg-brand-dark"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              filteredGroups.map((g) => {
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
                    <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-100 shadow-sm">
                      {g.items.map((it) => (
                        <details key={it.q} className="group" open={Boolean(search)}>
                          <summary className="flex cursor-pointer items-start justify-between gap-4 px-6 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
                            {it.q}
                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-dark transition group-open:rotate-45">
                              +
                            </span>
                          </summary>
                          <div className="px-6 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                            {it.a}
                          </div>
                        </details>
                      ))}
                    </div>
                  </section>
                );
              })
            )}
          </div>

          {/* Aside support cards */}
          <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-3xl bg-gradient-to-br from-brand via-brand to-brand-blue p-6 text-white shadow-xl shadow-brand/20">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                <HeadsetIcon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 text-lg font-extrabold">Have a Specific Question?</h3>
              <p className="mt-1 text-xs opacity-90 leading-relaxed">
                Our care staff and dental advisors are ready to answer any questions about our Australian oral care range.
              </p>
              <div className="mt-5 space-y-2">
                <a
                  href={site.phoneHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-bold text-brand-dark hover:bg-slate-100 shadow-md"
                >
                  <WhatsappIcon className="h-4 w-4" />
                  Ask on WhatsApp
                </a>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-xs font-bold text-white ring-1 ring-white/30 hover:bg-white/20"
                >
                  <MailIcon className="h-4 w-4" />
                  Email Support
                </a>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-100 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900">Useful Links</h3>
              <ul className="mt-3 space-y-2 text-xs text-slate-600">
                {[
                  { label: "Shipping & Delivery Policy", href: "/shipping-policy" },
                  { label: "Return & Refund Policy", href: "/return-refund-policy" },
                  { label: "Privacy Policy", href: "/privacy-policy" },
                  { label: "Terms & Conditions", href: "/terms" },
                  { label: "Track My Order", href: "/track-order" },
                  { label: "Contact Us", href: "/contact-us" },
                ].map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="inline-flex items-center gap-1.5 hover:text-brand-dark transition"
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
