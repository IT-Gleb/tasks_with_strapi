"use client";

import { Loader2 } from "lucide-react";
import { JSX } from "react";

type Tdirection = "fromcenter" | "fromstart";

function Loading({ from = "fromcenter" }: { from?: Tdirection }): JSX.Element {
  return (
    <div className={`w-fit mx-auto ${from} text-default dark:text-slate-400`}>
      <Loader2 size={68} className=" animate-spin" />
    </div>
  );
}

export default Loading;
