import ReportsProvider from "@/entityes/components/shop/manager/reports/ReportsProvider";
import { Loader } from "lucide-react";
import { Suspense } from "react";

export default async function Reports() {
  return (
    <Suspense fallback={<Loader size={36} className=" animate-spin" />}>
      <ReportsProvider />
    </Suspense>
  );
}
