import type { TDateISOString, TTodo } from "@/shared/types/main_types";
import { Link } from "@heroui/react";
import { ListIndentIncrease } from "lucide-react";

export default function TodosTable({
  paramDate,
  paramTodos,
}: {
  paramDate: TDateISOString;
  paramTodos: TTodo[];
}) {
  return (
    <section className="w-full mt-2">
      <div className="w-full p-2 text-xs border-b border-b-slate-400/50 flex gap-4 items-center justify-between">
        <span></span>
        <Link
          href={`/todos/${paramDate}/newTodo`}
          className={
            "p-2 scale-80 w-fit  bg-accent text-accent-foreground flex gap-2"
          }
        >
          <ListIndentIncrease size={14} />
          Новая задача
        </Link>
      </div>
      {paramTodos.map((todo, index) => (
        <div
          key={todo.documentId}
          className="w-full grid grid-cols-[100px_1fr_0.6fr_0.5fr] gap-2 items-start"
        >
          <div>{index + 1}</div>
          <div>{todo.title}</div>
          <div>{todo.updated.toLocaleString()}</div>
          <div>{todo.isCompleted ? "завершена" : "В работе"}</div>
        </div>
      ))}
    </section>
  );
}
