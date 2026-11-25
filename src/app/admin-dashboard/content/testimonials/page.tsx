"use client";

import { adminTestimonialsApi, type Testimonial } from "@/lib/api";
import { ContentManager } from "../ContentManager";

export default function TestimonialsAdminPage() {
  return (
    <ContentManager<Testimonial & Record<string, unknown>, Record<string, unknown>>
      title="Testimonials"
      noun="Testimonial"
      description="Expert quotes and customer stories."
      storefrontNote="The first active expert testimonial appears in the homepage “Expert Voice” card (GET /testimonials?type=expert)."
      api={adminTestimonialsApi as never}
      fields={[
        {
          name: "type",
          label: "Type",
          type: "select",
          required: true,
          defaultValue: "expert",
          options: [
            { value: "expert", label: "Expert (dentist, specialist)" },
            { value: "customer", label: "Customer" },
          ],
        },
        { name: "name", label: "Name", type: "text", required: true },
        { name: "role", label: "Role", type: "text", hint: "e.g. BDS · Oral Health Specialist" },
        { name: "quote", label: "Quote", type: "textarea", required: true },
        { name: "rating", label: "Rating (1–5)", type: "number", min: 1, max: 5, defaultValue: 5 },
        { name: "image", label: "Photo", type: "image" },
        { name: "isVerified", label: "Show “Verified” badge", type: "checkbox", defaultValue: false },
        { name: "isActive", label: "Active", type: "checkbox" },
      ]}
      summary={(t) => ({ title: t.name, subtitle: `${t.type === "expert" ? "Expert" : "Customer"} · ${t.quote}`, image: t.image })}
    />
  );
}
