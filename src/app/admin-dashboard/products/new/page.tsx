import { AdminHeader } from "../../AdminHeader";
import { ProductForm } from "../ProductForm";

export const metadata = { title: "New Product — Admin" };

export default function NewProductPage() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin-dashboard" },
          { label: "Products", href: "/admin-dashboard/products" },
          { label: "New" },
        ]}
        title="Add Product"
        description="Create a new product in your catalog."
      />
      <ProductForm mode="create" />
    </div>
  );
}
