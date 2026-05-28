export const API_URL = "http://localhost:1337/api";
export const MainPageSeo_Prefix = "MainPageSEO";
export const MainPageSEOPath = "page-seo";
export const DatePagePath = "todos?filters[updated][$containsi]=%1";
export const DatePage_Prefix = "todos-%1";
export const NewDateTodo = "/todos/%1/newTodo";
export const TodosMax =
  "todos?fields[0]=order&sort[0]=order:desc&pagination[limit]=1";
export const TodosMax_prefix = "todosMax";
export const TodoDatesPath =
  "todos?fields[0]=updated&filters[updated][$containsi]=%1&sort[0]=updated:desc&pagination[limit]=100";

export const TodosLast20_prefix= "todos-last-20";
export const TodosLast20= "todos?filters[updated][$between][0]=%1&filters[updated][$between][1]=%2&filters[isCompleted][$eq]=0&sort[0]=updated:asc&pagination[limit]=20"
