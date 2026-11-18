"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { useStore, formatPriceBDT } from "@/context/StoreContext";
import { Stars } from "@/components/Stars";
import { ProductCard } from "@/components/ProductCard";
import {
  CartIcon,
  HeartIcon,
  ShieldIcon,
  TruckIcon,
  ReturnIcon,
  CheckBadgeIcon,
  SparkIcon,
  ArrowRightIcon,
} from "@/components/icons";

export function ProductDetailView({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const { addToCart, buyNow, toggleWishlist, isInWishlist } = useStore();
  const inWishlist = isInWishlist(product.slug);

  const [selectedImg, setSelectedImg] = useState(product.img);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "reviews">("desc");
  const [reviewsList, setReviewsList] = useState([
    {
      id: 1,
      author: "Tahmid Hasan",
      rating: 5,
      date: "Nov 12, 2026",
      comment: "100% authentic Australian stock! Noticeable difference within 3 days. Fast delivery in Dhaka.",
      verified: true,
    },
    {
      id: 2,
      author: "Nusrat Jahan",
      rating: 5,
      date: "Nov 02, 2026",
      comment: "Very gentle on sensitive teeth. Great packaging and sealed properly.",
      verified: true,
    },
    {
      id: 3,
      author: "Dr. K. Ahmed",
      rating: 4,
      date: "Oct 25, 2026",
      comment: "Dentist approved formula. Happy to see authentic oral hygiene products available in Bangladesh.",
      verified: true,
    },
  ]);

  const [newReviewAuthor, setNewReviewAuthor] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    setReviewsList([
      {
        id: Date.now(),
        author: newReviewAuthor.trim(),
        rating: newReviewRating,
        date: "Just now",
        comment: newReviewComment.trim(),
        verified: true,
      },
      ...reviewsList,
    ]);
    setNewReviewAuthor("");
    setNewReviewComment("");
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  const images = [product.img, product.img, product.img, product.img];

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Main product showcase */}
      <section className="grid gap-10 lg:grid-cols-2">
        {/* Images */}
        <div className="relative">
          <div className="pointer-events-none absolute -top-10 -right-10 h-56 w-56 animate-blob rounded-full bg-slate-200/60 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-56 w-56 animate-blob rounded-full bg-slate-200/60 blur-3xl" />
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-brand-soft via-white to-brand-soft ring-1 ring-brand/15">
            <Image
              src={selectedImg}
              alt={product.name}
              fill
              sizes="(min-width: 768px) 500px, 90vw"
              className="object-contain p-10 transition-all duration-300"
              priority
            />
            {product.badge && (
              <span
                className={`absolute left-6 top-6 rounded-full ${product.badgeColor} px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-md`}
              >
                {product.badge}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          <div className="mt-4 grid grid-cols-4 gap-3">
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedImg(img)}
                className={`relative aspect-square overflow-hidden rounded-xl bg-slate-50 ring-2 transition ${
                  selectedImg === img && i === 0
                    ? "ring-brand"
                    : "ring-slate-100 hover:ring-slate-200"
                }`}
              >
                <Image
                  src={img}
                  alt=""
                  fill
                  sizes="100px"
                  className="object-contain p-2"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details & Actions */}
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-dark">
            <SparkIcon className="h-3 w-3" />
            {product.brand}
          </span>
          <h1 className="mt-3 text-2xl sm:text-4xl font-extrabold text-slate-900 break-words">
            {product.name}
          </h1>

          <div className="mt-2.5 sm:mt-3 flex items-center gap-2 sm:gap-3">
            <Stars value={product.rating} />
            <span className="text-xs sm:text-sm text-slate-500">
              {product.rating} · ({reviewsList.length + product.reviews} reviews)
            </span>
          </div>

          <div className="mt-4 sm:mt-6 flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              {product.price}
            </span>
            <span className="text-xs sm:text-sm text-slate-500">incl. VAT & Import Tax</span>
          </div>

          <p className="mt-4 sm:mt-5 text-sm sm:text-base text-slate-600 leading-relaxed">
            {product.description}
          </p>

          <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700 ring-1 ring-emerald-200">
              <CheckBadgeIcon className="h-3.5 w-3.5" />
              In Stock — Dhaka Warehouse
            </span>
            <span className="text-slate-500">Dispatches in 24 hours</span>
          </div>

          {/* Quantity + Add to Cart + Wishlist */}
          <div className="mt-5 sm:mt-6 flex items-center gap-2 sm:gap-3">
            <div className="inline-flex shrink-0 items-center rounded-full border border-slate-200 bg-white">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="h-10 w-9 sm:h-11 sm:w-11 rounded-l-full text-base sm:text-lg text-slate-500 hover:bg-slate-50"
              >
                -
              </button>
              <span className="w-8 sm:w-10 text-center text-xs sm:text-sm font-semibold">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="h-10 w-9 sm:h-11 sm:w-11 rounded-r-full text-base sm:text-lg text-slate-500 hover:bg-slate-50"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={() => addToCart(product, qty, true)}
              className="inline-flex flex-1 min-w-0 items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-brand px-3 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-brand-dark transition active:scale-95"
            >
              <CartIcon className="h-4 w-4 shrink-0" />
              <span className="truncate">Add to Cart</span>
            </button>

            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              aria-label="Add to wishlist"
              className={`flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full ring-1 transition ${
                inWishlist
                  ? "bg-rose-50 text-rose-500 ring-rose-200"
                  : "bg-white text-brand-dark ring-slate-200 hover:bg-brand-soft"
              }`}
            >
              <HeartIcon
                className={`h-4 w-4 sm:h-5 sm:w-5 ${inWishlist ? "fill-current text-rose-500" : ""}`}
              />
            </button>
          </div>

          {/* Buy Now button */}
          <button
            type="button"
            onClick={() => buyNow(product, qty)}
            className="mt-2.5 sm:mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white transition hover:bg-brand-dark shadow-md"
          >
            Buy Now <ArrowRightIcon className="h-4 w-4" />
          </button>

          {/* Trust badges */}
          <div className="mt-6 grid gap-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100 sm:grid-cols-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand shadow-sm">
                <ShieldIcon className="h-4 w-4" />
              </span>
              <div>
                <div className="font-bold text-slate-800">100% Authentic</div>
                <div className="text-[10px] text-slate-500">Australian Origin</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand shadow-sm">
                <TruckIcon className="h-4 w-4" />
              </span>
              <div>
                <div className="font-bold text-slate-800">Free Ship ৳1,500+</div>
                <div className="text-[10px] text-slate-500">Nationwide</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand shadow-sm">
                <ReturnIcon className="h-4 w-4" />
              </span>
              <div>
                <div className="font-bold text-slate-800">7-Day Returns</div>
                <div className="text-[10px] text-slate-500">Hassle free</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="mt-12 sm:mt-16 rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-8 ring-1 ring-slate-100">
        <div className="flex gap-4 sm:gap-6 border-b border-slate-100 pb-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("desc")}
            className={`pb-3 text-xs sm:text-sm font-bold transition shrink-0 whitespace-nowrap ${
              activeTab === "desc"
                ? "border-b-2 border-brand text-brand-dark"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("specs")}
            className={`pb-3 text-xs sm:text-sm font-bold transition shrink-0 whitespace-nowrap ${
              activeTab === "specs"
                ? "border-b-2 border-brand text-brand-dark"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-3 text-xs sm:text-sm font-bold transition shrink-0 whitespace-nowrap ${
              activeTab === "reviews"
                ? "border-b-2 border-brand text-brand-dark"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Reviews ({reviewsList.length + product.reviews})
          </button>
        </div>

        {/* Tab 1: Description */}
        {activeTab === "desc" && (
          <div className="mt-6 space-y-4 text-sm text-slate-600 leading-relaxed">
            <p>{product.description}</p>
            <p>
              Each {product.brand} product is sourced directly from licensed Australian
              distributors, arriving sealed and authentic with full guaranteed shelf life.
            </p>
            <div className="mt-6 rounded-2xl bg-brand-soft p-5 ring-1 ring-brand/15">
              <h4 className="font-bold text-slate-900">Dentist Recommendation</h4>
              <p className="mt-1 text-xs text-slate-700">
                Brush thoroughly twice a day for two full minutes. Pair with dental floss or
                interdental brushes for optimum plaque control and gum protection.
              </p>
            </div>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand" />
                Dentist recommended &amp; enamel-safe formulation
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand" />
                Suitable for daily use and sensitive gums
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand" />
                Ships from our Dhaka warehouse with tamper-evident seal
              </li>
            </ul>
          </div>
        )}

        {/* Tab 2: Specifications */}
        {activeTab === "specs" && (
          <div className="mt-6">
            <dl className="grid gap-4 sm:grid-cols-2 text-sm">
              <div className="rounded-xl bg-slate-50 p-4">
                <dt className="text-xs text-slate-500 font-semibold uppercase">Brand</dt>
                <dd className="mt-1 font-bold text-slate-900">{product.brand}</dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <dt className="text-xs text-slate-500 font-semibold uppercase">Country of Origin</dt>
                <dd className="mt-1 font-bold text-slate-900">Australia 🇦🇺</dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <dt className="text-xs text-slate-500 font-semibold uppercase">Category</dt>
                <dd className="mt-1 font-bold text-slate-900 capitalize">
                  {product.category.replace("-", " ")}
                </dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <dt className="text-xs text-slate-500 font-semibold uppercase">Shelf Life</dt>
                <dd className="mt-1 font-bold text-slate-900">Guaranteed 18+ Months</dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <dt className="text-xs text-slate-500 font-semibold uppercase">Safety Standard</dt>
                <dd className="mt-1 font-bold text-slate-900">TGA Approved / ADA Compliant</dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <dt className="text-xs text-slate-500 font-semibold uppercase">Delivery Coverage</dt>
                <dd className="mt-1 font-bold text-slate-900">All 64 Districts of Bangladesh</dd>
              </div>
            </dl>
          </div>
        )}

        {/* Tab 3: Reviews */}
        {activeTab === "reviews" && (
          <div className="mt-6 space-y-8">
            {/* Review Form */}
            <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Write a Review</h3>
              {reviewSubmitted && (
                <div className="mt-3 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200">
                  Thank you! Your verified review has been published.
                </div>
              )}
              <form onSubmit={handleAddReview} className="mt-4 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newReviewAuthor}
                      onChange={(e) => setNewReviewAuthor(e.target.value)}
                      placeholder="e.g. Arif Hossain"
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-brand"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Rating
                    </label>
                    <select
                      value={newReviewRating}
                      onChange={(e) => setNewReviewRating(Number(e.target.value))}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-brand"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ 5 Stars - Excellent</option>
                      <option value={4}>⭐⭐⭐⭐ 4 Stars - Very Good</option>
                      <option value={3}>⭐⭐⭐ 3 Stars - Average</option>
                      <option value={2}>⭐⭐ 2 Stars - Fair</option>
                      <option value={1}>⭐ 1 Star - Poor</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Your Feedback
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    placeholder="Share your experience with this oral care product..."
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs outline-none focus:border-brand"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-full bg-brand px-5 py-2 text-xs font-bold text-white hover:bg-brand-dark transition"
                >
                  Submit Review
                </button>
              </form>
            </div>

            {/* Reviews List */}
            <div className="divide-y divide-slate-100">
              {reviewsList.map((r) => (
                <div key={r.id} className="py-4 first:pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{r.author}</span>
                      {r.verified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                          <CheckBadgeIcon className="h-3 w-3" /> Verified Buyer
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">{r.date}</span>
                  </div>
                  <div className="mt-1">
                    <Stars value={r.rating} />
                  </div>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-16">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-brand-dark">
                Recommended For You
              </span>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                You May Also Like
              </h2>
            </div>
            <Link
              href={`/shop?category=${product.category}`}
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-dark hover:underline"
            >
              View All <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
