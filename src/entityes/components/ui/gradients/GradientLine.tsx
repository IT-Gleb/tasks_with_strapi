import { FC } from "react";

const GradientLine: FC = () => {
  return (
    <span className="block h-1 min-w-100 w-full bg-linear-to-r from-0% from-slate-600/70 xl:from-10% xl:from-transparent via-slate-500/50 dark:via-stone-200/50 to-90% to-transparent"></span>
  );
};

export default GradientLine;
