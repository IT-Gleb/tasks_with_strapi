"use client";

import { Loader2 } from "lucide-react";
import { JSX } from "react";

function Loading(): JSX.Element {
  return (
    <div className=" p-2 w-fit mx-auto">
      <Loader2
        size={96}
        color="currentColor"
        strokeWidth={2}
        className="animate-spin"
      />
    </div>
  );
}

export default Loading;
