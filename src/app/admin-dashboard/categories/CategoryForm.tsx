import Image from "next/image";
import {
  FormCard,
  Field,
  Textarea,
  Select,
  FormActions,
  Toggle,
} from "../AdminForm";
import type { Category } from "./data";

export function CategoryForm({
  category,
  mode,
}: {
  category?: Category;
  mode: "create" | "edit";
}) {
  return (
    <form className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
      <div className="space-y-6">
        <FormCard title="Category Details">
          <Field label="Name" name="label" required placeholder="e.g. Teeth Whitening" defaultValue={category?.label} />
          <Field
            label="URL Slug"
            name="slug"
            placeholder="teeth-whitening"
            defaultValue={category?.slug}
            hint="Lowercase, hyphens only. Used in /shop?category= URLs."
          />
          <Textarea
            label="Description"
            name="description"
            placeholder="Short description shown on the Shop by Category page."
            defaultValue={category?.description}
            rows={3}
          />
        </FormCard>

        <FormCard title="Thumbnail" description="Square image shown on category cards.">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {category?.img && (
              <div className={`relative aspect-square overflow-hidden rounded-xl ${category.bg} ring-1 ${category.ring}`}>
                <Image src={category.img} alt="" fill sizes="150px" className="object-contain p-3" />
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

      <div className="space-y-6">
        <FormCard title="Visual Style">
          <Select
            label="Background Color"
            name="bg"
            defaultValue={category?.bg ?? "bg-emerald-50"}
            options={[
              { value: "bg-emerald-50", label: "Emerald (soft green)" },
              { value: "bg-brand-blue-soft", label: "Blue" },
              { value: "bg-amber-50", label: "Amber" },
              { value: "bg-rose-50", label: "Rose" },
              { value: "bg-violet-50", label: "Violet" },
            ]}
          />
        </FormCard>

        <FormCard title="Visibility">
          <Toggle
            label="Featured on Homepage"
            name="featured"
            description="Show in the main category strip on the home page."
            defaultChecked={category?.featured}
          />
          <Toggle
            label="Show in Navigation"
            name="inNav"
            description="Include in the Shop by Category dropdown."
            defaultChecked
          />
          <Toggle
            label="Published"
            name="published"
            description="Visible to customers."
            defaultChecked
          />
        </FormCard>
      </div>

      <div className="xl:col-span-2">
        <FormActions
          cancelHref="/admin-dashboard/categories"
          submitLabel={mode === "edit" ? "Save Changes" : "Create Category"}
        />
      </div>
    </form>
  );
}
