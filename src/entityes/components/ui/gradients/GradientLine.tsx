import { FC } from "react";

const GradientLine: FC = () => {
  return (
    <div className="inline-block h-0.5 min-w-70 w-full bg-linear-to-r from-0% from-slate-600 xl:from-10% xl:from-transparent via-slate-500 dark:via-stone-200 to-90% to-transparent"></div>
  );
};

export default GradientLine;
