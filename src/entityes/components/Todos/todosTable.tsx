"use client";

import type {
  TDateISOString,
  TTodo,
  TTodosData,
} from "@/shared/types/main_types";
import { API_URL, DatePage_Prefix, DatePagePath } from "@/shared/utils/consts";
import { DeleteTodoQuery, ModifyDataQuery } from "@/shared/utils/fetchers";
import { Button, cn, Link, SortDescriptor, Table } from "@heroui/react";
import {
  ArrowUp,
  Check,
  CircleCheck,
  Edit,
  ListIndentIncrease,
} from "lucide-react";

import { memo, useEffect, useMemo, useState } from "react";
import TodoDeleteDialog from "../dialog/TodoDeleteDialog";
import ToDoTitleEdit from "./TodoTitleEdit";

import Loading from "@/app/loading";
import useGetData from "@/shared/hooks/tanstack/useGetData";

type THeader = "id" | "title" | "isCompleted" | "order" | "actions";

type THeaderData = {
  [key in THeader]: string;
};

type TSortDirection = "ascending" | "descending";

const sortedCellIndex: string[] = ["title", "isCompleted", "order"];

const NewTodoSection = memo(({ paramDate }: { paramDate: TDateISOString }) => {
  return (
    <div className="my-5 w-full p-2 text-xs border-b border-b-slate-400/50 flex gap-4 items-center justify-between">
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
  );
});

function SortableColumnHeaderCell({
  children,
  sortDirection,
}: {
  children: React.ReactNode;
  sortDirection?: TSortDirection;
}) {
  return (
    <span className="flex items-center justify-between">
      {children}
      {!!sortDirection && (
        <ArrowUp
          size={12}
          className={cn(
            "size-3 transform transition-transform duration-200 ease-out",
            sortDirection === "descending" ? "" : "rotate-180",
          )}
        />
      )}
    </span>
  );
}

const TblHeader = memo(({ header }: { header: THeaderData }) => {
  const headerData = useMemo(() => {
    const head: Record<string, string> = {};
    for (const [key, val] of Object.entries(header)) {
      head[key] = val;
    }
    return head;
  }, [header]);

  return (
    <Table.Header className={"text-lg uppercase"}>
      {Object.keys(headerData).map((key) => (
        <Table.Column
          key={key}
          isRowHeader
          id={key}
          allowsSorting={sortedCellIndex.includes(key) ? true : false}
          className={sortedCellIndex.includes(key) ? "font-bold" : ""}
          defaultWidth={
            key === "id" ? "0.25fr" : key === "title" ? "2fr" : "0.5fr"
          }
        >
          {sortedCellIndex.includes(key)
            ? ({ sortDirection }) => (
                <SortableColumnHeaderCell sortDirection={sortDirection}>
                  {headerData[key]}
                </SortableColumnHeaderCell>
              )
            : headerData[key]}
        </Table.Column>
      ))}
    </Table.Header>
  );
});

const ActionsCell = ({
  todo,
  handlerCompleted,
  handlerDelete,
  handlerIsEdit,
}: {
  todo: TTodo;
  handlerCompleted: (param: boolean) => void;
  handlerDelete: (param: boolean) => void;
  handlerIsEdit: (param: boolean) => void;
}) => {
  const [completed, setCompleted] = useState<boolean>(todo.isCompleted);

  useEffect(() => {
    completed !== todo.isCompleted ? handlerCompleted(completed) : null;
  }, [completed]);

  return (
    <span className="flex items-center justify-between gap-4">
      <Button
        variant="ghost"
        isIconOnly
        size="md"
        aria-label="Изменить статус"
        className={" w-10 h-6 text-green-700 active:scale-90"}
        onClick={() => {
          setCompleted((prev) => (prev = !prev));
        }}
      >
        <Check size={20} strokeWidth={2} />
      </Button>
      <Button
        variant="ghost"
        isIconOnly
        size="md"
        aria-label="Изменить задачу"
        className={"w-10 h-6 active:scale-90"}
        onClick={() => handlerIsEdit(true)}
      >
        <Edit size={20} />
      </Button>
      <TodoDeleteDialog handler={handlerDelete} />
    </span>
  );
};

const TableBodyRow = memo(
  ({
    todo,
    index,
    paramDate,
  }: {
    todo: TTodo;
    index: number;
    paramDate: TDateISOString;
  }) => {
    const url = `${API_URL}/todos/${todo.documentId}`;
    const queryFilter = `todo-${todo.documentId}`;

    const [rowTodo, setRowTodo] = useState<TTodo>(todo);
    const [rowDeleted, setRowDeleted] = useState<boolean>(false);
    const [isTitileEdit, setIsTitleEdit] = useState<boolean>(false);

    const handlerIsCompletedTodo = async (param: boolean) => {
      setRowTodo({ ...rowTodo, isCompleted: param });

      const data = { isCompleted: param };

      await ModifyDataQuery(queryFilter, url, data);

      //console.log(rowTodo.isCompleted);
    };

    const handlerIsTitleTodo = (param: string) => {
      setRowTodo({ ...rowTodo, title: param });
      const data = { title: param };
      ModifyDataQuery(queryFilter, url, data);
    };

    const handlerIsRowDelete = (param: boolean) => {
      setRowDeleted(param);
      DeleteTodoQuery(queryFilter, url);
    };

    if (rowDeleted) {
      return null;
    }

    // console.log(rowTodo);

    return (
      <Table.Row id={rowTodo.id}>
        <Table.Cell>{index}</Table.Cell>
        <Table.Cell
          className={rowTodo.isCompleted ? " line-through text-slate-400" : ""}
        >
          {isTitileEdit ? (
            <ToDoTitleEdit
              paramTitleTodo={rowTodo.title}
              handler={setIsTitleEdit}
              handlerSetData={handlerIsTitleTodo}
            />
          ) : (
            rowTodo.title
          )}
        </Table.Cell>
        <Table.Cell
          className={
            rowTodo.isCompleted ? " text-center text-slate-400" : "text-center"
          }
        >
          {rowTodo.isCompleted ? (
            <CircleCheck size={18} className="w-fit mx-auto" />
          ) : (
            "в работе"
          )}
        </Table.Cell>
        <Table.Cell
          className={
            rowTodo.isCompleted ? "text-center text-slate-400" : "text-center"
          }
        >
          {rowTodo.order}
        </Table.Cell>
        <Table.Cell>
          <ActionsCell
            todo={rowTodo}
            handlerCompleted={handlerIsCompletedTodo}
            handlerDelete={handlerIsRowDelete}
            handlerIsEdit={setIsTitleEdit}
          />
        </Table.Cell>
      </Table.Row>
    );
  },
);

function TodosTable({
  paramDate,
  paramTodos,
}: {
  paramDate: TDateISOString;
  paramTodos: TTodo[];
}) {
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "order",
    direction: "ascending",
  });

  const SortedTodo = useMemo(() => {
    return [...paramTodos].sort((a, b) => {
      const col = sortDescriptor.column as keyof TTodo;
      const first = String(a[col]);
      const second = String(b[col]);
      let cmp = first.localeCompare(second, "ru-RU", { numeric: true });

      if (sortDescriptor.direction === "descending") {
        cmp *= -1;
      }

      return cmp;
    });
  }, [sortDescriptor]);

  return (
    <section className="w-full mt-2">
      <NewTodoSection paramDate={paramDate} />
      <Table>
        <Table.ScrollContainer>
          <Table.ResizableContainer>
            <Table.Content
              aria-label="Sortable table"
              className="min-w-180"
              sortDescriptor={sortDescriptor}
              onSortChange={setSortDescriptor}
            >
              <TblHeader
                header={{
                  id: "№.№",
                  title: "Название",
                  isCompleted: "Статус",
                  order: "Порядок",
                  actions: "Выполнить",
                }}
              />
              <Table.Body>
                {SortedTodo.map((todo, index) => (
                  <TableBodyRow
                    key={todo.documentId}
                    todo={todo}
                    index={index + 1}
                    paramDate={paramDate}
                  />
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ResizableContainer>
        </Table.ScrollContainer>
      </Table>
    </section>
  );
}

export default function TodosTableProvider({
  paramDate,
}: {
  paramDate: TDateISOString;
}) {
  const url = `${API_URL}/${DatePagePath.replace("%1", paramDate)}`;
  const queryKey = DatePage_Prefix.replace("%1", paramDate);
  const {
    data: todos,
    isSuccess,
    isLoading,
  } = useGetData<TTodosData>({ dataKey: queryKey, paramUrl: url });

  if (isLoading) {
    return <Loading />;
  }

  return isSuccess && todos?.data !== undefined ? (
    <TodosTable paramDate={paramDate} paramTodos={todos?.data as TTodo[]} />
  ) : null;
}
