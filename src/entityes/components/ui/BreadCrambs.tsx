"use client";
import { Breadcrumbs, BreadcrumbsItem } from "@heroui/react";
import { FC, ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  Check,
  Database,
  Home,
  List,
  ListCheck,
  ListEnd,
  ListOrdered,
  Repeat,
  SearchCheck,
  ShoppingBag,
  User2,
} from "lucide-react";
import { managerInitRequest } from "@/shared/utils/consts";
import { getRandomId } from "@/shared/utils/functions";

type TBreadCrambsProps = {
  id: string;
  path?: string;
  title: string;
  Icon?: ReactNode;
}[];

const BreadCrambs: FC = () => {
  const pathname = usePathname();

  // console.log(pathname, pathname.split("/"));
  const Items = useMemo(() => {
    const tmp: TBreadCrambsProps = [];
    if (pathname === "/") {
      tmp[0] = {
        id: getRandomId(),
        path: "/",
        title: "Главная",
        Icon: <Home size={14} />,
      };
      return tmp;
    }
    pathname.split("/").map((item) => {
      switch (item) {
        case "":
          tmp[0] = {
            id: getRandomId(),
            title: "Главная",
            path: "/",
            Icon: <Home size={14} />,
          };
          break;
        case "auth":
          tmp.push({
            id: getRandomId(),
            title: "Авторизация",
            Icon: <User2 size={14} />,
          });
          tmp.push({
            id: getRandomId(),
            title: "Проверка",
            Icon: <User2 size={14} />,
          });
          break;
        case "todos":
          tmp.push({
            id: getRandomId(),
            title: "Задачи",
            Icon: <List size={14} />,
          });
          break;
        case "newTodo":
          tmp.push({
            id: getRandomId(),
            title: "Новая задача",

            Icon: <ListEnd size={14} />,
          });
          break;
        case "search":
          tmp.push({
            id: getRandomId(),
            title: "Поиск",

            Icon: <SearchCheck size={14} />,
          });
          tmp.push({
            id: getRandomId(),
            title: "Задачи",

            Icon: <SearchCheck size={14} />,
          });
          break;
        case "task":
          tmp.push({
            id: getRandomId(),
            title: "Задачи",
            Icon: <List size={14} />,
          });
          tmp.push({
            id: getRandomId(),
            title: "Dashboard",
            Icon: <List size={14} />,
          });
          break;
        case "shop":
          tmp.push({
            id: getRandomId(),
            title: "Магазин",
            Icon: <ShoppingBag size={14} />,
          });
          tmp.push({
            id: getRandomId(),
            title: "Витрина",
            Icon: <ShoppingBag size={14} />,
          });
          break;
        case "dashboard":
          tmp.push({
            id: getRandomId(),
            title: "Управление",
            Icon: <ListOrdered size={14} />,
          });
          tmp.push({
            id: getRandomId(),
            title: "Отчеты",
            path: "/reports",
            Icon: <Database size={14} />,
          });
          tmp.push({
            id: getRandomId(),
            title: "Заказы",
            Icon: <Database size={14} />,
          });
          break;
        case "reports":
          tmp.push({
            id: getRandomId(),
            title: "Управление",
            Icon: <ListOrdered size={14} />,
          });
          tmp.push({
            id: getRandomId(),
            title: "Заказы",
            path: managerInitRequest,
            Icon: <Database size={14} />,
          });
          tmp.push({
            id: getRandomId(),
            title: "Отчеты",
            Icon: <Repeat size={14} />,
          });
          break;
        default:
          tmp.push({
            id: getRandomId(),
            title: item,
            path: `/todos/${item}`,
            Icon: <ListCheck size={14} />,
          });
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
        return item.path !== undefined ? (
          <BreadcrumbsItem
            key={item.id}
            href={item.path}
            className="last:font-bold last:border-b-2 last:border-b-default-foreground flex gap-x-1 items-center"
          >
            {!!item.Icon && item.Icon}
            <span className="ml-1">{item.title}</span>
          </BreadcrumbsItem>
        ) : (
          <BreadcrumbsItem
            key={item.id}
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
