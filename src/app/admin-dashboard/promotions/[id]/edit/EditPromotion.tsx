"use client";

import { use } from "react";
import { couponsApi } from "@/lib/api";
import { useAsync } from "@/lib/hooks";
import { AdminHeader } from "../../../AdminHeader";
import { Loader } from "../../../AdminShell";
import { PromotionForm } from "../../PromotionForm";

export function EditPromotion({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const coupon = useAsync(() => couponsApi.get(id), [id]);
  if (coupon.loading) return <Loader />;
  if (!coupon.data) return <p className="text-sm font-semibold text-rose-700">{coupon.error ?? "Coupon not found"}</p>;
  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin-dashboard" },
          { label: "Coupons", href: "/admin-dashboard/promotions" },
          { label: coupon.data.code },
        ]}
        title={`Edit ${coupon.data.code}`}
      />
      <PromotionForm mode="edit" coupon={coupon.data} />
    </div>
  );
}
