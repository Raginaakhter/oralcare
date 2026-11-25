"use client";

import { use } from "react";
import { categoriesApi } from "@/lib/api";
import { useAsync } from "@/lib/hooks";
import { AdminHeader } from "../../../AdminHeader";
import { Loader } from "../../../AdminShell";
import { CategoryForm } from "../../CategoryForm";

export function EditCategory({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const cat = useAsync(() => categoriesApi.get(slug), [slug]);
  if (cat.loading) return <Loader />;
  if (!cat.data) return <p className="text-sm font-semibold text-rose-700">{cat.error ?? "Category not found"}</p>;
  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin-dashboard" },
          { label: "Categories", href: "/admin-dashboard/categories" },
          { label: cat.data.name },
        ]}
        title={`Edit: ${cat.data.name}`}
      />
      <CategoryForm mode="edit" category={cat.data} />
    </div>
  );
}
