"use client";

import React, { useState } from "react";
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
  CheckBadgeIcon,
} from "@/components/icons";
import { site } from "@/lib/site-data";
import { useStore } from "@/context/StoreContext";

export default function ContactPage() {
  const { showToast } = useStore();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setSubmitted(true);
    showToast("Message sent! Our customer care team will reply shortly.", "success");
    setName("");
    setPhone("");
    setEmail("");
    setSubject("");
    setMessage("");
    setTimeout(() => setSubmitted(false), 5000);
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
      label: "Email Support",
      value: site.email,
      href: `mailto:${site.email}`,
      accent: "blue",
    },
    {
      icon: <PinIcon className="h-6 w-6" />,
      label: "Dhaka Hub & Origin",
      value: "Gulshan, Dhaka & Sydney, Australia",
      accent: "emerald",
    },
  ];

  return (
    <>
      <PageHero
        title="Get in Touch"
        subtitle="Questions about an authentic Australian product, your delivery, or oral care routines? We reply within minutes on WhatsApp."
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
                className="group rounded-3xl bg-white p-6 ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/15 shadow-sm"
              >
                {inner}
              </a>
            ) : (
              <div
                key={c.label}
                className="group rounded-3xl bg-white p-6 ring-1 ring-slate-100 shadow-sm"
              >
                {inner}
              </div>
            );
          })}
        </section>

        {/* Form + Map/Details */}
        <section className="mt-12 grid gap-10 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl bg-white p-8 ring-1 ring-slate-100 shadow-sm">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 animate-blob rounded-full bg-brand-soft/60 blur-3xl" />
            <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 animate-blob rounded-full bg-brand-soft/60 blur-3xl" />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-dark">
                <SparkIcon className="h-3.5 w-3.5" />
                Direct Message
              </span>
              <h2 className="mt-3 text-2xl font-extrabold text-slate-900">
                We&apos;d Love to Hear From You
              </h2>
              <p className="mt-2 text-xs text-slate-600">
                Fill in your details and our dental customer support will reply within hours.
              </p>

              {submitted && (
                <div className="mt-4 rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                  <CheckBadgeIcon className="h-5 w-5 text-emerald-600" />
                  <span>Thank you! Your message has been received. We will respond shortly.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Subject / Concern
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Inquiring about Whitening kit compatibility"
                    className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Your Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we assist your oral care routine?..."
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-brand-dark transition"
                >
                  Send Message <ArrowRightIcon className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Right: Quick Channels & Hours */}
          <div className="space-y-6">
            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand via-brand to-brand-blue-dark p-8 text-white shadow-xl shadow-brand/20">
              <h3 className="text-xl font-black">Instant WhatsApp Chat</h3>
              <p className="mt-2 text-xs opacity-90 leading-relaxed">
                Need immediate product recommendations or order status? Connect directly with our live care staff on WhatsApp.
              </p>
              <a
                href={site.phoneHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-bold text-brand-dark hover:bg-slate-100 shadow-md transition"
              >
                <WhatsappIcon className="h-4 w-4" />
                Chat on WhatsApp Now
              </a>
            </div>

            <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-100 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900">Support Hours (Bangladesh Time)</h3>
              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex justify-between border-b border-slate-50 pb-2">
                  <span>Saturday – Thursday</span>
                  <span className="font-bold text-slate-900">9:00 AM – 10:00 PM</span>
                </li>
                <li className="flex justify-between border-b border-slate-50 pb-2">
                  <span>Friday</span>
                  <span className="font-bold text-slate-900">2:00 PM – 10:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Emergency Order Status</span>
                  <span className="font-bold text-emerald-600">24/7 via WhatsApp</span>
                </li>
              </ul>
            </div>

            <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-100 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900">Follow Our Community</h3>
              <p className="mt-1 text-xs text-slate-500">
                Join our Facebook and Instagram for giveaways and smile tips.
              </p>
              <div className="mt-4 flex gap-3">
                <a
                  href="https://facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-brand-dark hover:bg-brand hover:text-white transition"
                >
                  <FacebookIcon className="h-5 w-5" />
                </a>
                <a
                  href="https://instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-brand-dark hover:bg-brand hover:text-white transition"
                >
                  <InstagramIcon className="h-5 w-5" />
                </a>
                <a
                  href={site.phoneHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition ring-1 ring-emerald-200"
                >
                  <WhatsappIcon className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
