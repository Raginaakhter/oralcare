import {
  FormCard,
  Field,
  Textarea,
  Select,
  FormRow,
  FormActions,
  Toggle,
} from "../AdminForm";
import type { Promotion } from "./data";

export function PromotionForm({
  promotion,
  mode,
}: {
  promotion?: Promotion;
  mode: "create" | "edit";
}) {
  return (
    <form className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
      <div className="space-y-6">
        <FormCard title="Promotion Details">
          <Field
            label="Promotion Name"
            name="name"
            required
            placeholder="e.g. Black Friday Mega Deal"
            defaultValue={promotion?.name}
          />
          <Field
            label="Coupon Code"
            name="code"
            required
            placeholder="BLACKFRI40"
            defaultValue={promotion?.code}
            hint="Uppercase, no spaces. Customers enter this at checkout."
          />
          <Textarea
            label="Description"
            name="description"
            placeholder="Internal description of the campaign."
            defaultValue={promotion?.description}
            rows={3}
          />
        </FormCard>

        <FormCard title="Discount Settings">
          <FormRow>
            <Select
              label="Type"
              name="type"
              defaultValue={promotion?.type ?? "Percentage"}
              options={[
                { value: "Percentage", label: "Percentage (%)" },
                { value: "Fixed", label: "Fixed Amount (৳)" },
                { value: "Free Shipping", label: "Free Shipping" },
              ]}
            />
            <Field
              label="Discount Value"
              name="discount"
              required
              placeholder="25% or ৳200"
              defaultValue={promotion?.discount}
            />
          </FormRow>
          <FormRow>
            <Field
              label="Minimum Order Value"
              name="minOrder"
              type="text"
              placeholder="৳500"
              hint="Leave empty for no minimum."
            />
            <Field
              label="Maximum Discount"
              name="maxDiscount"
              type="text"
              placeholder="৳1,000"
              hint="Cap for percentage-based codes."
            />
          </FormRow>
        </FormCard>

        <FormCard title="Validity Period">
          <FormRow>
            <Field label="Starts On" name="starts" type="date" defaultValue="2026-11-10" />
            <Field label="Ends On" name="ends" type="date" defaultValue="2026-12-31" />
          </FormRow>
          <Field
            label="Usage Limit"
            name="limit"
            type="number"
            placeholder="500"
            defaultValue={promotion?.limit || undefined}
            hint="Total number of times this code can be redeemed. Leave empty for unlimited."
          />
        </FormCard>
      </div>

      <div className="space-y-6">
        <FormCard title="Status">
          <Select
            label="Campaign Status"
            name="status"
            defaultValue={promotion?.status ?? "active"}
            options={[
              { value: "active", label: "Active · Live now" },
              { value: "scheduled", label: "Scheduled · Goes live later" },
              { value: "paused", label: "Paused · Temporarily off" },
              { value: "expired", label: "Expired · Finished" },
            ]}
          />
        </FormCard>

        <FormCard title="Eligibility">
          <Toggle
            label="New Customers Only"
            name="newCustomersOnly"
            description="Restrict to first-time buyers only."
          />
          <Toggle
            label="Can Be Stacked"
            name="stackable"
            description="Combine with other active promotions."
          />
          <Toggle
            label="One Use Per Customer"
            name="onePerCustomer"
            description="Each account can redeem this code once."
            defaultChecked
          />
        </FormCard>

        <FormCard title="Applies To">
          <Select
            label="Scope"
            name="scope"
            defaultValue="all"
            options={[
              { value: "all", label: "Entire catalog" },
              { value: "category", label: "Specific categories" },
              { value: "product", label: "Specific products" },
              { value: "brand", label: "Specific brands" },
            ]}
          />
        </FormCard>
      </div>

      <div className="xl:col-span-2">
        <FormActions
          cancelHref="/admin-dashboard/promotions"
          submitLabel={mode === "edit" ? "Save Changes" : "Create Promotion"}
          secondaryLabel={mode === "create" ? "Save as Draft" : undefined}
        />
      </div>
    </form>
  );
}
