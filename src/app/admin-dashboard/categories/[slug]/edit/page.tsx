import { notFound } from "next/navigation";
import { AdminHeader } from "../../../AdminHeader";
import { CategoryForm } from "../../CategoryForm";
import { adminCategories, getCategoryBySlug } from "../../data";

export async function generateStaticParams() {
  return adminCategories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/admin-dashboard/categories/[slug]/edit">) {
  const { slug } = await params;
  const c = getCategoryBySlug(slug);
  return { title: c ? `Edit ${c.label} — Admin` : "Edit Category — Admin" };
}

export default async function EditCategoryPage({
  params,
}: PageProps<"/admin-dashboard/categories/[slug]/edit">) {
  const { slug } = await params;
  const c = getCategoryBySlug(slug);
  if (!c) notFound();

  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin-dashboard" },
          { label: "Categories", href: "/admin-dashboard/categories" },
          { label: `Edit ${c.label}` },
        ]}
        title={`Edit: ${c.label}`}
        description="Update category name, thumbnail and visibility."
      />
      <CategoryForm category={c} mode="edit" />
    </div>
  );
}
