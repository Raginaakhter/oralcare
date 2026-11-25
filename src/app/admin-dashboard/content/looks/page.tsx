"use client";

import { adminLooksApi, type Look } from "@/lib/api";
import { ContentManager } from "../ContentManager";

export default function LooksAdminPage() {
  return (
    <ContentManager<Look & Record<string, unknown>, Record<string, unknown>>
      title="Shop the Look"
      noun="Look"
      description="Curated routines shown as a bento grid on the homepage."
      storefrontNote="One “feature” look fills the large tile; up to four “tile” looks fill the rest (GET /looks)."
      api={adminLooksApi as never}
      fields={[
        { name: "title", label: "Title", type: "text", required: true, hint: "e.g. The Whitening Starter Edit" },
        { name: "tag", label: "Tag", type: "text", hint: "e.g. Morning, Editor's Pick" },
        { name: "description", label: "Description", type: "textarea" },
        {
          name: "layout",
          label: "Layout",
          type: "select",
          required: true,
          defaultValue: "tile",
          options: [
            { value: "feature", label: "Feature (large card)" },
            { value: "tile", label: "Tile (small card)" },
          ],
        },
        { name: "products", label: "Products in this look", type: "products", hint: "Up to 12. The card shows the cheapest price as “From”." },
        { name: "link", label: "Link", type: "text", hint: "Where the card goes, e.g. /shop?category=teeth-whitening" },
        { name: "image", label: "Image (optional)", type: "image", hint: "Defaults to the first product's image." },
        { name: "isActive", label: "Active", type: "checkbox" },
      ]}
      summary={(l) => ({
        title: l.title,
        subtitle: `${l.layout === "feature" ? "Feature" : "Tile"} · ${l.products.length} product(s)${l.tag ? ` · ${l.tag}` : ""}`,
        image: l.image,
      })}
    />
  );
}
