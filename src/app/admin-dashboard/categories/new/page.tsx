import { AdminHeader } from "../../AdminHeader";
import { CategoryForm } from "../CategoryForm";

export const metadata = { title: "Add Category — Admin — OralCareBD" };

export default function NewCategoryPage() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin-dashboard" },
          { label: "Categories", href: "/admin-dashboard/categories" },
          { label: "Add Category" },
        ]}
        title="Add New Category"
        description="Create a category to organise your products."
      />
      <CategoryForm mode="create" />
    </div>
  );
}
