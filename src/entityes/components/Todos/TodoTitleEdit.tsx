import type { TTodo } from "@/shared/types/main_types";
import { Button } from "@heroui/react";
import { Cross } from "lucide-react";
import { ChangeEvent, MouseEvent, useRef, useState } from "react";

export default function ToDoTitleEdit({
  paramTitleTodo,
  handler,
  handlerSetData,
}: {
  paramTitleTodo: string;
  handler: (param: boolean) => void;
  handlerSetData: (param: string) => void;
}) {
  const [valueTitle, setValueTitle] = useState<string>(paramTitleTodo);
  const refInput = useRef<HTMLInputElement | null>(null);

  const handlerSetValue = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.currentTarget;
    setValueTitle(value);
  };

  const handlerClick = (evt: any) => {
    (evt as MouseEvent).preventDefault();
    setValueTitle("");
    refInput.current?.focus();
  };
  return (
    <div className="p-1 flex flex-row items-center rounded-s-xl outline-2 outline-stone-400 gap-0 focus-within:outline-accent">
      <input
        ref={refInput}
        autoComplete="off"
        autoFocus
        value={valueTitle}
        onChange={handlerSetValue}
        className="w-full p-1 outline-0 border-0 "
        placeholder="Введите наименование..."
        minLength={2}
        maxLength={120}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (
              valueTitle.trim().length < 3 ||
              valueTitle.trim().length > 120
            ) {
              return;
            }
            handlerSetData(valueTitle);
            handler(false);
          }
          if (e.key === "Escape") {
            handler(false);
          }
        }}
      />
      <div className="bg-stone-100 dark:bg-stone-900 p-1">
        <Button
          isIconOnly
          variant="ghost"
          className={"w-5 h-5 p-1 "}
          onClick={handlerClick}
        >
          <Cross size={14} className="rotate-45" />
        </Button>
      </div>
    </div>
  );
}
