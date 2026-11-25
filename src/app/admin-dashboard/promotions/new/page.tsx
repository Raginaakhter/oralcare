import { AdminHeader } from "../../AdminHeader";
import { PromotionForm } from "../PromotionForm";

export const metadata = { title: "New Coupon — Admin" };

export default function NewPromotionPage() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin-dashboard" },
          { label: "Coupons", href: "/admin-dashboard/promotions" },
          { label: "New" },
        ]}
        title="New Coupon"
      />
      <PromotionForm mode="create" />
    </div>
  );
}
