"use client";

import { Typography } from "@heroui/react";
import { Info } from "lucide-react";
import { memo } from "react";

const TitleComponent = memo(
  ({ title, className = "" }: { title: string; className?: string }) => {
    //console.log(className);

    return (
      <div
        className={`backDots min-h-12 place-content-center overflow-hidden relative`}
      >
        <div className="absolute inset-0 bg-linear-to-r from-0% from-transparent to-white dark:to-default to-60% ">
          <div
            className={`p-2 bg-linear-to-r from-0% ${className} to-transparent to-65% flex gap-x-3 items-center`}
          >
            <Info size={24} strokeWidth={2} />
            <Typography type="h3">{title}</Typography>
          </div>
        </div>
      </div>
    );
  },
);

export default TitleComponent;
