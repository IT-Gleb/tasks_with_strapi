import { Description, Link } from "@heroui/react";
import { ListCheck } from "lucide-react";
import BreadCrambs from "./BreadCrambs";

export default function NavigationMain() {
  return (
    <nav className="w-full xl:w-250 mx-auto flex flex-col gap-2 items-start">
      <div className="flex gap-1 items-end">
        <Link href="/" className="dark:text-stone-200">
          <ListCheck size={38} color="currentColor" strokeWidth={2} />
        </Link>
        <h4 className="text-xl font-semibold">Задачи</h4>
        <Description className="ml-2 pb-0.5 text-chocolate">
          ver. 1.0.0.1
        </Description>
      </div>
      <BreadCrambs />
    </nav>
  );
}
