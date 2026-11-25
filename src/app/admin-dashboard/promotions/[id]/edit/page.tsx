import { Suspense } from "react";
import { Loader } from "../../../AdminShell";
import { EditPromotion } from "./EditPromotion";

export default function EditPromotionPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<Loader />}>
      <EditPromotion params={params} />
    </Suspense>
  );
}
