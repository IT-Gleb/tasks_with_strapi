"use client";

import { Button, Surface } from "@heroui/react";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NoTodo() {
  const router = useRouter();
  const handlerNewTodo = () => {
    router.push("/todos/newTodo");
  };
  return (
    <div
      title="Новая задача"
      className="mt-5 border border-accent/50 transition-colors relative before:z-3 before:absolute before:px-0.75 before:py-0.5 before:rounded-sm before:bg-accent/65 before:shadow-sm before:content-[attr(title)] before:left-4 before:-top-2.5 before:text-stone-50 dark:before:text-stone-200 before:text-xs "
    >
      <Surface className=" p-2 flex flex-col gap-y-4 items-center ">
        <p className="p-2">
          За этот период не найдено задач!{" "}
          <span className="block text-center font-semibold">
            Добавить новую?
          </span>
        </p>
        <Button
          variant="primary"
          size="md"
          className={"text-sm"}
          onClick={handlerNewTodo}
        >
          <PlusCircle size={20} />
          Добавить задачу
        </Button>
      </Surface>
    </div>
  );
}
