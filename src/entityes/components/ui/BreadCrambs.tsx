"use client";
import { Breadcrumbs, BreadcrumbsItem } from "@heroui/react";
import { FC, ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";
import { Check, Home, List, ListEnd } from "lucide-react";

type TBreadCrambsProps = {
  path: string;
  title: string;
  Icon?: ReactNode;
}[];

const BreadCrambs: FC = () => {
  const pathname = usePathname();

  // console.log(pathname, pathname.split("/"));
  const Items = useMemo(() => {
    const tmp: TBreadCrambsProps = [];
    if (pathname === "/") {
      tmp[0] = { path: "/", title: "Главная", Icon: <Home size={14} /> };
      return tmp;
    }
    pathname.split("/").map((item) => {
      switch (item) {
        case "":
          tmp[0] = { title: "Главная", path: "/", Icon: <Home size={14} /> };
          break;
        case "todos":
          tmp.push({ title: "Задачи", path: "", Icon: <List size={14} /> });
          break;
        case "newTodo":
          tmp.push({
            title: "Новая задача",
            path: "/todos/newTodo",
            Icon: <ListEnd size={14} />,
          });
          break;
        default:
          tmp.push({ title: item, path: `/todos/${item}` });
          break;
      }
    });

    if (tmp.length > 1) {
      tmp[tmp.length - 1].Icon = <Check size={14} />;
    }
    return tmp;
  }, [pathname]);

  return (
    <Breadcrumbs>
      {Items.map((item) => {
        return (
          <BreadcrumbsItem
            key={item.path}
            href={item.path}
            className="last:font-bold last:border-b-2 last:border-b-default-foreground flex gap-x-1 items-center"
          >
            {!!item.Icon && item.Icon}
            <span className="ml-1">{item.title}</span>
          </BreadcrumbsItem>
        );
      })}
    </Breadcrumbs>
  );
};

export default BreadCrambs;
