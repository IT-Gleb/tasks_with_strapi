"use client";

import { useIsMobile } from "@/shared/hooks/custom/UseIsMobile";
import { Typography } from "@heroui/react";
import { Info } from "lucide-react";
import { memo, useLayoutEffect, useState } from "react";

const TitleComponent = memo(
  ({ title, className = "" }: { title: string; className?: string }) => {
    //console.log(className);

    const isMobile = useIsMobile();
    const [isMounted, setIsMounted] = useState<boolean>(false);

    useLayoutEffect(() => {
      setIsMounted(true);

      return () => {
        setIsMounted(false);
      };
    }, []);

    if (!isMounted) {
      return null;
    }

    return (
      <div
        className={`backDots min-h-7 md:min-h-12 place-content-center overflow-hidden relative`}
      >
        <div className="absolute inset-0 bg-linear-to-r from-0% from-transparent to-white dark:to-default to-60% ">
          <div
            className={`p-1 lg:p-2 bg-linear-to-r from-0% ${className} to-transparent to-65% flex gap-x-1 lg:gap-x-3 items-center`}
          >
            <Info size={isMobile ? 14 : 24} strokeWidth={2} />
            <Typography
              type="h3"
              className="text-sm md:text-xl xl:text-2xl first-letter:uppercase"
            >
              {title}
            </Typography>
          </div>
        </div>
      </div>
    );
  },
);

export default TitleComponent;
