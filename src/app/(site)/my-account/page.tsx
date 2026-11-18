"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/SiteShell";
import { useStore, formatPriceBDT } from "@/context/StoreContext";
import {
  ArrowRightIcon,
  ShieldIcon,
  CheckBadgeIcon,
  HeartIcon,
  CartIcon,
  UserIcon,
  TruckIcon,
  PhoneIcon,
  MailIcon,
  PinIcon,
} from "@/components/icons";

export default function AccountPage() {
  const { orders, wishlist, cartCount, showToast } = useStore();
  const [activeTab, setActiveTab] = useState<"overview" | "profile" | "addresses" | "security">("overview");

  // Profile editable fields
  const [name, setName] = useState("Afsana Rahman");
  const [phone, setPhone] = useState("01712 345678");
  const [email, setEmail] = useState("afsana@example.com");
  const [address, setAddress] = useState("House 24, Road 7, Block B, Dhanmondi, Dhaka 1205");
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    showToast("Profile details updated successfully!", "success");
    setTimeout(() => setIsSaved(false), 3000);
  };

  const recentOrder = orders[0];

  return (
    <>
      <PageHero
        title="My Account"
        subtitle="Manage your profile, track shipments, and view your saved items."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "My Account" }]}
      />

      <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* User Profile Summary Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-brand-blue-dark p-6 sm:p-8 text-white shadow-xl">
          <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-brand/20 blur-3xl" />
          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-dark text-white font-black text-xl shadow-lg ring-4 ring-white/10">
                {name.charAt(0)}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black">{name}</h2>
                  <span className="rounded-full bg-brand/30 px-2 py-0.5 text-[10px] font-bold text-brand ring-1 ring-brand/50">
                    Gold Member
                  </span>
                </div>
                <div className="mt-1 text-xs text-white/70">
                  {phone} · {email}
                </div>
              </div>
            </div>

            {/* Quick Stat Pills */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl bg-white/10 px-4 py-2.5 backdrop-blur-md">
                <div className="text-[10px] uppercase font-bold text-white/60">
                  Total Orders
                </div>
                <div className="text-base font-black text-white">{orders.length}</div>
              </div>
              <div className="rounded-2xl bg-white/10 px-4 py-2.5 backdrop-blur-md">
                <div className="text-[10px] uppercase font-bold text-white/60">
                  Wishlist
                </div>
                <div className="text-base font-black text-white">{wishlist.length}</div>
              </div>
              <div className="rounded-2xl bg-white/10 px-4 py-2.5 backdrop-blur-md">
                <div className="text-[10px] uppercase font-bold text-white/60">
                  Smile Points
                </div>
                <div className="text-base font-black text-brand">480 pts</div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="mt-8 flex gap-2 border-b border-slate-200 overflow-x-auto pb-2">
          {[
            { id: "overview", label: "Dashboard & Orders" },
            { id: "profile", label: "Personal Information" },
            { id: "addresses", label: "Address Book" },
            { id: "security", label: "Password & Security" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`rounded-full px-5 py-2 text-xs font-bold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 ring-1 ring-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Dashboard & Orders */}
        {activeTab === "overview" && (
          <div className="mt-8 space-y-8">
            {/* Recent Order Banner */}
            {recentOrder && (
              <div className="overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-slate-200 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Most Recent Order
                    </span>
                    <h3 className="text-sm font-black text-slate-900">
                      #{recentOrder.id} · {recentOrder.date}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 capitalize">
                      {recentOrder.status}
                    </span>
                    <Link
                      href={`/track-order?id=${recentOrder.id}`}
                      className="rounded-full bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-brand-dark"
                    >
                      Track Order
                    </Link>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {recentOrder.items.slice(0, 3).map((item) => (
                        <span
                          key={item.product.slug}
                          className="relative flex h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-brand-soft ring-2 ring-white"
                        >
                          <Image
                            src={item.product.img}
                            alt=""
                            fill
                            sizes="48px"
                            className="object-contain p-1"
                          />
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-slate-600">
                      <strong>{recentOrder.items.length} items</strong> · Total:{" "}
                      <strong className="text-brand-dark">
                        {formatPriceBDT(recentOrder.total)}
                      </strong>
                    </div>
                  </div>

                  <Link
                    href={`/my-orders/${recentOrder.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-dark hover:underline"
                  >
                    View Order Details <ArrowRightIcon className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            )}

            {/* Quick Actions Grid */}
            <div className="grid gap-5 sm:grid-cols-3">
              <Link
                href="/my-orders"
                className="group flex flex-col justify-between rounded-3xl bg-white p-6 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-lg shadow-sm"
              >
                <div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand-dark">
                    <TruckIcon className="h-5 w-5" />
                  </span>
                  <h4 className="mt-4 text-base font-bold text-slate-900">
                    Order History
                  </h4>
                  <p className="mt-1 text-xs text-slate-500">
                    View previous receipts, tracking codes, and reorder products.
                  </p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-brand-dark">
                  View All Orders <ArrowRightIcon className="h-3 w-3" />
                </span>
              </Link>

              <Link
                href="/wishlist"
                className="group flex flex-col justify-between rounded-3xl bg-white p-6 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-lg shadow-sm"
              >
                <div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
                    <HeartIcon className="h-5 w-5" />
                  </span>
                  <h4 className="mt-4 text-base font-bold text-slate-900">
                    Saved Wishlist
                  </h4>
                  <p className="mt-1 text-xs text-slate-500">
                    {wishlist.length} item{wishlist.length === 1 ? "" : "s"} saved for your next order.
                  </p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-rose-600">
                  Manage Wishlist <ArrowRightIcon className="h-3 w-3" />
                </span>
              </Link>

              <Link
                href="/cart"
                className="group flex flex-col justify-between rounded-3xl bg-white p-6 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-lg shadow-sm"
              >
                <div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                    <CartIcon className="h-5 w-5" />
                  </span>
                  <h4 className="mt-4 text-base font-bold text-slate-900">
                    Active Cart
                  </h4>
                  <p className="mt-1 text-xs text-slate-500">
                    {cartCount} item{cartCount === 1 ? "" : "s"} currently in your shopping bag.
                  </p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-sky-600">
                  Open Cart <ArrowRightIcon className="h-3 w-3" />
                </span>
              </Link>
            </div>
          </div>
        )}

        {/* Tab 2: Personal Information */}
        {activeTab === "profile" && (
          <div className="mt-8 rounded-3xl bg-white p-6 sm:p-8 ring-1 ring-slate-200 shadow-sm max-w-2xl">
            <h3 className="text-base font-black text-slate-900 mb-1">
              Personal Information
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Update your contact details for smooth courier notifications.
            </p>

            {isSaved && (
              <div className="mb-4 rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-800">
                ✓ Changes saved successfully!
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 w-full rounded-full border border-slate-200 px-4 text-sm outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-11 w-full rounded-full border border-slate-200 px-4 text-sm outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full rounded-full border border-slate-200 px-4 text-sm outline-none focus:border-brand"
                />
              </div>

              <button
                type="submit"
                className="mt-2 rounded-full bg-brand px-6 py-3 text-xs font-bold text-white hover:bg-brand-dark transition shadow-md"
              >
                Save Changes
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: Address Book */}
        {activeTab === "addresses" && (
          <div className="mt-8 space-y-6 max-w-2xl">
            <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-soft text-brand-dark">
                    <PinIcon className="h-4 w-4" />
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">
                    Primary Delivery Address
                  </h4>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                  Default
                </span>
              </div>
              <p className="mt-3 text-xs text-slate-700 leading-relaxed">
                <strong>{name}</strong><br />
                {address}<br />
                Phone: {phone}
              </p>
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => showToast("Edit address opened", "info")}
                  className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-700 hover:border-brand"
                >
                  Edit Address
                </button>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-50 p-6 text-center ring-1 ring-dashed ring-slate-200">
              <button
                type="button"
                onClick={() => showToast("Add new address form", "info")}
                className="inline-flex items-center gap-2 text-xs font-bold text-brand-dark hover:underline"
              >
                + Add Another Delivery Address
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Security */}
        {activeTab === "security" && (
          <div className="mt-8 rounded-3xl bg-white p-6 sm:p-8 ring-1 ring-slate-200 shadow-sm max-w-md">
            <h3 className="text-base font-black text-slate-900 mb-1">
              Change Password
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Keep your OralCareBD account secure.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                showToast("Password updated successfully!", "success");
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="h-10 w-full rounded-full border border-slate-200 px-4 text-xs outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="At least 8 characters"
                  className="h-10 w-full rounded-full border border-slate-200 px-4 text-xs outline-none focus:border-brand"
                />
              </div>
              <button
                type="submit"
                className="mt-2 rounded-full bg-slate-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-brand-dark"
              >
                Update Password
              </button>
            </form>
          </div>
        )}
      </main>
    </>
  );
}
