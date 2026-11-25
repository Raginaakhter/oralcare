import { Suspense } from "react";
import { Loader } from "../../AdminShell";
import { AdminOrderDetail } from "./AdminOrderDetail";

// [id] accepts an order id or an order number (OC-…).
export default function AdminOrderPage({ params }: PageProps<"/admin-dashboard/orders/[id]">) {
  return (
    <Suspense fallback={<Loader />}>
      <AdminOrderDetail params={params} />
    </Suspense>
  );
}
