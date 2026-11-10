import { notFound } from "next/navigation";
import { AdminHeader } from "../../../../AdminHeader";
import { SlideForm } from "../../SlideForm";
import { heroSlides, getSlideByIndex } from "../../data";

export async function generateStaticParams() {
  return heroSlides.map((_, i) => ({ index: i.toString() }));
}

export async function generateMetadata({ params }: PageProps<"/admin-dashboard/content/banner/[index]/edit">) {
  const { index } = await params;
  const slide = getSlideByIndex(index);
  return { title: slide ? `Edit Slide ${parseInt(index) + 1} — Admin` : "Edit Slide — Admin" };
}

export default async function EditSlidePage({
  params,
}: PageProps<"/admin-dashboard/content/banner/[index]/edit">) {
  const { index } = await params;
  const slide = getSlideByIndex(index);
  if (!slide) notFound();

  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin-dashboard" },
          { label: "Content" },
          { label: "Banner", href: "/admin-dashboard/content/banner" },
          { label: `Edit Slide ${parseInt(index) + 1}` },
        ]}
        title={`Edit Slide ${parseInt(index) + 1}`}
        description={`Editing: ${slide.titleLine1} ${slide.titleLine2}`}
      />
      <SlideForm slide={slide} mode="edit" />
    </div>
  );
}
