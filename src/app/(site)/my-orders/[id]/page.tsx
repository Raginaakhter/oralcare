import { Suspense } from "react";
import { OrderDetailFromParams } from "@/components/OrderDetailClient";
import { Spinner } from "@/components/orders";

export const metadata = { title: "Order Details - OralCareBD" };

// Order pages are private and per-user; params resolve inside Suspense at request time.
export default function OrderDetailPage({ params }: PageProps<"/my-orders/[id]">) {
  return (
    <Suspense fallback={<Spinner label="Loading order…" />}>
      <OrderDetailFromParams params={params} />
    </Suspense>
  );
}
