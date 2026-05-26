"use client";

import type { TDateISOString, TTodo } from "@/shared/types/main_types";
import { Button, cn, Link, SortDescriptor, Table } from "@heroui/react";
import {
  ArrowUp,
  Check,
  CircleCheck,
  Cross,
  Edit,
  ListIndentIncrease,
} from "lucide-react";
import { memo, useMemo, useState } from "react";

type THeader = "id" | "title" | "isCompleted" | "order" | "actions";

type THeaderData = {
  [key in THeader]: string;
};

type TSortDirection = "ascending" | "descending";
const sortedCellIndex = ["title", "isCompleted", "order"];

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
            sortDirection === "descending" ? "rotate-180" : "",
          )}
        />
      )}
    </span>
  );
}

const TblHeader = memo(({ header }: { header: THeaderData }) => {
  const head: Record<string, string> = {};

  for (const [key, val] of Object.entries(header)) {
    head[key] = val;
  }

  return (
    <Table.Header className={"text-lg uppercase"}>
      {Object.keys(head).map((key) => (
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
                  {head[key]}
                </SortableColumnHeaderCell>
              )
            : head[key]}
        </Table.Column>
      ))}
    </Table.Header>
  );
});

const ActionsCell = memo(({ todo }: { todo: TTodo }) => {
  return (
    <span className="flex items-center justify-between gap-4">
      <Button
        variant="ghost"
        isIconOnly
        size="md"
        aria-label="Изменить статус"
        className={" w-10 h-6 text-green-700 active:scale-90"}
      >
        <Check size={20} strokeWidth={2} />
      </Button>
      <Button
        variant="ghost"
        isIconOnly
        size="md"
        aria-label="Изменить задачу"
        className={"w-10 h-6 active:scale-90"}
      >
        <Edit size={20} />
      </Button>
      <Button
        variant="ghost"
        isIconOnly
        size="md"
        aria-label="Удалить задачу"
        className={" w-10 h-6 active:scale-90 text-red-500"}
      >
        <Cross size={20} className=" rotate-45" />
      </Button>
    </span>
  );
});

const TableBodyRow = memo(({ todo, index }: { todo: TTodo; index: number }) => {
  return (
    <Table.Row id={todo.id}>
      <Table.Cell>{index}</Table.Cell>
      <Table.Cell
        className={todo.isCompleted ? " line-through text-slate-400" : ""}
      >
        {todo.title}
      </Table.Cell>
      <Table.Cell className={"w-fit mx-auto"}>
        {todo.isCompleted ? <CircleCheck size={18} /> : "в работе"}
      </Table.Cell>
      <Table.Cell className={"text-center"}>{todo.order}</Table.Cell>
      <Table.Cell>
        <ActionsCell todo={todo} />
      </Table.Cell>
    </Table.Row>
  );
});

export default function TodosTable({
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
