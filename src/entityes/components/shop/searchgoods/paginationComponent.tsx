"use client";

import { TPageMeta } from "@/shared/types/main_types";
import { Pagination } from "@heroui/react";
import { useMemo, useState } from "react";

function TablePagination({ paramMeta }: { paramMeta: TPageMeta }) {
  const [Page, setPage] = useState<number>(1);
  //const setPage = useSearchPage((state) => state.setPage);

  const Pages = useMemo(() => {
    const totalPages = paramMeta.pagination.pageCount as number;

    const getPageNumbers = () => {
      const pages: (number | "ellipsis")[] = [];

      pages.push(1);
      if (totalPages < 2) {
        return pages;
      }

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
        <span>Найдено: {paramMeta.pagination.total} продуктов </span>
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

        {Pages?.map((item, index) =>
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

export default TablePagination;
