import { Suspense } from "react";
import { Loader } from "../AdminShell";
import { StaffAdmin } from "./StaffAdmin";

export const metadata = { title: "Staff — Admin" };

export default function StaffPage() {
  return (
    <Suspense fallback={<Loader />}>
      <StaffAdmin />
    </Suspense>
  );
}
