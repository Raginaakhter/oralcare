import { AdminHeader } from "../../../AdminHeader";
import { SlideForm } from "../SlideForm";

export const metadata = { title: "New Banner — Admin" };

export default function NewBannerPage() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin-dashboard" },
          { label: "Banners", href: "/admin-dashboard/content/banner" },
          { label: "New" },
        ]}
        title="Add Banner"
      />
      <SlideForm mode="create" />
    </div>
  );
}
