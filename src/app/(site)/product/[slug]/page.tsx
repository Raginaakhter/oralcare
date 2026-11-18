import { notFound } from "next/navigation";
import { PageHero } from "@/components/SiteShell";
import { products, getProductBySlug, categoryLabels } from "@/lib/products";
import { ProductDetailView } from "@/components/ProductDetailView";

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product Not Found - OralCareBD" };
  return {
    title: `${product.name} - OralCareBD`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4);

  return (
    <>
      <PageHero
        title={product.name}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          {
            label: categoryLabels[product.category] ?? product.category,
            href: `/shop?category=${product.category}`,
          },
          { label: product.brand },
        ]}
      />

      <ProductDetailView product={product} related={related} />
    </>
  );
}
