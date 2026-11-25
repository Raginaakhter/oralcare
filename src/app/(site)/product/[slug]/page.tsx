import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/SiteShell";
import { ProductDetailView } from "@/components/ProductDetailView";
import { getProduct, getProducts, getShippingMethods } from "@/lib/api/server";
import { brandName, categoryId, categoryRef, productImage } from "@/lib/products";

/** Placeholder used only when the catalog is empty/unreachable at build time. */
const FALLBACK_SLUG = "__no-product__";

export async function generateStaticParams() {
  // Cache Components needs at least one param; prerender the newest products.
  const page = await getProducts({ limit: 20, sort: "newest" });
  const slugs = page.items.map((p) => ({ slug: p.slug }));
  return slugs.length ? slugs : [{ slug: FALLBACK_SLUG }];
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const product = slug === FALLBACK_SLUG ? null : await getProduct(slug);
  if (!product) return { title: "Product Not Found - OralCareBD" };
  const description = product.metaDescription || product.shortDescription || product.description.slice(0, 160);
  return {
    title: product.metaTitle || `${product.productName} - OralCareBD`,
    description,
    keywords: product.metaKeywords.length ? product.metaKeywords : product.tags,
    openGraph: { title: product.productName, description, images: [productImage(product)] },
  };
}

/**
 * `params` is read inside <Suspense> so products added after the build (not
 * prerendered) still navigate instantly with a skeleton.
 */
export default function ProductPage({ params }: PageProps<"/product/[slug]">) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductContent params={params} />
    </Suspense>
  );
}

function ProductSkeleton() {
  return (
    <main className="mx-auto grid w-full max-w-7xl animate-pulse gap-8 px-4 py-12 md:grid-cols-2" aria-busy="true">
      <div className="aspect-square w-full rounded-3xl bg-slate-100" />
      <div className="space-y-4">
        <div className="h-4 w-24 rounded bg-slate-200" />
        <div className="h-8 w-3/4 rounded bg-slate-200" />
        <div className="h-6 w-32 rounded bg-slate-200" />
        <div className="h-4 rounded bg-slate-100" />
        <div className="h-4 w-2/3 rounded bg-slate-100" />
        <div className="h-12 w-48 rounded-full bg-slate-200" />
      </div>
    </main>
  );
}

async function ProductContent({ params }: { params: PageProps<"/product/[slug]">["params"] }) {
  const { slug } = await params;
  const product = slug === FALLBACK_SLUG ? null : await getProduct(slug);
  if (!product) notFound();

  const [sameCategory, shipping] = await Promise.all([
    getProducts({ category: categoryId(product), limit: 5 }),
    getShippingMethods(),
  ]);
  const related = sameCategory.items.filter((p) => p._id !== product._id).slice(0, 4);
  const category = categoryRef(product);
  const brand = brandName(product);

  return (
    <>
      <PageHero
        title={product.productName}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          ...(category ? [{ label: category.name, href: `/shop?category=${category.slug}` }] : []),
          ...(brand ? [{ label: brand }] : []),
        ]}
      />
      <ProductDetailView
        product={product}
        related={related}
        freeShippingThreshold={shipping?.freeShippingThreshold}
      />
    </>
  );
}
