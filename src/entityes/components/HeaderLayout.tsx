"use client";

import ThemeButton from "./ui/buttons/ThemeButton";

export default function HeaderLayout() {
  return (
    <header className="layout_header p-2 xl:p-8 flex items-center gap-4 justify-between ">
      <span></span>
      <ThemeButton />
    </header>
  );
}
