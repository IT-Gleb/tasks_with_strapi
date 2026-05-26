"use client";

import ThemeButton from "./ui/buttons/ThemeButton";
import GradientLine from "./ui/gradients/GradientLine";
import NavigationMain from "./ui/NavigationMain";

export default function HeaderLayout() {
  return (
    <header className="layout_header w-full p-2 xl:p-3 flex flex-col gap-1 ">
      <div className="flex items-center gap-4 justify-between ">
        <NavigationMain />
        <ThemeButton />
      </div>
      <div className="mt-2">
        <GradientLine />
      </div>
    </header>
  );
}
