"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { couponsApi, type Coupon, type CouponInput } from "@/lib/api";
import { FormCard, Field, Textarea, Select, FormRow, FormActions, Toggle, str, opt, num, bool, list } from "../AdminForm";
import { Loader, useAdminAction } from "../AdminShell";
import { useCatalogOptions } from "../useCatalogOptions";

/** ISO → value for <input type="datetime-local"> in local time. */
function toLocalInput(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const off = d.getTimezoneOffset() * 60_000;
  return new Date(d.getTime() - off).toISOString().slice(0, 16);
}

export function PromotionForm({ coupon, mode }: { coupon?: Coupon; mode: "create" | "edit" }) {
  const router = useRouter();
  const run = useAdminAction();
  const { categories, loading } = useCatalogOptions();
  const [pending, setPending] = useState(false);

  if (loading) return <Loader />;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const date = (k: string) => (opt(fd, k) ? new Date(str(fd, k)).toISOString() : null);
    const body: CouponInput = {
      ...(mode === "create" ? { code: str(fd, "code").toUpperCase() } : {}),
      description: str(fd, "description"),
      discountType: str(fd, "discountType") as "percentage" | "fixed",
      discountValue: num(fd, "discountValue"),
      maxDiscountAmount: num(fd, "maxDiscountAmount") ?? null,
      minOrderAmount: num(fd, "minOrderAmount") ?? 0,
      startsAt: date("startsAt"),
      expiresAt: date("expiresAt"),
      usageLimit: num(fd, "usageLimit") ?? null,
      usageLimitPerUser: num(fd, "usageLimitPerUser") ?? null,
      applicableCategories: fd.getAll("applicableCategories").map(String),
      applicableProducts: list(fd, "applicableProducts"),
      isActive: bool(fd, "isActive"),
    };
    setPending(true);
    const r = await run(
      () => (mode === "create" ? couponsApi.create(body) : couponsApi.update(coupon!._id, body)),
      mode === "create" ? "Coupon created" : "Coupon updated"
    );
    setPending(false);
    if (r) router.push("/admin-dashboard/promotions");
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
      <div className="space-y-6">
        <FormCard title="Coupon">
          <FormRow>
            <Field
              label="Code"
              name="code"
              required={mode === "create"}
              disabled={mode === "edit"}
              defaultValue={coupon?.code}
              placeholder="SMILE10"
              hint={mode === "edit" ? "Codes can't be changed." : "Letters, digits, - and _."}
            />
            <Select
              label="Discount type"
              name="discountType"
              defaultValue={coupon?.discountType ?? "percentage"}
              options={[
                { value: "percentage", label: "Percentage (%)" },
                { value: "fixed", label: "Fixed amount (BDT)" },
              ]}
            />
          </FormRow>
          <Textarea label="Description" name="description" rows={2} defaultValue={coupon?.description} />
          <FormRow>
            <Field label="Discount value" name="discountValue" type="number" min={0} step="any" required defaultValue={coupon?.discountValue} />
            <Field label="Max discount (BDT)" name="maxDiscountAmount" type="number" min={0} step="any" defaultValue={coupon?.maxDiscountAmount} hint="Cap for percentage coupons." />
          </FormRow>
          <Field label="Minimum order (BDT)" name="minOrderAmount" type="number" min={0} step="any" defaultValue={coupon?.minOrderAmount ?? 0} />
        </FormCard>

        <FormCard title="Schedule & limits">
          <FormRow>
            <Field label="Starts at" name="startsAt" type="datetime-local" defaultValue={toLocalInput(coupon?.startsAt)} />
            <Field label="Expires at" name="expiresAt" type="datetime-local" defaultValue={toLocalInput(coupon?.expiresAt)} />
          </FormRow>
          <FormRow>
            <Field label="Total usage limit" name="usageLimit" type="number" min={1} defaultValue={coupon?.usageLimit} hint="Empty = unlimited." />
            <Field label="Per-customer limit" name="usageLimitPerUser" type="number" min={1} defaultValue={coupon?.usageLimitPerUser} />
          </FormRow>
          {coupon && <p className="text-xs text-slate-500">Used {coupon.usedCount} time(s) so far.</p>}
        </FormCard>
      </div>

      <div className="space-y-6">
        <FormCard title="Status">
          <Toggle label="Active" name="isActive" defaultChecked={coupon?.isActive ?? true} />
        </FormCard>
        <FormCard title="Applies to" description="Leave everything unchecked to apply to the whole order.">
          <div className="max-h-56 space-y-1 overflow-y-auto">
            {categories.map((c) => (
              <label key={c._id} className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  name="applicableCategories"
                  value={c._id}
                  defaultChecked={coupon?.applicableCategories.includes(c._id)}
                  className="accent-brand"
                />
                {c.name}
              </label>
            ))}
          </div>
          <Textarea
            label="Product IDs"
            name="applicableProducts"
            rows={2}
            defaultValue={coupon?.applicableProducts.join(", ")}
            hint="Optional, comma-separated product ids."
          />
        </FormCard>
      </div>

      <div className="xl:col-span-2">
        <FormActions pending={pending} cancelHref="/admin-dashboard/promotions" submitLabel={mode === "create" ? "Create Coupon" : "Save Changes"} />
      </div>
    </form>
  );
}
