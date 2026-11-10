import { AdminHeader } from "../../AdminHeader";
import { CustomerForm } from "../CustomerForm";

export const metadata = { title: "Add Customer — Admin — OralCareBD" };

export default function NewCustomerPage() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin-dashboard" },
          { label: "Customers", href: "/admin-dashboard/customers" },
          { label: "Add Customer" },
        ]}
        title="Add New Customer"
        description="Create a customer profile to track their orders and activity."
      />
      <CustomerForm mode="create" />
    </div>
  );
}
