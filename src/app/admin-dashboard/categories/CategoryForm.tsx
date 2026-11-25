"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { categoriesApi, type Category } from "@/lib/api";
import { FormCard, Field, Textarea, Select, FormRow, FormActions, Toggle, str, opt, bool } from "../AdminForm";
import { Loader, useAdminAction } from "../AdminShell";
import { useCatalogOptions } from "../useCatalogOptions";

function parentId(c?: Category): string {
  const p = c?.parentCategory;
  if (!p) return "";
  return typeof p === "string" ? p : p._id;
}

export function CategoryForm({ category, mode }: { category?: Category; mode: "create" | "edit" }) {
  const router = useRouter();
  const run = useAdminAction();
  const { categories, loading } = useCatalogOptions();
  const [pending, setPending] = useState(false);

  if (loading) return <Loader />;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body = {
      name: str(fd, "name"),
      ...(opt(fd, "slug") ? { slug: opt(fd, "slug") } : {}),
      ...(opt(fd, "description") !== undefined || mode === "edit" ? { description: str(fd, "description") } : {}),
      ...(opt(fd, "image") ? { image: opt(fd, "image") } : {}),
      parentCategory: opt(fd, "parentCategory") ?? null,
      isActive: bool(fd, "isActive"),
    };
    setPending(true);
    const r = await run(
      () => (mode === "create" ? categoriesApi.create(body) : categoriesApi.update(category!._id, body)),
      mode === "create" ? "Category created" : "Category updated"
    );
    setPending(false);
    if (r) router.push("/admin-dashboard/categories");
  };

  const parents = [
    { value: "", label: "None (top level)" },
    ...categories.filter((c) => c._id !== category?._id).map((c) => ({ value: c._id, label: c.name })),
  ];

  return (
    <form onSubmit={onSubmit} className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
      <FormCard title="Category details">
        <FormRow>
          <Field label="Name" name="name" required defaultValue={category?.name} placeholder="e.g. Toothpaste" />
          <Field label="Slug" name="slug" defaultValue={category?.slug} placeholder="auto-generated if empty" />
        </FormRow>
        <Textarea label="Description" name="description" rows={4} defaultValue={category?.description} />
        <Field label="Image URL" name="image" type="url" defaultValue={category?.image} hint="Shown on the category strip; a bundled icon is used if empty." />
      </FormCard>
      <FormCard title="Organisation">
        <Select label="Parent category" name="parentCategory" options={parents} defaultValue={parentId(category)} />
        <Toggle label="Active" name="isActive" defaultChecked={category?.isActive ?? true} description="Inactive categories are hidden from the store." />
      </FormCard>
      <div className="xl:col-span-2">
        <FormActions pending={pending} cancelHref="/admin-dashboard/categories" submitLabel={mode === "create" ? "Create Category" : "Save Changes"} />
      </div>
    </form>
  );
}
