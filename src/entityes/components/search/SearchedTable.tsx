"use client";

import Loading from "@/app/(isTask)/loading";
import { useSearchPage } from "@/shared/store/searchPageStore";
import { TPageMeta, TTodo } from "@/shared/types/main_types";
import { API_URL } from "@/shared/utils/consts";
import { fetchGet } from "@/shared/utils/fetchers";
import {
  cn,
  Description,
  Link,
  Pagination,
  SortDescriptor,
  Surface,
  Table,
} from "@heroui/react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ArrowBigDown, CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

type TErrorSearchData = {
  error: boolean;
  name: string;
  message: string;
};

type TForSearchTable = Pick<
  TTodo,
  "id" | "documentId" | "title" | "isCompleted" | "updated"
>;

type TSearchTableHeader = { [key in TForSearchTable as string]: string };

interface TForTableData extends Pick<
  TTodo,
  "id" | "documentId" | "title" | "isCompleted" | "updated"
> {}

type TTblData = TForTableData[];

function TablePagination({ paramMeta }: { paramMeta: TPageMeta }) {
  const Page = useSearchPage((state) => state.page);
  const setPage = useSearchPage((state) => state.setPage);

  const Pages = useMemo(() => {
    const totalPages = paramMeta.pagination.pageCount as number;

    const getPageNumbers = () => {
      const pages: (number | "ellipsis")[] = [];

      pages.push(1);

      if (Page > 3) {
        pages.push("ellipsis");
      }

      const start = Math.max(2, Page - 1);
      const end = Math.min(totalPages - 1, Page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (Page < totalPages - 2) {
        pages.push("ellipsis");
      }

      pages.push(totalPages);

      return pages;
    };

    return getPageNumbers();
  }, [paramMeta]);

  return (
    <Pagination size="sm" className="w-full">
      <Pagination.Summary>
        <span>Страница {paramMeta.pagination.page}</span> из{" "}
        <span>{paramMeta.pagination.pageCount}</span>
        <span>Найдено: {paramMeta.pagination.total} задач </span>
      </Pagination.Summary>
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous
            isDisabled={Page === 1}
            onPress={() => setPage(Page - 1)}
          >
            <Pagination.PreviousIcon />
            <span>Предыдущая</span>
          </Pagination.Previous>
        </Pagination.Item>

        {Pages.map((item, index) =>
          item === "ellipsis" ? (
            <Pagination.Item key={`ellipsis-${index}`}>
              <Pagination.Ellipsis />
            </Pagination.Item>
          ) : (
            <Pagination.Item key={item + item * Math.random()}>
              <Pagination.Link
                isActive={item === Page}
                onPress={() => setPage(item as number)}
              >
                {item}
              </Pagination.Link>
            </Pagination.Item>
          ),
        )}

        <Pagination.Item>
          <Pagination.Next
            isDisabled={Page === paramMeta.pagination.pageCount}
            onPress={() => setPage(Page + 1)}
          >
            <span>Следующая</span>
            <Pagination.NextIcon />
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
  );
}

function TableRow({
  todo,
  paramIndex,
}: {
  todo: TForTableData;
  paramIndex: number;
}) {
  return (
    <Table.Row id={todo.documentId}>
      <Table.Cell>{paramIndex}</Table.Cell>
      <Table.Cell>
        <Link
          href={`/todos/${todo.updated.toString()}`}
          className={todo.isCompleted ? " line-through text-stone-400" : ""}
        >
          {todo.title}
        </Link>{" "}
      </Table.Cell>
      <Table.Cell className={"text-center"}>
        {todo.isCompleted ? (
          <CheckCircle2 size={14} color="darkgrey" className="w-fit mx-auto" />
        ) : (
          "в работе"
        )}
      </Table.Cell>
      <Table.Cell
        className={`text-xs ${todo.isCompleted ? "line-through text-stone-400" : ""}`}
      >
        {Intl.DateTimeFormat("ru-RU", {
          dateStyle: "medium",
        }).format(new Date(todo.updated))}
      </Table.Cell>
    </Table.Row>
  );
}

function SortableColumnHeader({
  children,
  sortDirection,
}: {
  children: React.ReactNode;
  sortDirection?: "ascending" | "descending";
}) {
  return (
    <span className="flex items-center justify-between">
      {children}
      {!!sortDirection && (
        <ArrowBigDown
          className={cn(
            "size-4 transform transition-transform duration-200 ease-out",
            sortDirection === "descending" ? "rotate-180" : "",
          )}
        />
      )}
    </span>
  );
}

function SearchedTable({
  paramHead,
  paramData,
  paramMeta,
}: {
  paramHead: TSearchTableHeader;
  paramData: TTblData;
  paramMeta: TPageMeta;
}) {
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "updated",
    direction: "ascending",
  });

  const sortedData = useMemo(() => {
    return [...paramData].sort((a, b) => {
      //const col = sortDescriptor.column as keyof TTblData;
      const col = sortDescriptor.column as keyof TForTableData;
      const first = String(a[col]);
      const second = String(b[col]);
      let cmp = first.localeCompare(second, "ru-RU", { numeric: true });

      if (sortDescriptor.direction === "descending") {
        cmp *= -1;
      }

      return cmp;
    });
  }, [sortDescriptor, paramData]);

  return (
    <Table className="mt-5">
      <Table.ScrollContainer>
        <Table.ResizableContainer>
          <Table.Content
            aria-label="Search table with pagination"
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
          >
            <Table.Header className="uppercase">
              <Table.Column isRowHeader maxWidth={80} id="id">
                №/№
              </Table.Column>
              {Object.keys(paramHead).map((item, index) => (
                <Table.Column
                  key={index}
                  allowsSorting
                  isRowHeader
                  defaultWidth={item === "title" ? "2fr" : "0.5fr"}
                  minWidth={120}
                  id={item}
                  className=" lg:font-bold"
                >
                  {({ sortDirection }) => {
                    const text = paramHead[item];
                    return (
                      <SortableColumnHeader sortDirection={sortDirection}>
                        {text}
                      </SortableColumnHeader>
                    );
                  }}
                </Table.Column>
              ))}
            </Table.Header>
            <Table.Body>
              {sortedData.map((item, index) => {
                //console.log(item.documentId);

                const pIndex =
                  Number(paramMeta.pagination.page) === 1
                    ? 0
                    : Number(paramMeta.pagination.page) *
                        Number(paramMeta.pagination.pageSize) -
                      Number(paramMeta.pagination.pageSize);
                return (
                  <TableRow
                    key={item.documentId}
                    todo={item}
                    paramIndex={index + 1 + pIndex}
                  />
                );
              })}
            </Table.Body>
          </Table.Content>
        </Table.ResizableContainer>
      </Table.ScrollContainer>
      <Table.Footer>
        <TablePagination paramMeta={paramMeta} />
      </Table.Footer>
    </Table>
  );
}

function WhatSearch({ paramWhatSearch }: { paramWhatSearch: string }) {
  return (
    <Surface
      title="Поисковый запрос"
      className="p-2 min-w-70 mx-auto mt-2 rounded-lg border relative before:content-[attr(title)] before:absolute before:left-3 before:-top-2.5 before:text-chocolate-dark dark:before:text-accent before:border before:border-chocolate-dark before:rounded-sm before:px-1 before:text-xs before:bg-background dark:before:bg-accent-soft-hover"
    >
      <Description>{paramWhatSearch}</Description>
    </Surface>
  );
}

export default function SearchedTableProvider() {
  const srch_params = useSearchParams();
  //console.log(srch_params);
  const sParams = new URLSearchParams(srch_params.toString());

  const Page = useSearchPage((state) => state.page);

  const [whatSearch, setWhatSearch] = useState<string>(
    sParams.get("word0") ?? "",
  );

  const url = useMemo(() => {
    setWhatSearch(sParams.get("word0") ?? "");
    //    setPage((sParams.get("page") as unknown as number) ?? 1);
    sParams.set("page", String(Page));
    //    console.log(sParams.toString());
    return `${API_URL}/todo-search?${sParams.toString()}`;
  }, [srch_params.get("word0"), Page]);

  //console.log(url);

  const { data, isSuccess, isLoading, isError, error } = useQuery({
    queryKey: ["search", sParams.toString(), Page],
    queryFn: async () => {
      return await fetchGet<{
        data: TTblData | TErrorSearchData | null;
        meta: TPageMeta;
      }>(url);
    },
    placeholderData: keepPreviousData,
  });

  if (isLoading) {
    return <Loading />;
  }

  //console.log(data);

  if (isError || data === null || (!!data && "error" in data)) {
    //const msg = (data as unknown as TErrorSearchData).message;
    return (
      <>
        <WhatSearch paramWhatSearch={whatSearch} />
        <div className="p-2 w-fit mx-auto mt-5">Ошибка получения данных.</div>
        <div>{error?.message}</div>
      </>
    );
  }

  if (
    isSuccess &&
    data !== null &&
    Array.isArray(data?.data) &&
    data?.data.length < 1
  ) {
    return (
      <div className="mt-1 p-2 w-fit mx-auto">
        <WhatSearch paramWhatSearch={whatSearch} />
        <h3 className=" mt-5 font-bold text-sky-700 dark:text-sky-400">
          Данные не найдены
        </h3>
      </div>
    );
  }
  return (
    <>
      <WhatSearch paramWhatSearch={whatSearch} />
      <SearchedTable
        paramHead={{
          title: "Наименование",
          isCompleted: "Статус",
          updated: "На дату",
        }}
        paramData={data?.data as TTblData}
        paramMeta={data?.meta as TPageMeta}
      />
    </>
  );
}
