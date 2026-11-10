import { notFound } from "next/navigation";
import { AdminHeader } from "../../../AdminHeader";
import { ProductForm } from "../../ProductForm";
import { products, getProductBySlug } from "@/lib/products";

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/admin-dashboard/products/[slug]/edit">) {
  const { slug } = await params;
  const p = getProductBySlug(slug);
  return { title: p ? `Edit ${p.name} — Admin` : "Edit Product — Admin" };
}

export default async function EditProductPage({
  params,
}: PageProps<"/admin-dashboard/products/[slug]/edit">) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin-dashboard" },
          { label: "Products", href: "/admin-dashboard/products" },
          { label: product.name, href: `/admin-dashboard/products/${product.slug}` },
          { label: "Edit" },
        ]}
        title={`Edit: ${product.name}`}
        description="Update product details, pricing, media and organisation."
      />
      <ProductForm product={product} mode="edit" />
    </div>
  );
}
