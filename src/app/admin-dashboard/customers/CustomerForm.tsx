import {
  FormCard,
  Field,
  Textarea,
  Select,
  FormRow,
  FormActions,
  Toggle,
} from "../AdminForm";
import type { Customer } from "./data";

export function CustomerForm({
  customer,
  mode,
}: {
  customer?: Customer;
  mode: "create" | "edit";
}) {
  return (
    <form className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
      <div className="space-y-6">
        <FormCard title="Personal Information">
          <FormRow>
            <Field label="Full Name" name="name" required placeholder="Jane Doe" defaultValue={customer?.name} />
            <Field label="Email" name="email" type="email" required placeholder="jane@example.com" defaultValue={customer?.email} />
          </FormRow>
          <FormRow>
            <Field label="Phone Number" name="phone" placeholder="017XX XXXXXX" defaultValue={customer?.phone} />
            <Field label="City" name="city" placeholder="Dhaka" defaultValue={customer?.location} />
          </FormRow>
          <Textarea
            label="Shipping Address"
            name="address"
            placeholder="House, road, area, postcode"
            defaultValue={customer?.address}
            rows={3}
          />
        </FormCard>

        <FormCard title="Notes" description="Internal notes about this customer, visible only to staff.">
          <Textarea label="Internal Notes" name="notes" placeholder="e.g. Prefers evening deliveries, repeat buyer of whitening kits." rows={4} />
        </FormCard>
      </div>

      <div className="space-y-6">
        <FormCard title="Account Status">
          <Select
            label="Status"
            name="status"
            defaultValue={customer?.status ?? "new"}
            options={[
              { value: "new", label: "New · Recently signed up" },
              { value: "active", label: "Active · Regular buyer" },
              { value: "vip", label: "VIP · High-value customer" },
              { value: "inactive", label: "Inactive · No recent activity" },
            ]}
          />
        </FormCard>

        <FormCard title="Preferences">
          <Toggle
            label="Marketing Emails"
            name="marketingEmails"
            description="Receive promotional emails and offers."
            defaultChecked
          />
          <Toggle
            label="Order Updates"
            name="orderUpdates"
            description="Transactional emails for orders."
            defaultChecked
          />
          <Toggle
            label="SMS Notifications"
            name="smsNotifications"
            description="Delivery updates via SMS."
          />
        </FormCard>
      </div>

      <div className="xl:col-span-2">
        <FormActions
          cancelHref={
            mode === "edit" && customer
              ? `/admin-dashboard/customers/${customer.id}`
              : "/admin-dashboard/customers"
          }
          submitLabel={mode === "edit" ? "Save Changes" : "Create Customer"}
        />
      </div>
    </form>
  );
}
