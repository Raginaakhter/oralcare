"use client";

import { adminDealsApi, type Deal } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import { ContentManager } from "../ContentManager";

export default function DealsAdminPage() {
  return (
    <ContentManager<Deal & Record<string, unknown>, Record<string, unknown>>
      title="Deal of the Day"
      noun="Deal"
      description="Time-limited offers shown on the homepage with a live countdown."
      storefrontNote="The first active deal within its start/end window is shown on the homepage (GET /deals/active)."
      api={adminDealsApi as never}
      fields={[
        { name: "product", label: "Product", type: "product", required: true },
        { name: "title", label: "Title", type: "text", required: true, hint: "e.g. Advanced Whitening Kit" },
        { name: "badgeText", label: "Badge", type: "text", hint: "e.g. 25% Off Today — defaults to the product's discount." },
        { name: "description", label: "Description", type: "textarea" },
        { name: "image", label: "Image (optional)", type: "image", hint: "Defaults to the product image." },
        { name: "startsAt", label: "Starts", type: "datetime", hint: "Empty = now." },
        { name: "endsAt", label: "Ends", type: "datetime", required: true },
        { name: "isActive", label: "Active", type: "checkbox" },
      ]}
      summary={(d) => {
        const p = typeof d.product === "object" ? d.product : null;
        return {
          title: d.title,
          subtitle: `${p ? p.productName + " · " : ""}${formatDateTime(d.startsAt)} → ${formatDateTime(d.endsAt)}`,
          image: d.image,
        };
      }}
    />
  );
}
