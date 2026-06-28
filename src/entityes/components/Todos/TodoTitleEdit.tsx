"use client";

import { Button, Popover } from "@heroui/react";
import { CheckCheck, Cross, Edit } from "lucide-react";
import { ChangeEvent, MouseEvent, useRef, useState } from "react";
import * as motion from "motion/react-client";

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
  const [isPopover, setIsPopover] = useState<boolean>(false);

  const handlerSetValue = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.currentTarget;
    setValueTitle(value);
  };

  const handlerClick = (evt: unknown) => {
    (evt as MouseEvent).preventDefault();
    setValueTitle("");
    refInput.current?.focus();
  };
  return (
    <Popover isOpen={isPopover} onOpenChange={setIsPopover}>
      <Button
        variant="ghost"
        isIconOnly
        size="md"
        aria-label="Изменить задачу"
        className={"w-10 h-6 active:scale-90"}
        onClick={(e) => {
          e.preventDefault();
          setIsPopover(!isPopover);
        }}
      >
        <Edit size={20} />
      </Button>
      <Popover.Content placement="start">
        <Popover.Dialog>
          <Popover.Arrow />
          <motion.div
            className="p-1 flex flex-row items-center rounded-s-xl outline-2 outline-stone-400 gap-0 focus-within:outline-accent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
          >
            <input
              ref={refInput}
              autoComplete="off"
              autoFocus
              value={valueTitle}
              onChange={handlerSetValue}
              className="min-w-60 sm:min-w-120 w-full p-1 outline-0 border-0 "
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
                  setIsPopover(false);
                }
                if (e.key === "Escape") {
                  handler(false);
                  setIsPopover(false);
                }
              }}
            />
            <div className="bg-transparent p-1">
              <Button
                isIconOnly
                variant="ghost"
                className={"w-5 h-5 p-1 "}
                isDisabled={valueTitle.trim().length < 3}
                onClick={(e) => {
                  e.preventDefault();
                  handlerSetData(valueTitle);
                  handler(false);
                  setIsPopover(false);
                }}
              >
                <CheckCheck size={14} />
              </Button>
            </div>
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
          </motion.div>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
}
