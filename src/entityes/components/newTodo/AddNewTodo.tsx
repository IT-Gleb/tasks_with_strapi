"use client";

import getCacheQueryClient from "@/entityes/providers/getQueryCache";
import useGetData from "@/shared/hooks/tanstack/useGetData";
import type { TDateISOString, TTodosMax } from "@/shared/types/main_types";
import {
  API_URL,
  DatePage_Prefix,
  TodosMax,
  TodosMax_prefix,
} from "@/shared/utils/consts";
import { Button, Surface } from "@heroui/react";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { Cross, ListIndentIncrease, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  ChangeEvent,
  SubmitEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as z from "zod";
import * as motion from "motion/react-client";

const todoValidate = z
  .string()
  .trim()
  .min(2, { message: "Длина строки не менее 2-х символов" })
  .max(120, { message: "Длина строки не более 120-ти символов!" });

type TNewTodoData = {
  title: string;
  isCompleted: boolean;
  updated: TDateISOString;
  order: number;
};

export default function AddNewTodo({
  paramDate,
}: {
  paramDate: TDateISOString;
}) {
  const queryCl = getCacheQueryClient();
  const router = useRouter();

  const [inputValue, setInputValue] = useState<string>("");
  const [errValue, setErrValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [todoOrder, setTodoOrder] = useState<number>(0);

  const maxUrl = `${API_URL}/${TodosMax}`;
  const {
    data: max,
    isLoading,
    isError,
  } = useGetData<TTodosMax>({
    dataKey: TodosMax_prefix,
    paramUrl: maxUrl,
  });
  // console.log(max?.data[0].order);
  const {
    mutateAsync,
    isPending,
    isSuccess,
    isError: addIsError,
  } = useMutation({
    mutationKey: ["todos-" + paramDate],
    mutationFn: async (newTodo: TNewTodoData) => {
      //console.log(JSON.stringify(newTodo));

      return await fetch(API_URL + "/todos", {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        method: "POST",
        signal: AbortSignal.timeout(3500),
        body: JSON.stringify({ data: newTodo }),
      });
    },
    onError: () => {
      console.log("Ошибка при добавлении данных!!!");
    },
    onSuccess: async () => {
      await Promise.all([
        queryCl.invalidateQueries({ queryKey: [TodosMax_prefix] }),
        queryCl.invalidateQueries({
          queryKey: [DatePage_Prefix.replace("%1", paramDate)],
        }),
      ]);
    },
  });

  const newTodoData: TNewTodoData = useMemo(() => {
    return {
      title: inputValue,
      isCompleted: false,
      updated: paramDate,
      order: todoOrder,
    };
  }, [inputValue]);

  useEffect(() => {
    let isWork: boolean = true;

    if (isWork) {
      if (
        max === undefined ||
        max?.data === null ||
        (max as TTodosMax).data.length < 1
      )
        setTodoOrder(1);
      else {
        setTodoOrder((max as TTodosMax).data[0].order + 1);
      }
    }

    return () => {
      isWork = false;
    };
  }, [max]);

  const handlerInput = (evt: ChangeEvent<HTMLInputElement>) => {
    setInputValue(evt.target.value);
  };

  const formChange = (evt: ChangeEvent<HTMLFormElement>) => {
    const { name, value } = evt.target;
    setErrValue("");

    //console.log(name, ":", value);
  };

  const formSubmit = async (evt: SubmitEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const zodMashine = todoValidate.safeParse(inputValue);
    if (!zodMashine.success) {
      setErrValue(zodMashine.error.issues[0].message);
      inputRef.current?.focus();
      return;
    }
    setInputValue("");
    //console.log(inputValue);
    //console.log(newTodoData);
    const test = await mutateAsync(newTodoData);
    if (!test.ok) {
      setErrValue(`${test.status}, ${test.statusText}`);
      return;
    }

    router.push("/todos/" + paramDate);

    //router.push("/todos/" + paramDate);
  };

  if (isLoading || isPending) {
    return (
      <div className="w-fit mt-5 mx-auto">
        <Loader2 size={42} className=" animate-spin" />
      </div>
    );
  }
  if (isError || max?.data === null || max?.data === undefined) {
    return (
      <div className="mt-5 p-2 w-fit mx-auto">
        <p className=" text-red-500 dark:text-red-300">
          Ошибка!{" "}
          <span className="text-accent dark:text-foreground">
            При получении данных возникла ошибка попробуйте позже повторить
            запрос...
          </span>
        </p>
      </div>
    );
  }

  return (
    <motion.div
      title=" Новая задача "
      className="p-4 mt-5 rounded-xl border border-accent-soft relative before:absolute before:content-[attr(title)] before:text-xs before:text-accent before:z-3 before:-top-2.5 before:left-4 before:bg-white dark:before:bg-background"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ ease: "easeInOut", delay: 0.35 }}
    >
      <form
        onChange={formChange}
        onSubmit={formSubmit}
        className="flex gap-4 flex-wrap items-center justify-between p-2"
      >
        <div className="flex items-center gap-x-2 w-full border border-slate-200 dark:border-slate-600 rounded-s-md  focus-within:border-2 focus-within:border-accent ">
          <input
            ref={inputRef}
            autoFocus
            autoComplete="off"
            minLength={2}
            //   maxLength={120}
            value={inputValue}
            onChange={handlerInput}
            className={
              "w-full px-1 border-0 outline-0 focus:border-0 focus:outline-0"
            }
            name="newTodo"
            id="newTodo"
            placeholder="Название задачи ..."
          />
          <div className="bg-stone-200 dark:bg-stone-600 p-0">
            <Button
              isIconOnly
              size="sm"
              className={"active:scale-50 scale-75 "}
              onClick={() => {
                setInputValue("");
                inputRef.current?.focus();
              }}
            >
              <Cross size={14} className=" rotate-45" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-red-600 dark:text-red-300 p-1 my-1">
          {errValue}
        </p>
        <div className="w-full text-center mt-2">
          <Button type="submit" variant="primary" size="md">
            <ListIndentIncrease size={16} />
            Добавить
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
