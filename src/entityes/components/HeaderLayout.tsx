"use client";

import SearchTasks from "./search/SearchTasks";
import ThemeButton from "./ui/buttons/ThemeButton";
import GradientLine from "./ui/gradients/GradientLine";
import NavigationMain from "./ui/NavigationMain";

export default function HeaderLayout() {
  return (
    <header className="w-full px-1 xl:py-2 flex flex-col place-content-center">
      <div className="w-full xl:max-w-300 xl:mx-auto flex items-center gap-4 justify-between">
        <NavigationMain />
        <div className="w-fit ml-auto">
          <SearchTasks />
        </div>
        <div className="h-7 w-10 p-1 rounded-xl bg-stone-200 dark:bg-default-hover flex items-center transition-all duration-300">
          <span className="block scale-60 -ml-2 dark:ml-2">
            <ThemeButton />
          </span>
        </div>
      </div>
      <GradientLine />
    </header>
  );
}
