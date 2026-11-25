import { Suspense } from "react";
import { Loader } from "../../../../AdminShell";
import { EditBanner } from "./EditBanner";

export default function EditBannerPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<Loader />}>
      <EditBanner params={params} />
    </Suspense>
  );
}
