import { Suspense } from "react";
import { Loader } from "../AdminShell";
import { OrdersList } from "./OrdersList";

export const metadata = { title: "Orders — Admin" };

export default function OrdersPage() {
  return (
    <Suspense fallback={<Loader />}>
      <OrdersList />
    </Suspense>
  );
}
