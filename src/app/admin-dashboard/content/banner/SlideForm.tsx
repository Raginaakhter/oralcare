"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { bannersApi, type Banner, type BannerInput, type BannerPlacement } from "@/lib/api";
import { FormCard, Field, Textarea, Select, FormRow, FormActions, Toggle, str, opt, num, bool } from "../../AdminForm";
import { useAdminAction } from "../../AdminShell";
import { ImageUploadField } from "../../ImageUploadField";

function toLocalInput(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

export function SlideForm({ banner, mode }: { banner?: Banner; mode: "create" | "edit" }) {
  const router = useRouter();
  const run = useAdminAction();
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const img = (k: string) => opt(fd, k) ?? (mode === "edit" ? null : undefined);
    const date = (k: string) => (opt(fd, k) ? new Date(str(fd, k)).toISOString() : null);
    const textKeys = [
      "subtitle",
      "description",
      "imageAlt",
      "buttonText",
      "buttonLink",
      "secondaryButtonText",
      "secondaryButtonLink",
      "textColor",
      "overlayColor",
      "bannerHeight",
    ] as const;
    const texts: Record<string, string> = {};
    for (const k of textKeys) {
      const v = opt(fd, k);
      if (v !== undefined) texts[k] = v;
      else if (mode === "edit" && !["textColor", "overlayColor"].includes(k)) texts[k] = "";
    }
    const body = {
      title: str(fd, "title"),
      ...texts,
      desktopImage: img("desktopImage"),
      mobileImage: img("mobileImage"),
      backgroundImage: img("backgroundImage"),
      placement: str(fd, "placement") as BannerPlacement,
      textAlignment: str(fd, "textAlignment") as Banner["textAlignment"],
      overlayOpacity: (num(fd, "overlayOpacity") ?? 0) / 100,
      displayOrder: num(fd, "displayOrder") ?? 0,
      startDate: date("startDate"),
      endDate: date("endDate"),
      isActive: bool(fd, "isActive"),
      isPublished: bool(fd, "isPublished"),
    } as BannerInput;

    setPending(true);
    const r = await run(
      () => (mode === "create" ? bannersApi.create(body) : bannersApi.update(banner!._id, body)),
      mode === "create" ? "Banner created" : "Banner updated"
    );
    setPending(false);
    if (r) router.push("/admin-dashboard/content/banner");
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
      <div className="space-y-6">
        <FormCard title="Content">
          <Field label="Title" name="title" required defaultValue={banner?.title} />
          <Field label="Subtitle / tag" name="subtitle" defaultValue={banner?.subtitle} />
          <Textarea label="Description" name="description" rows={3} defaultValue={banner?.description} />
          <FormRow>
            <Field label="Button text" name="buttonText" defaultValue={banner?.buttonText} placeholder="Shop now" />
            <Field label="Button link" name="buttonLink" defaultValue={banner?.buttonLink} placeholder="/shop" />
          </FormRow>
          <FormRow>
            <Field label="Secondary button text" name="secondaryButtonText" defaultValue={banner?.secondaryButtonText} />
            <Field label="Secondary button link" name="secondaryButtonLink" defaultValue={banner?.secondaryButtonLink} />
          </FormRow>
        </FormCard>

        <FormCard title="Images">
          <ImageUploadField kind="banner" label="Desktop image" name="desktopImage" defaultValue={banner?.desktopImage} />
          <ImageUploadField kind="banner" label="Mobile image" name="mobileImage" defaultValue={banner?.mobileImage} />
          <ImageUploadField kind="banner" label="Background image" name="backgroundImage" defaultValue={banner?.backgroundImage} />
          <Field label="Image alt text" name="imageAlt" defaultValue={banner?.imageAlt} />
        </FormCard>
      </div>

      <div className="space-y-6">
        <FormCard title="Placement">
          <Select
            label="Where it appears"
            name="placement"
            defaultValue={banner?.placement ?? "hero"}
            options={[
              { value: "hero", label: "Homepage hero slider" },
              { value: "promo", label: "Homepage promo cards (up to 3)" },
            ]}
          />
        </FormCard>
        <FormCard title="Visibility">
          <Toggle label="Published" name="isPublished" defaultChecked={banner?.isPublished ?? true} />
          <Toggle label="Active" name="isActive" defaultChecked={banner?.isActive ?? true} />
          <FormRow>
            <Field label="Starts" name="startDate" type="datetime-local" defaultValue={toLocalInput(banner?.startDate)} />
            <Field label="Ends" name="endDate" type="datetime-local" defaultValue={toLocalInput(banner?.endDate)} />
          </FormRow>
          <Field label="Display order" name="displayOrder" type="number" min={0} defaultValue={banner?.displayOrder ?? 0} />
        </FormCard>
        <FormCard title="Style">
          <Select
            label="Text alignment"
            name="textAlignment"
            defaultValue={banner?.textAlignment ?? "left"}
            options={[
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
              { value: "right", label: "Right" },
            ]}
          />
          <FormRow>
            <Field label="Text colour" name="textColor" defaultValue={banner?.textColor} placeholder="#ffffff" />
            <Field label="Overlay colour" name="overlayColor" defaultValue={banner?.overlayColor} placeholder="#0f172a" />
          </FormRow>
          <Field
            label="Overlay opacity (%)"
            name="overlayOpacity"
            type="number"
            min={0}
            max={100}
            defaultValue={Math.round((banner?.overlayOpacity ?? 0) * 100)}
            hint="0 keeps the default gradient."
          />
          <Field label="Banner height" name="bannerHeight" defaultValue={banner?.bannerHeight} placeholder="e.g. 520px" />
        </FormCard>
      </div>

      <div className="xl:col-span-2">
        <FormActions pending={pending} cancelHref="/admin-dashboard/content/banner" submitLabel={mode === "create" ? "Create Banner" : "Save Changes"} />
      </div>
    </form>
  );
}
