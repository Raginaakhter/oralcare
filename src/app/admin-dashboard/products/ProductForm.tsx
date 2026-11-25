"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { productsApi, type Product, type ProductInput } from "@/lib/api";
import { brandId, categoryId } from "@/lib/products";
import { FormCard, Field, Textarea, Select, FormRow, FormActions, Toggle, str, opt, num, bool, list } from "../AdminForm";
import { Loader, useAdminAction } from "../AdminShell";
import { useCatalogOptions } from "../useCatalogOptions";
import { ImageUploadField } from "../ImageUploadField";
import { ProductImagesField } from "./ProductImagesField";

interface VariationRow {
  attributes: string; // "size=250ml, color=blue"
  price: string;
  stockQuantity: string;
  sku: string;
  image: string;
}

function toRows(p?: Product): VariationRow[] {
  return (p?.variations ?? []).map((v) => ({
    attributes: Object.entries(v.attributes ?? {})
      .map(([k, val]) => `${k}=${val}`)
      .join(", "),
    price: v.price?.toString() ?? "",
    stockQuantity: v.stockQuantity?.toString() ?? "",
    sku: v.sku ?? "",
    image: v.image ?? "",
  }));
}

function parseAttributes(s: string): Record<string, string> {
  return Object.fromEntries(
    s
      .split(",")
      .map((pair) => pair.split("=").map((x) => x.trim()))
      .filter(([k, v]) => k && v)
  );
}

export function ProductForm({ product, mode }: { product?: Product; mode: "create" | "edit" }) {
  const router = useRouter();
  const run = useAdminAction();
  const { categories, brands, loading: catalogLoading } = useCatalogOptions();
  const [pending, setPending] = useState(false);
  const [type, setType] = useState<"simple" | "variable">(product?.productType ?? "simple");
  const [rows, setRows] = useState<VariationRow[]>(toRows(product));

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const images = list(fd, "images", /\n/).map((line, i) => {
      const [url, alt] = line.split("|").map((x) => x.trim());
      return { url, ...(alt ? { alt } : {}), order: i };
    });
    const specifications = Object.fromEntries(
      list(fd, "specifications", /\n/)
        .map((line) => {
          const idx = line.indexOf(":");
          return idx > 0 ? [line.slice(0, idx).trim(), line.slice(idx + 1).trim()] : null;
        })
        .filter((x): x is [string, string] => !!x && !!x[0] && !!x[1])
    );
    const salePrice = num(fd, "salePrice");

    const body: ProductInput = {
      productName: str(fd, "productName"),
      ...(opt(fd, "slug") ? { slug: opt(fd, "slug") } : {}),
      sku: str(fd, "sku"),
      description: str(fd, "description"),
      ...(opt(fd, "shortDescription") ? { shortDescription: opt(fd, "shortDescription") } : {}),
      regularPrice: num(fd, "regularPrice") ?? 0,
      ...(salePrice !== undefined ? { salePrice } : mode === "edit" ? { salePrice: null } : {}),
      ...(num(fd, "costPrice") !== undefined ? { costPrice: num(fd, "costPrice") } : {}),
      ...(mode === "create" ? { stockQuantity: num(fd, "stockQuantity") ?? 0 } : {}),
      lowStockThreshold: num(fd, "lowStockThreshold") ?? 5,
      category: str(fd, "category"),
      brand: opt(fd, "brand") ?? (mode === "edit" ? null : undefined),
      images,
      ...(opt(fd, "thumbnail") ? { thumbnail: opt(fd, "thumbnail") } : {}),
      productType: type,
      variations:
        type === "variable"
          ? rows
              .filter((r) => r.attributes.trim())
              .map((r) => ({
                attributes: parseAttributes(r.attributes),
                ...(r.price ? { price: Number(r.price) } : {}),
                ...(r.stockQuantity ? { stockQuantity: Number(r.stockQuantity) } : {}),
                ...(r.sku.trim() ? { sku: r.sku.trim() } : {}),
                ...(r.image.trim() ? { image: r.image.trim() } : {}),
              }))
          : [],
      ...(num(fd, "weight") !== undefined ? { weight: num(fd, "weight") } : {}),
      tags: list(fd, "tags"),
      features: list(fd, "features", /\n/),
      specifications,
      isFeatured: bool(fd, "isFeatured"),
      isActive: bool(fd, "isActive"),
      isPublished: bool(fd, "isPublished"),
      ...(opt(fd, "metaTitle") ? { metaTitle: opt(fd, "metaTitle") } : {}),
      ...(opt(fd, "metaDescription") ? { metaDescription: opt(fd, "metaDescription") } : {}),
      metaKeywords: list(fd, "metaKeywords"),
    };

    setPending(true);
    const res = await run(
      () => (mode === "create" ? productsApi.create(body) : productsApi.update(product!._id, body)),
      mode === "create" ? "Product created" : "Product updated"
    );
    setPending(false);
    if (res) router.push(`/admin-dashboard/products/${res.data._id}`);
  };

  if (catalogLoading) return <Loader label="Loading categories & brands…" />;

  const catOpts = [{ value: "", label: "Select a category…" }, ...categories.map((c) => ({ value: c._id, label: c.name }))];
  const brandOpts = [{ value: "", label: "No brand" }, ...brands.map((b) => ({ value: b._id, label: b.name }))];

  return (
    <form onSubmit={onSubmit} className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
      <div className="space-y-6">
        <FormCard title="Basic Information" description="Name, description and URL slug.">
          <Field label="Product Name" name="productName" required defaultValue={product?.productName} placeholder="e.g. White Glo Whitening Toothpaste" />
          <FormRow>
            <Field label="URL Slug" name="slug" defaultValue={product?.slug} placeholder="auto-generated if empty" hint="Letters, digits and dashes." />
            <Field label="SKU" name="sku" required defaultValue={product?.sku} placeholder="OCB-WGS-001" />
          </FormRow>
          <Textarea label="Short Description" name="shortDescription" rows={2} defaultValue={product?.shortDescription} hint="Up to 500 characters; shown on cards." />
          <Textarea label="Description" name="description" required rows={6} defaultValue={product?.description} />
        </FormCard>

        <FormCard title="Pricing & Stock">
          <FormRow>
            <Field label="Regular Price (BDT)" name="regularPrice" type="number" min={0} step="any" required defaultValue={product?.regularPrice} />
            <Field label="Sale Price (BDT)" name="salePrice" type="number" min={0} step="any" defaultValue={product?.salePrice ?? undefined} hint="Must be ≤ regular price. Leave empty for no sale." />
          </FormRow>
          <FormRow>
            <Field label="Cost Price (BDT)" name="costPrice" type="number" min={0} step="any" defaultValue={product?.costPrice} />
            <Field label="Low-stock Threshold" name="lowStockThreshold" type="number" min={0} defaultValue={product?.lowStockThreshold ?? 5} />
          </FormRow>
          {mode === "create" ? (
            <Field label="Opening Stock" name="stockQuantity" type="number" min={0} defaultValue={0} />
          ) : (
            <p className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
              Current stock: <strong>{product?.stockQuantity}</strong>. Use <em>Adjust stock</em> on the product page so every change is logged.
            </p>
          )}
          <Field label="Weight (g)" name="weight" type="number" min={0} step="any" defaultValue={product?.weight} />
        </FormCard>

        <FormCard title="Media" description="Upload photos from your device or paste image links. The first image is the main one.">
          <ProductImagesField defaultValue={product?.images} />
          <ImageUploadField kind="product" label="Thumbnail" name="thumbnail" defaultValue={product?.thumbnail} hint="Optional. Defaults to the first image." />
        </FormCard>

        <FormCard title="Variations" description="Sizes, flavours, colours… Each variation can have its own price and stock.">
          <div className="flex gap-2">
            {(["simple", "variable"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`rounded-xl px-4 py-2 text-xs font-bold capitalize ${
                  type === t ? "bg-slate-900 text-white" : "border border-slate-200 bg-white text-slate-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          {type === "variable" && (
            <div className="space-y-2">
              {rows.map((r, i) => (
                <div key={i} className="grid gap-2 rounded-xl bg-slate-50 p-3 sm:grid-cols-[2fr_1fr_1fr_1fr_auto]">
                  {(["attributes", "price", "stockQuantity", "sku"] as const).map((k) => (
                    <input
                      key={k}
                      value={r[k]}
                      onChange={(e) => setRows((rs) => rs.map((x, j) => (j === i ? { ...x, [k]: e.target.value } : x)))}
                      placeholder={{ attributes: "size=250ml, flavour=mint", price: "Price", stockQuantity: "Stock", sku: "SKU" }[k]}
                      type={k === "price" || k === "stockQuantity" ? "number" : "text"}
                      className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm"
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))}
                    className="h-9 rounded-lg px-3 text-xs font-bold text-rose-600 hover:bg-rose-50"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setRows((rs) => [...rs, { attributes: "", price: "", stockQuantity: "", sku: "", image: "" }])}
                className="rounded-xl border border-dashed border-slate-300 px-4 py-2 text-xs font-bold text-slate-600 hover:border-brand"
              >
                + Add variation
              </button>
            </div>
          )}
        </FormCard>

        <FormCard title="Details">
          <Textarea label="Features" name="features" rows={3} defaultValue={product?.features.join("\n")} hint="One per line." />
          <Textarea
            label="Specifications"
            name="specifications"
            rows={3}
            defaultValue={Object.entries(product?.specifications ?? {})
              .map(([k, v]) => `${k}: ${v}`)
              .join("\n")}
            placeholder={"Origin: Australia\nVolume: 205g"}
            hint="One “Key: Value” per line."
          />
        </FormCard>
      </div>

      <div className="space-y-6">
        <FormCard title="Visibility">
          <Toggle label="Published" name="isPublished" defaultChecked={product?.isPublished ?? true} description="Visible in the storefront." />
          <Toggle label="Active" name="isActive" defaultChecked={product?.isActive ?? true} description="Inactive products can't be bought." />
          <Toggle label="Featured" name="isFeatured" defaultChecked={product?.isFeatured} description="Shown first on the homepage." />
        </FormCard>

        <FormCard title="Organisation">
          <Select label="Category" name="category" required options={catOpts} defaultValue={product ? categoryId(product) : ""} />
          <Select label="Brand" name="brand" options={brandOpts} defaultValue={product ? brandId(product) ?? "" : ""} />
          <Field label="Tags" name="tags" defaultValue={product?.tags.join(", ")} placeholder="whitening, sensitive" hint="Comma-separated." />
        </FormCard>

        <FormCard title="SEO">
          <Field label="Meta Title" name="metaTitle" defaultValue={product?.metaTitle} />
          <Textarea label="Meta Description" name="metaDescription" rows={3} defaultValue={product?.metaDescription} />
          <Field label="Meta Keywords" name="metaKeywords" defaultValue={product?.metaKeywords.join(", ")} hint="Comma-separated." />
        </FormCard>
      </div>

      <div className="xl:col-span-2">
        <FormActions
          pending={pending}
          cancelHref={product ? `/admin-dashboard/products/${product._id}` : "/admin-dashboard/products"}
          submitLabel={mode === "edit" ? "Save Changes" : "Create Product"}
        />
      </div>
    </form>
  );
}
