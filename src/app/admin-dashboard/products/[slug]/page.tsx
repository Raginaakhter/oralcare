import { Suspense } from "react";
import { Loader } from "../../AdminShell";
import { ProductDetail } from "./ProductDetail";

// [slug] accepts a product id or slug (GET /products/:idOrSlug).
export default function ProductDetailPage({ params }: PageProps<"/admin-dashboard/products/[slug]">) {
  return (
    <Suspense fallback={<Loader />}>
      <ProductDetail params={params} />
    </Suspense>
  );
}
