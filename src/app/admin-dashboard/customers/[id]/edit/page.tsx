import { notFound } from "next/navigation";
import { AdminHeader } from "../../../AdminHeader";
import { CustomerForm } from "../../CustomerForm";
import { customers, getCustomerById } from "../../data";

export async function generateStaticParams() {
  return customers.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: PageProps<"/admin-dashboard/customers/[id]/edit">) {
  const { id } = await params;
  const c = getCustomerById(id);
  return { title: c ? `Edit ${c.name} — Admin` : "Edit Customer — Admin" };
}

export default async function EditCustomerPage({
  params,
}: PageProps<"/admin-dashboard/customers/[id]/edit">) {
  const { id } = await params;
  const c = getCustomerById(id);
  if (!c) notFound();

  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin-dashboard" },
          { label: "Customers", href: "/admin-dashboard/customers" },
          { label: c.name, href: `/admin-dashboard/customers/${c.id}` },
          { label: "Edit" },
        ]}
        title={`Edit: ${c.name}`}
        description="Update customer contact info and preferences."
      />
      <CustomerForm customer={c} mode="edit" />
    </div>
  );
}
