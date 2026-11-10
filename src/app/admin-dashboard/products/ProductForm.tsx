import Image from "next/image";
import type { Product } from "@/lib/products";
import {
  FormCard,
  Field,
  Textarea,
  Select,
  FormRow,
  FormActions,
  Toggle,
} from "../AdminForm";

const categoryOpts = [
  { value: "toothpaste", label: "Toothpaste" },
  { value: "teeth-whitening", label: "Teeth Whitening" },
  { value: "floss-mouthwash", label: "Floss & Mouthwash" },
  { value: "toothbrushes", label: "Toothbrushes" },
  { value: "specials", label: "Specials" },
];

const brandOpts = [
  { value: "White Glo", label: "White Glo" },
  { value: "Sensodyne", label: "Sensodyne" },
  { value: "TheraBreath", label: "TheraBreath" },
  { value: "Steradent", label: "Steradent" },
  { value: "Ultrafresh", label: "Ultrafresh" },
];

export function ProductForm({
  product,
  mode,
}: {
  product?: Product;
  mode: "create" | "edit";
}) {
  return (
    <form className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
      {/* Left column */}
      <div className="space-y-6">
        <FormCard title="Basic Information" description="Product name, description and slug.">
          <Field
            label="Product Name"
            name="name"
            required
            placeholder="e.g. White Glo Whitening Toothpaste"
            defaultValue={product?.name}
          />
          <Field
            label="URL Slug"
            name="slug"
            placeholder="white-glo-whitening-toothpaste"
            defaultValue={product?.slug}
            hint="Used in the product URL. Lowercase, hyphens only."
          />
          <Textarea
            label="Description"
            name="description"
            placeholder="A clear, detailed description shown on the product page."
            defaultValue={product?.description}
            rows={5}
          />
        </FormCard>

        <FormCard title="Pricing & Stock" description="How the product is priced and tracked.">
          <FormRow>
            <Field
              label="Price (BDT)"
              name="price"
              type="text"
              required
              placeholder="৳999"
              defaultValue={product?.price}
            />
            <Field
              label="Compare-at Price"
              name="compareAt"
              type="text"
              placeholder="৳1,299"
              hint="Shown struck-through to highlight savings."
            />
          </FormRow>
          <FormRow>
            <Field label="Stock Quantity" name="stock" type="number" placeholder="100" defaultValue={50} />
            <Field label="Reorder Point" name="reorder" type="number" placeholder="20" defaultValue={20} />
          </FormRow>
          <FormRow>
            <Field label="SKU" name="sku" placeholder="OCB-WGS-001" />
            <Field label="Barcode" name="barcode" placeholder="9341234567890" />
          </FormRow>
        </FormCard>

        <FormCard title="Media" description="Upload product images.">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {product?.img && (
              <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
                <Image
                  src={product.img}
                  alt=""
                  fill
                  sizes="150px"
                  className="object-contain p-3"
                />
              </div>
            )}
            <button
              type="button"
              className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-xs font-bold text-slate-500 transition hover:border-brand hover:text-brand-dark"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
              Upload
            </button>
          </div>
        </FormCard>
      </div>

      {/* Right column */}
      <div className="space-y-6">
        <FormCard title="Status">
          <Select
            label="Status"
            name="status"
            defaultValue="active"
            options={[
              { value: "active", label: "Active · Visible in store" },
              { value: "draft", label: "Draft · Not visible" },
              { value: "archived", label: "Archived" },
            ]}
          />
        </FormCard>

        <FormCard title="Organisation">
          <Select
            label="Category"
            name="category"
            options={categoryOpts}
            defaultValue={product?.category}
          />
          <Select
            label="Brand"
            name="brand"
            options={brandOpts}
            defaultValue={product?.brand}
          />
          <Field
            label="Tags"
            name="tags"
            placeholder="whitening, sensitive, enamel-safe"
            hint="Comma-separated for search & filters."
          />
        </FormCard>

        <FormCard title="Badge & Highlights">
          <Select
            label="Badge"
            name="badge"
            defaultValue={product?.badge ?? "none"}
            options={[
              { value: "none", label: "No badge" },
              { value: "HOT", label: "HOT (rose)" },
              { value: "NEW", label: "NEW (emerald)" },
              { value: "VALUE PACK", label: "VALUE PACK (emerald)" },
              { value: "SALE", label: "SALE (amber)" },
            ]}
          />
          <Toggle
            label="Dentist Recommended"
            name="dentistRecommended"
            description="Show a verified-dentist pill on the product card."
            defaultChecked
          />
          <Toggle
            label="Featured on Homepage"
            name="featured"
            description="Include in the Best Sellers section."
          />
        </FormCard>
      </div>

      {/* Actions */}
      <div className="xl:col-span-2">
        <FormActions
          cancelHref={
            mode === "edit" && product
              ? `/admin-dashboard/products/${product.slug}`
              : "/admin-dashboard/products"
          }
          submitLabel={mode === "edit" ? "Save Changes" : "Create Product"}
          secondaryLabel={mode === "edit" ? "Save as Draft" : undefined}
        />
      </div>
    </form>
  );
}
