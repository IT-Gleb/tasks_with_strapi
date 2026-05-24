import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default async function NewTodo() {
  return (
    <Suspense fallback={<Loader2 size={38} className=" animate-spin" />}>
      <div>Новая задача</div>
    </Suspense>
  );
}
