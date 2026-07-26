"use client";

import SearchTasks from "./search/SearchTasks";
import ManagerButton from "./ui/buttons/ManagerButton";
import ThemeButton from "./ui/buttons/ThemeButton";
import GradientLine from "./ui/gradients/GradientLine";
import NavigationMain from "./ui/NavigationMain";

export default function HeaderLayout() {
  return (
    <header className="w-full h-(--minHeaderH) px-1 xl:py-2 bg-default dark:bg-slate-900 flex flex-col">
      <div className="w-full xl:max-w-240 xl:mx-auto flex items-center gap-4 justify-between flex-1">
        <NavigationMain />

        <div className="w-fit lg:ml-auto">
          <SearchTasks />
        </div>

        <ManagerButton />
        <div className="h-7 w-10 p-1 rounded-xl bg-stone-200 dark:bg-default-hover flex items-center transition-all duration-300">
          <span className="block scale-60 -ml-2 dark:ml-2">
            <ThemeButton />
          </span>
        </div>
      </div>

      <div className="w-full ">
        <GradientLine />
      </div>
    </header>
  );
}
