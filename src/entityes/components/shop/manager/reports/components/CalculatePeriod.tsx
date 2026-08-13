"use client";

import { useReportsURLParamsContext } from "@/shared/hooks/custom/UseReportsParamsContext";
import { cn } from "@heroui/styles";
import { useMemo } from "react";

const CalculatePeriod = ({ className = "" }: { className: string }) => {
  const { period } = useReportsURLParamsContext();

  const strokePeriod = useMemo(() => {
    const start = new Date();
    const end: Date = new Date();

    const digit = period.split(" ")[0].trim();
    const data_date = period.split(" ")[1].trim();

    switch (data_date) {
      case "day":
      case "days":
        end.setDate(start.getDate() - Number(digit));
        break;
      case "week":
      case "weeks":
        end.setDate(start.getDate() - Number(digit) * 7);
        break;
      case "month":
      case "months":
        end.setDate(start.getDate() - Number(digit) * 31);
        break;
      case "year":
      case "years":
        end.setDate(start.getDate() - Number(digit) * 365);
        break;
    }

    return (
      Intl.DateTimeFormat("ru-RU", { dateStyle: "medium" }).format(end) +
      " - " +
      Intl.DateTimeFormat("ru-RU", { dateStyle: "medium" }).format(start)
    );
  }, [period]);

  return <div className={cn("", className)}>{strokePeriod}</div>;
};

export default CalculatePeriod;
