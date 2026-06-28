"use client";

import type {
  TDateISOString,
  TPageMeta,
  TTodo,
  TTodosData,
} from "@/shared/types/main_types";
import { API_URL, DatePage_Prefix, DatePagePath } from "@/shared/utils/consts";
import {
  DeleteTodoQuery,
  fetchGet,
  ModifyDataQuery,
} from "@/shared/utils/fetchers";
import {
  Button,
  cn,
  Description,
  Link,
  Pagination,
  SortDescriptor,
  Table,
} from "@heroui/react";
import { ArrowUp, Check, CircleCheck, ListIndentIncrease } from "lucide-react";

import { memo, useEffect, useMemo, useState } from "react";
import TodoDeleteDialog from "../dialog/TodoDeleteDialog";
import ToDoTitleEdit from "./TodoTitleEdit";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import * as motion from "motion/react-client";

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
  handlerSetTitle,
}: {
  todo: TTodo;
  handlerCompleted: (param: boolean) => void;
  handlerDelete: (param: boolean) => void;
  handlerIsEdit: (param: boolean) => void;
  handlerSetTitle: (param: string) => void;
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
        className={" w-11 h-6 text-green-700 active:scale-90"}
        onClick={() => {
          setCompleted((prev) => (prev = !prev));
        }}
      >
        <Check size={20} strokeWidth={2} />
      </Button>
      <ToDoTitleEdit
        paramTitleTodo={todo.title}
        handler={handlerIsEdit}
        handlerSetData={handlerSetTitle}
      />
      {/* <Button
        variant="ghost"
        isIconOnly
        size="md"
        aria-label="Изменить задачу"
        className={"w-10 h-6 active:scale-90"}
        onClick={() => handlerIsEdit(true)}
      >
        <Edit size={20} />
      </Button> */}
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
          {/* {isTitileEdit ? (
            <ToDoTitleEdit
              paramTitleTodo={rowTodo.title}
              handler={setIsTitleEdit}
              handlerSetData={handlerIsTitleTodo}
            />
          ) : (
            rowTodo.title
          )} */}
          {rowTodo.title}
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
            handlerSetTitle={handlerIsTitleTodo}
          />
        </Table.Cell>
      </Table.Row>
    );
  },
);

function TodosTable({
  paramDate,
  paramTodos,
  pageMeta,
  paginatePage,
}: {
  paramDate: TDateISOString;
  paramTodos: TTodo[];
  pageMeta: TPageMeta;
  paginatePage: (param: number) => void;
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
  }, [sortDescriptor, paramTodos]);

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
        <Table.Footer>
          <Pagination size="sm" className="w-full">
            <Pagination.Summary>
              <span>{`Страница: ${pageMeta.pagination.page} из ${pageMeta.pagination.pageCount}`}</span>
            </Pagination.Summary>
            <Pagination.Content>
              <Pagination.Item>
                <Pagination.Previous
                  isDisabled={
                    Number.isNaN(pageMeta.pagination.page) ||
                    Number(pageMeta.pagination.page) <= 1
                  }
                  onPress={() => paginatePage(-1)}
                >
                  <Pagination.PreviousIcon />
                  <span>Предыдущая</span>
                </Pagination.Previous>
              </Pagination.Item>

              {/* {pages.map((p) => (
              <Pagination.Item key={p}>
                <Pagination.Link isActive={p === page} onPress={() => setPage(p)}>
                  {p}
                </Pagination.Link>
              </Pagination.Item>
            ))} */}

              <Pagination.Item>
                <Pagination.Next
                  isDisabled={
                    Number.isNaN(pageMeta.pagination.page) ||
                    Number(pageMeta.pagination.page) >=
                      Number(pageMeta.pagination.pageCount)
                  }
                  onPress={() => paginatePage(1)}
                >
                  <span>Следующая</span>
                  <Pagination.NextIcon />
                </Pagination.Next>
              </Pagination.Item>
            </Pagination.Content>
          </Pagination>
        </Table.Footer>
      </Table>
    </section>
  );
}

export default function TodosTableProvider({
  paramDate,
}: {
  paramDate: TDateISOString;
}) {
  const [page, setPage] = useState<number>(1);
  const [todosData, setTodosData] = useState<TTodo[]>([]);

  const queryKey = DatePage_Prefix.replace("%1", paramDate);

  const url = useMemo(() => {
    return `${API_URL}/${DatePagePath.replace("%1", paramDate).replace("%2", String(page))}`;
  }, [page]);

  const {
    data: todos,
    isSuccess,
    error,
  } = useQuery({
    queryKey: [queryKey, page],
    queryFn: async () => {
      return await fetchGet<TTodosData>(url);
    },
    placeholderData: keepPreviousData,
  });

  useMemo(() => {
    //console.log(page, todos?.meta, todos?.data);
    if (!!todos && todos.data.length > 0) {
      setTodosData(todos?.data as TTodo[]);
    }
  }, [todos]);

  const handlerPage = (offsetPage: number) => {
    setPage((prev) => (prev = prev + offsetPage));
  };

  // if (isLoading) {
  //   return <Loading />;
  // }

  if (!!error) {
    return (
      <div className="p-2 w-fit mx-auto flex flex-col gap-y-4">
        Ошибка!
        <Description>
          <span>{error.name}</span> <span>{error.message}</span>
        </Description>
      </div>
    );
  }

  return isSuccess ? (
    <motion.div
      className="w-full p-1"
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
    >
      <TodosTable
        paramDate={paramDate}
        paramTodos={todosData}
        pageMeta={todos?.meta as TPageMeta}
        paginatePage={handlerPage}
      />
    </motion.div>
  ) : null;
}
