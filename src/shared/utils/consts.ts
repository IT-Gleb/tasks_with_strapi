export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
export const MainPageSeo_Prefix = "MainPageSEO";
export const MainPageSEOPath = "page-seo";
export const DatePagePath =
  "todos?filters[updated][$containsi]=%1&sort[0]=createdAt:asc&pagination[page]=%2&pagination[pageSize]=15";
export const DatePagePath_Max200 =
  "todos?filters[updated][$containsi]=%1&pagination[limit]=300";
export const DatePage_Prefix = "todos-%1";
export const NewDateTodo = "/todos/%1/newTodo";
export const TodosMax =
  "todos?fields[0]=order&sort[0]=order:desc&pagination[limit]=1";
export const TodosMax_prefix = "todosMax";
export const TodoDatesPath =
  "todos?fields[0]=updated&filters[updated][$containsi]=%1&sort[0]=updated:desc&pagination[limit]=300";

export const TodosLast20_prefix = "todos-last-20";
export const TodosLast20 =
  "todos?filters[updated][$between][0]=%1&filters[updated][$between][1]=%2&filters[isCompleted][$eq]=0&sort[0]=updated:asc&pagination[limit]=20";

export const LimitSearch = 15;

//Магазин
const mainPageCategory =
  "main-page-shop?populate[GoodsZone][on][goods.goods-category][populate][CategoryComp][populate][good][populate][picture][populate]";

export const backgroundsLight: string[] = [
  "bg-rose-300/50",
  "bg-green-300/50",
  "bg-amber-300/50",
  "bg-blue-300/50",
  "bg-slate-300/50",
  "bg-mist-300/50",
];
export const backgroundsDark: string[] = [
  "bg-rose-800/50",
  "bg-green-800/50",
  "bg-amber-800/50",
  "bg-blue-800/50",
  "bg-slate-800/50",
  "bg-mist-800/50",
];

export const bgGradients: { light: string; dark: string }[] = [
  { light: "from-rose-200/50", dark: "from-rose-900/50" },
  { light: "from-green-200/50", dark: "from-green-900/50" },
  { light: "from-amber-200/50", dark: "from-amber-900/50" },
  { light: "from-blue-200/50", dark: "from-blue-900/50" },
  { light: "from-slate-200/50", dark: "from-slate-900/50" },
  { light: "from-yellow-200/50", dark: "from-yellow-900/50" },
];
