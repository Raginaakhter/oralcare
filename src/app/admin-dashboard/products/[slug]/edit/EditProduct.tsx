"use client";

import { use } from "react";
import { productsApi } from "@/lib/api";
import { useAsync } from "@/lib/hooks";
import { AdminHeader } from "../../../AdminHeader";
import { Loader } from "../../../AdminShell";
import { ProductForm } from "../../ProductForm";

// The [slug] segment accepts a product id or slug (GET /products/:idOrSlug).
export function EditProduct({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const product = useAsync(() => productsApi.get(slug), [slug]);

  if (product.loading) return <Loader />;
  if (!product.data) return <p className="text-sm font-semibold text-rose-700">{product.error ?? "Product not found"}</p>;
  const p = product.data;

  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin-dashboard" },
          { label: "Products", href: "/admin-dashboard/products" },
          { label: p.productName, href: `/admin-dashboard/products/${p._id}` },
          { label: "Edit" },
        ]}
        title={`Edit: ${p.productName}`}
        description="Update details, pricing, media, variations and visibility."
      />
      <ProductForm product={p} mode="edit" />
    </div>
  );
}
