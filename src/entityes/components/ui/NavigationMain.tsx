import { Description, Link } from "@heroui/react";
import { ListCheck, ShoppingBag } from "lucide-react";
import BreadCrambs from "./BreadCrambs";

export default function NavigationMain({
  className = "",
}: {
  className?: string;
}) {
  return (
    <nav
      className={`w-full xl:w-250 mx-auto flex flex-col gap-2 items-start ${className}`}
    >
      <div role="presentation" className="flex flex-row gap-x-3 items-center">
        <Link
          href="/shop"
          className="dark:text-stone-200 flex gap-1 items-end hover:underline-offset-8"
        >
          <ShoppingBag size={38} color="currentColor" strokeWidth={2} />
          <span className="hidden md:inline-block text-xl font-semibold">
            Магазин
          </span>
          <Description className="hidden lg:inline-block ml-2 pb-1 text-chocolate">
            ver. 1.0.0.1
          </Description>
        </Link>

        <Link
          href="/"
          className="dark:text-stone-200 flex gap-1 items-end hover:underline-offset-8"
        >
          <ListCheck size={38} color="currentColor" strokeWidth={2} />
          <span className="hidden md:inline-block text-xl font-semibold">
            Задачи
          </span>
          <Description className="hidden lg:inline-block ml-2 pb-1 text-chocolate">
            ver. 1.0.0.1
          </Description>
        </Link>
      </div>
      <BreadCrambs />
    </nav>
  );
}
