import { OrderDetailClient } from "@/components/OrderDetailClient";

export async function generateStaticParams() {
  return [
    { id: "ORD-10285" },
    { id: "ORD-10251" },
    { id: "ORD-10198" },
    { id: "ORD-10156" },
  ];
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OrderDetailClient id={id} />;
}
