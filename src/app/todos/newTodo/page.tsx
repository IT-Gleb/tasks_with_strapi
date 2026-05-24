import { Loader2 } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import { Suspense } from "react";

export async function generateMetadata(
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: "Новая Задача: Добавить",
  };
}

// export const metadata: Metadata = {
//   title: "Новая Задача: Добавить",
//   //description: '...',
// };
export default async function NewTodo() {
  return (
    <Suspense fallback={<Loader2 size={38} className=" animate-spin" />}>
      <div>Новая задача</div>
    </Suspense>
  );
}
