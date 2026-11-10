import { AdminHeader } from "../../AdminHeader";
import { PromotionForm } from "../PromotionForm";

export const metadata = { title: "Create Promotion — Admin — OralCareBD" };

export default function NewPromotionPage() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin-dashboard" },
          { label: "Promotions", href: "/admin-dashboard/promotions" },
          { label: "Create Promotion" },
        ]}
        title="Create New Promotion"
        description="Set up a coupon code or campaign."
      />
      <PromotionForm mode="create" />
    </div>
  );
}
