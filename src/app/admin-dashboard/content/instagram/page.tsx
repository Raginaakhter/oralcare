"use client";

import { adminInstagramApi, type InstagramPost } from "@/lib/api";
import { ContentManager } from "../ContentManager";

export default function InstagramAdminPage() {
  return (
    <ContentManager<InstagramPost & Record<string, unknown>, Record<string, unknown>>
      title="Instagram Grid"
      noun="Post"
      description="Photos for the homepage “Follow Our Smile Journey” grid."
      storefrontNote="The first six active posts are shown (GET /instagram-posts). The “Follow us” link uses the Instagram social link from Footer settings."
      api={adminInstagramApi as never}
      fields={[
        { name: "image", label: "Image", type: "image", required: true },
        { name: "link", label: "Post URL", type: "text", hint: "https://instagram.com/p/…" },
        { name: "caption", label: "Caption", type: "textarea" },
        { name: "isActive", label: "Active", type: "checkbox" },
      ]}
      summary={(p) => ({ title: p.caption || "Instagram post", subtitle: p.link, image: p.image })}
    />
  );
}
