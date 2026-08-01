"use client";

import { usePaginationContext } from "@/shared/hooks/custom/UsePaginationContext";
import type { TPageMeta } from "@/shared/types/main_types";
import { Pagination } from "@heroui/react";
import { useState } from "react";

const PaginationOrdersTable = ({ paramMeta }: { paramMeta: TPageMeta }) => {
  const { currentPage, handlerPage } = usePaginationContext();
  const [page, setPage] = useState(currentPage);

  const totalPages = paramMeta.pagination.pageCount as number;

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];

    pages.push(1);

    if (page > 3) {
      pages.push("ellipsis");
    }

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (page < totalPages - 2) {
      pages.push("ellipsis");
    }

    totalPages > 1 ? pages.push(totalPages) : 0;

    return pages;
  };

  //console.log(totalPages, paramMeta.pagination);

  return (
    <div className="w-full max-w-80 mx-auto p-1">
      <Pagination size="sm">
        <Pagination.Content>
          <Pagination.Item>
            <Pagination.Previous
              isDisabled={page === 1}
              onPress={() => {
                setPage((p) => p - 1);
                handlerPage(page - 1);
              }}
            >
              <Pagination.PreviousIcon />
              <span>Предыдущая</span>
            </Pagination.Previous>
          </Pagination.Item>

          {getPageNumbers().map((p, i) =>
            p === "ellipsis" ? (
              <Pagination.Item key={`ellipsis-${i}`}>
                <Pagination.Ellipsis />
              </Pagination.Item>
            ) : (
              <Pagination.Item key={p + i}>
                <Pagination.Link
                  isActive={p === page}
                  onPress={() => {
                    handlerPage(p);
                    setPage(p);
                  }}
                >
                  {p}
                </Pagination.Link>
              </Pagination.Item>
            ),
          )}

          <Pagination.Item>
            <Pagination.Next
              isDisabled={page === totalPages}
              onPress={() => {
                setPage((p) => p + 1);
                handlerPage(page + 1);
              }}
            >
              <span>Следующая</span>
              <Pagination.NextIcon />
            </Pagination.Next>
          </Pagination.Item>
        </Pagination.Content>
      </Pagination>
    </div>
  );
};

export default PaginationOrdersTable;
