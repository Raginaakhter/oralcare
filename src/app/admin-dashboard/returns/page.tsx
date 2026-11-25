import { Suspense } from "react";
import { Loader } from "../AdminShell";
import { ReturnsAdmin } from "./ReturnsAdmin";

export const metadata = { title: "Returns & Refunds — Admin" };

export default function ReturnsPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ReturnsAdmin />
    </Suspense>
  );
}
