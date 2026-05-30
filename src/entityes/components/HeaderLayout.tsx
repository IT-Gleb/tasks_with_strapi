"use client";

import ThemeButton from "./ui/buttons/ThemeButton";
import GradientLine from "./ui/gradients/GradientLine";
import NavigationMain from "./ui/NavigationMain";

export default function HeaderLayout() {
  return (
    <header className="layout_header w-full py-2 pr-1 xl:py-3 flex flex-col gap-1 ">
      <div className="flex items-center gap-4 justify-between ">
        <NavigationMain />
        <div className="h-7 w-10 p-1 rounded-xl bg-stone-200 dark:bg-default-hover flex items-center transition-all duration-300">
          <span className="block scale-60 -ml-2 dark:ml-2">
            <ThemeButton />
          </span>
        </div>
      </div>
      <div className="mt-2">
        <GradientLine />
      </div>
    </header>
  );
}
