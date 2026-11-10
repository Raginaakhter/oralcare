import { notFound } from "next/navigation";
import { AdminHeader } from "../../../AdminHeader";
import { PromotionForm } from "../../PromotionForm";
import { promotions, getPromotionByCode } from "../../data";

export async function generateStaticParams() {
  return promotions.map((p) => ({ code: p.code }));
}

export async function generateMetadata({ params }: PageProps<"/admin-dashboard/promotions/[code]/edit">) {
  const { code } = await params;
  const p = getPromotionByCode(code);
  return { title: p ? `Edit ${p.name} — Admin` : "Edit Promotion — Admin" };
}

export default async function EditPromotionPage({
  params,
}: PageProps<"/admin-dashboard/promotions/[code]/edit">) {
  const { code } = await params;
  const p = getPromotionByCode(code);
  if (!p) notFound();

  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin-dashboard" },
          { label: "Promotions", href: "/admin-dashboard/promotions" },
          { label: `Edit ${p.code}` },
        ]}
        title={`Edit: ${p.name}`}
        description={`Update settings for the ${p.code} coupon.`}
      />
      <PromotionForm promotion={p} mode="edit" />
    </div>
  );
}
