import { Suspense } from "react";
import { Loader } from "../../AdminShell";
import { CustomerDetail } from "./CustomerDetail";

export default function CustomerPage({ params }: PageProps<"/admin-dashboard/customers/[id]">) {
  return (
    <Suspense fallback={<Loader />}>
      <CustomerDetail params={params} />
    </Suspense>
  );
}
