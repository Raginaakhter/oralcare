import { Suspense } from "react";
import { Loader } from "../../../AdminShell";
import { EditProduct } from "./EditProduct";

export default function EditProductPage({ params }: PageProps<"/admin-dashboard/products/[slug]/edit">) {
  return (
    <Suspense fallback={<Loader />}>
      <EditProduct params={params} />
    </Suspense>
  );
}
