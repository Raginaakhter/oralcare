import Image from "next/image";
import { AdminHeader, AdminButton, EyeIcon } from "../../AdminHeader";
import {
  FormCard,
  Field,
  Textarea,
  FormRow,
  FormActions,
} from "../../AdminForm";
import { footerCols, site } from "@/lib/site-data";

export const metadata = { title: "Footer — Admin — OralCareBD" };

export default function FooterEditPage() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin-dashboard" },
          { label: "Content" },
          { label: "Footer" },
        ]}
        title="Footer"
        description="Edit the footer that appears on every page of the storefront."
        actions={<AdminButton icon={<EyeIcon />}>Preview Live</AdminButton>}
      />

      <form className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <FormCard title="Brand" description="Logo and tagline shown at the top of the footer.">
            <div className="flex items-start gap-4">
              <div className="relative h-16 w-32 shrink-0 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
                <Image src="/images/logo.png" alt="Logo" fill sizes="128px" className="object-contain p-2" />
              </div>
              <button
                type="button"
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:border-brand hover:text-brand-dark"
              >
                Change Logo
              </button>
            </div>
            <Field label="Brand Name" name="siteName" defaultValue={site.name} />
            <Field label="Tagline" name="tagline" defaultValue={site.tagline} />
            <Textarea
              label="About Description"
              name="description"
              defaultValue={site.description}
              rows={3}
              hint="Shown under the logo in the footer."
            />
          </FormCard>

          {/* Columns */}
          {footerCols.map((col, ci) => (
            <FormCard
              key={col.title}
              title={`Column ${ci + 1}: ${col.title}`}
              description="Links shown in this footer column."
            >
              <Field
                label="Column Heading"
                name={`col-${ci}-title`}
                defaultValue={col.title}
              />
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Links</span>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-[11px] font-bold text-brand-dark ring-1 ring-slate-200 hover:ring-brand"
                  >
                    + Add Link
                  </button>
                </div>
                <div className="space-y-2">
                  {col.links.map((link, li) => (
                    <div key={li} className="flex items-center gap-2">
                      <input
                        type="text"
                        defaultValue={link.label}
                        className="h-9 w-40 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand"
                        placeholder="Label"
                      />
                      <input
                        type="text"
                        defaultValue={link.href}
                        className="h-9 flex-1 rounded-lg border border-slate-200 bg-white px-3 font-mono text-xs outline-none focus:border-brand"
                        placeholder="/href"
                      />
                      <button
                        type="button"
                        aria-label="Remove link"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5">
                          <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </FormCard>
          ))}

          <FormCard title="Payment Methods" description="Payment logos shown at the bottom of the footer.">
            <div className="flex flex-wrap gap-2">
              {["VISA", "MC", "bKash", "Nagad", "COD"].map((p) => (
                <span
                  key={p}
                  className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700"
                >
                  {p}
                  <button
                    type="button"
                    aria-label="Remove"
                    className="text-slate-400 hover:text-rose-500"
                  >
                    ×
                  </button>
                </span>
              ))}
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-lg border-2 border-dashed border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-500 hover:border-brand hover:text-brand-dark"
              >
                + Add
              </button>
            </div>
          </FormCard>
        </div>

        <div className="space-y-6">
          <FormCard title="Contact Info" description="Shown in the Contact Us column of the footer.">
            <Field label="Phone Number" name="phone" defaultValue={site.phone} />
            <Field
              label="WhatsApp / Phone Link"
              name="phoneHref"
              defaultValue={site.phoneHref}
              hint="Starts with https://wa.me/ or tel:"
            />
            <Field label="Email Address" name="email" type="email" defaultValue={site.email} />
            <Textarea label="Address" name="address" defaultValue={site.address} rows={2} />
          </FormCard>

          <FormCard title="Social Media">
            <SocialField label="Facebook" name="facebook" defaultValue="https://facebook.com/oralcarebd" />
            <SocialField label="Instagram" name="instagram" defaultValue="https://instagram.com/oralcarebd" />
            <SocialField label="YouTube" name="youtube" defaultValue="https://youtube.com/@oralcarebd" />
            <SocialField label="TikTok" name="tiktok" defaultValue="https://tiktok.com/@oralcarebd" />
            <SocialField label="WhatsApp" name="whatsapp" defaultValue={site.phoneHref} />
          </FormCard>

          <FormCard title="Legal">
            <Field label="Copyright Text" name="copyright" defaultValue={site.copyright} />
            <FormRow>
              <Field label="Privacy URL" name="privacyUrl" defaultValue="/privacy-policy" />
              <Field label="Terms URL" name="termsUrl" defaultValue="/return-refund-policy" />
            </FormRow>
          </FormCard>

          <FormCard title="Newsletter">
            <Field label="Heading" name="newsletterHeading" defaultValue="Join Our Smile Community!" />
            <Textarea
              label="Subheading"
              name="newsletterSub"
              defaultValue="Subscribe to get exclusive offers, dental tips and latest product updates."
              rows={2}
            />
          </FormCard>
        </div>

        <div className="xl:col-span-2">
          <FormActions
            cancelHref="/admin-dashboard"
            submitLabel="Save Footer Settings"
            secondaryLabel="Preview Changes"
          />
        </div>
      </form>
    </div>
  );
}

function SocialField({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-700">
        {label.slice(0, 2).toUpperCase()}
      </span>
      <div className="flex-1">
        <div className="text-xs font-bold text-slate-700">{label}</div>
        <input
          type="url"
          name={name}
          defaultValue={defaultValue}
          placeholder={`https://${label.toLowerCase()}.com/your-handle`}
          className="mt-0.5 w-full border-0 bg-transparent p-0 font-mono text-xs text-slate-600 outline-none placeholder:text-slate-400"
        />
      </div>
    </div>
  );
}
