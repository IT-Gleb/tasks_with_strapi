"use client";

import { ProgressBar } from "@heroui/react";
//import { Loader2 } from "lucide-react";
import { JSX } from "react";

function Loading(): JSX.Element {
  return (
    <ProgressBar
      isIndeterminate
      aria-label="Loading"
      className="w-64"
      color="default"
    >
      {/* <Label>Загружаю данные...</Label> */}
      <ProgressBar.Track>
        <ProgressBar.Fill />
      </ProgressBar.Track>
    </ProgressBar>
  );
}

export default Loading;
