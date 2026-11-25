import { AdminHeader } from "../../AdminHeader";
import { CategoryForm } from "../CategoryForm";

export const metadata = { title: "New Category — Admin" };

export default function NewCategoryPage() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin-dashboard" },
          { label: "Categories", href: "/admin-dashboard/categories" },
          { label: "New" },
        ]}
        title="Add Category"
      />
      <CategoryForm mode="create" />
    </div>
  );
}
