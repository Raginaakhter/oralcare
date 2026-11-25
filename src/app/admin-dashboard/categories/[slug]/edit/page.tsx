import { Suspense } from "react";
import { Loader } from "../../../AdminShell";
import { EditCategory } from "./EditCategory";

export default function EditCategoryPage({ params }: PageProps<"/admin-dashboard/categories/[slug]/edit">) {
  return (
    <Suspense fallback={<Loader />}>
      <EditCategory params={params} />
    </Suspense>
  );
}
