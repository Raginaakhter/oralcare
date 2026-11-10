import Image from "next/image";
import {
  FormCard,
  Field,
  Textarea,
  Select,
  FormRow,
  FormActions,
  Toggle,
} from "../../AdminForm";
import type { AdminHeroSlide } from "./data";

export function SlideForm({
  slide,
  mode,
}: {
  slide?: AdminHeroSlide;
  mode: "create" | "edit";
}) {
  return (
    <form className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
      <div className="space-y-6">
        <FormCard title="Content" description="Text that overlays the hero image.">
          <Field
            label="Tag / Eyebrow"
            name="tag"
            placeholder="Trusted by Dental Experts"
            defaultValue={slide?.tag}
            hint="Small pill shown above the main title."
          />
          <FormRow>
            <Field label="Title Line 1" name="titleLine1" required placeholder="Dentist-Approved Care," defaultValue={slide?.titleLine1} />
            <Field label="Title Line 2 (accented)" name="titleLine2" placeholder="Delivered to Your Door" defaultValue={slide?.titleLine2} hint="Shown in brand color." />
          </FormRow>
          <Textarea
            label="Description"
            name="description"
            placeholder="Supporting copy shown below the title."
            defaultValue={slide?.description}
            rows={3}
          />
        </FormCard>

        <FormCard title="Call-to-Action Buttons">
          <FormRow>
            <Field label="Primary Button Label" name="ctaLabel" placeholder="Shop Now" defaultValue={slide?.ctaLabel} />
            <Field label="Primary Button Link" name="ctaHref" placeholder="/shop" defaultValue={slide?.ctaHref} />
          </FormRow>
          <FormRow>
            <Field label="Secondary Button Label" name="secondaryLabel" placeholder="Learn More" defaultValue={slide?.secondaryLabel} />
            <Field label="Secondary Button Link" name="secondaryHref" placeholder="/about-us" defaultValue={slide?.secondaryHref} />
          </FormRow>
        </FormCard>

        <FormCard title="Image" description="Full-width background image. 1920×800 recommended.">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700">Current Image</label>
              {slide?.img ? (
                <div className="relative h-32 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
                  <Image src={slide.img} alt="" fill sizes="300px" className="object-cover" />
                </div>
              ) : (
                <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-xs text-slate-500">
                  No image uploaded
                </div>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700">Upload New</label>
              <button
                type="button"
                className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-xs font-bold text-slate-500 transition hover:border-brand hover:text-brand-dark"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
                Click to upload
              </button>
            </div>
          </div>
          <Field
            label="Or paste image URL"
            name="img"
            placeholder="https://images.unsplash.com/photo-..."
            defaultValue={slide?.img}
          />
          <Field label="Alt Text (for accessibility)" name="alt" placeholder="Describe what's in the image" defaultValue={slide?.alt} />
          <Select
            label="Image Focus Position"
            name="objectPosition"
            defaultValue={slide?.objectPosition ?? "center"}
            options={[
              { value: "center", label: "Center · Default" },
              { value: "center top", label: "Top" },
              { value: "center bottom", label: "Bottom" },
              { value: "center 30%", label: "Upper · 30%" },
              { value: "center 40%", label: "Upper · 40%" },
              { value: "60% center", label: "Right-center · 60%" },
              { value: "70% center", label: "Right · 70%" },
              { value: "70% 35%", label: "Right · 35%" },
            ]}
          />
        </FormCard>
      </div>

      <div className="space-y-6">
        <FormCard title="Status">
          <Toggle
            label="Published"
            name="published"
            description="Include this slide in the live carousel."
            defaultChecked={slide?.published ?? true}
          />
        </FormCard>

        <FormCard title="Ordering">
          <Field
            label="Display Order"
            name="order"
            type="number"
            defaultValue={slide?.order ?? 1}
            hint="Lower numbers appear first. Drag-and-drop coming soon."
          />
        </FormCard>

        <FormCard title="Preview">
          {slide?.img ? (
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
              <Image
                src={slide.img}
                alt=""
                fill
                sizes="400px"
                style={{ objectPosition: slide.objectPosition }}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/80 via-slate-900/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="mb-1 inline-flex rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white backdrop-blur ring-1 ring-white/20">
                  {slide.tag}
                </div>
                <div className="text-sm font-black text-white drop-shadow">
                  {slide.titleLine1}
                </div>
                <div className="text-sm font-black text-brand drop-shadow">
                  {slide.titleLine2}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex aspect-[16/9] items-center justify-center rounded-xl bg-slate-50 text-xs text-slate-400">
              Preview will appear here
            </div>
          )}
          <p className="text-[11px] text-slate-500">
            Live preview of how the slide appears on the homepage.
          </p>
        </FormCard>
      </div>

      <div className="xl:col-span-2">
        <FormActions
          cancelHref="/admin-dashboard/content/banner"
          submitLabel={mode === "edit" ? "Save Slide" : "Create Slide"}
          secondaryLabel={mode === "create" ? "Save as Draft" : undefined}
        />
      </div>
    </form>
  );
}
