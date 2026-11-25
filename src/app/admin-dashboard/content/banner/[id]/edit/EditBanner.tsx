"use client";

import { use } from "react";
import { bannersApi } from "@/lib/api";
import { useAsync } from "@/lib/hooks";
import { AdminHeader } from "../../../../AdminHeader";
import { Loader } from "../../../../AdminShell";
import { SlideForm } from "../../SlideForm";

export function EditBanner({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const banner = useAsync(() => bannersApi.get(id), [id]);
  if (banner.loading) return <Loader />;
  if (!banner.data) return <p className="text-sm font-semibold text-rose-700">{banner.error ?? "Banner not found"}</p>;
  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin-dashboard" },
          { label: "Banners", href: "/admin-dashboard/content/banner" },
          { label: banner.data.title },
        ]}
        title={`Edit: ${banner.data.title}`}
      />
      <SlideForm mode="edit" banner={banner.data} />
    </div>
  );
}
