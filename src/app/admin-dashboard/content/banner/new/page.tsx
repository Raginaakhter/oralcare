import { AdminHeader } from "../../../AdminHeader";
import { SlideForm } from "../SlideForm";

export const metadata = { title: "Add Slide — Admin — OralCareBD" };

export default function NewSlidePage() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin-dashboard" },
          { label: "Content" },
          { label: "Banner", href: "/admin-dashboard/content/banner" },
          { label: "Add Slide" },
        ]}
        title="Add New Slide"
        description="Create a new slide for the homepage hero carousel."
      />
      <SlideForm mode="create" />
    </div>
  );
}
