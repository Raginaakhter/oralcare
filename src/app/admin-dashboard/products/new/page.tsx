import { AdminHeader } from "../../AdminHeader";
import { ProductForm } from "../ProductForm";

export const metadata = { title: "Add Product — Admin — OralCareBD" };

export default function NewProductPage() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin-dashboard" },
          { label: "Products", href: "/admin-dashboard/products" },
          { label: "Add Product" },
        ]}
        title="Add New Product"
        description="Create a new product entry for your catalog."
      />
      <ProductForm mode="create" />
    </div>
  );
}
