"use client";

import ThemeButton from "./ui/buttons/ThemeButton";
import NavigationMain from "./ui/NavigationMain";

export default function HeaderLayout() {
  return (
    <header className="layout_header p-2 xl:p-8 flex items-center gap-4 justify-between ">
      <NavigationMain />
      <ThemeButton />
    </header>
  );
}
