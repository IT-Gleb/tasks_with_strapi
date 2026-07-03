import { TDateISOString, TDateTimeISOString } from "../types/main_types";
import { LimitSearch } from "./consts";

export function FormatDateTime(param: number | string) {
  //console.log(param);
  const dt = new Date(param);

  const options = {
    dateStyle: "medium",
    timeZone: "Europe/Moscow",
    timeStyle: "short",
  } satisfies Intl.DateTimeFormatOptions;

  return Intl.DateTimeFormat("ru-RU", options).format(dt);
}

export function CheckIsTimeZoneString(param: string) {
  if (
    !/^[\d]{4}-[\d]{2}-[\d]{2}T[\d]{2}:[\d]{2}:[\d]{2}\.[\d]{3}Z$/.test(param)
  ) {
    throw new Error("Не верный формат даты/времени");
  }
  return param as TDateTimeISOString;
}

export function makeDateISOString(param: string): TDateISOString {
  if (!/^[\d]{4}-[\d]{2}-[\d]{2}$/.test(param)) {
    throw new Error("Не верный формат даты");
  }
  return param as TDateISOString;
}

export function makeDateISOStringFromObject(param: {
  year: number;
  month: number;
  day: number;
}): TDateISOString {
  const mn = param.month < 1 ? 1 : param.month;
  return makeDateISOString(
    `${param.year}-${mn < 10 ? "0" + mn : param.month}-${param.day < 10 ? "0" + param.day : param.day}`,
  );
}

export function makeDateISOStringFromNow() {
  const dt = new Date(Date.now());
  const year = dt.getUTCFullYear();
  const month = dt.getUTCMonth() + 1;
  const day = dt.getUTCDate();
  return makeDateISOStringFromObject({ year, month, day });
}

export function makeDateISOStringFromDate(param: Date) {
  const dt = new Date(param);

  const year = dt.getUTCFullYear();
  const month = dt.getUTCMonth() + 1;
  const day = dt.getUTCDate();
  return makeDateISOStringFromObject({ year, month, day });
}

export function firstLastMonthDayLastCurrentMonthDay(param: Date) {
  const dt = new Date(param);

  let year = dt.getFullYear();
  let month = dt.getUTCMonth();
  const first_Date = new Date(year, month, 1);
  const last_Date = new Date(year, month + 1, 1);
  //last_Date.setUTCHours(last_Date.getUTCHours()-1);

  year = first_Date.getUTCFullYear();
  month = first_Date.getMonth();
  let day = first_Date.getUTCDate();

  const firstDate = makeDateISOStringFromObject({ year, month, day });

  year = last_Date.getUTCFullYear();
  month = last_Date.getMonth();
  day = last_Date.getUTCDate();

  const currentDate = makeDateISOStringFromObject({ year, month, day });

  return {
    firstDate: firstDate,
    currentDate,
  };
}

export function extractMonthName(param: TDateISOString) {
  const nmMonths = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];
  const dt = new Date(param);
  const month = dt.getUTCMonth();

  return nmMonths[month];
}

export function ParamsFromString(param: string) {
  if (param.trim().length < 1) {
    return "";
  }

  const res = param.match(/[^\s.,!?:\`\~\&\-\[\]\(\)]+/gi);

  if (res?.length) {
    const urlParam = new URLSearchParams();
    let wordSearch = res.reduce((acc, val) => {
      acc += " " + val;
      return acc;
    }, "");

    urlParam.append("word0", wordSearch.trim());

    urlParam.append("page", "1");
    urlParam.append("limit", String(LimitSearch));
    // res
    //   .filter((item) => item.trim().length > 2)
    //   .map((item,index) => urlParam.append(`word${index+1}`, item));

    return urlParam.toString();
  }
  return "";
}

export function isObject(param: unknown) {
  let res: boolean = false;
  if (Array.isArray(param) || typeof param === "object") {
    res = true;
  }
  return res;
}

//Поиск в объекте поля с данными по имени поля
export function returnField(param: unknown, paramName: string): Object | null {
  if (!isObject(param) || param === null || typeof param === "undefined") {
    return null;
  }
  //Иницирую массив для поиска

  const newObj = param as Object;
  const keys = Object.keys(newObj);

  const dataParam: any[] = [];
  let found: Object | null = null;

  keys.forEach((item) => {
    if (isObject(newObj[item as keyof typeof newObj])) {
      if (paramName === item) {
        found = newObj[item as keyof typeof newObj];
      }
      dataParam.push(newObj[item as keyof typeof newObj]);
    }
  });
  if (found !== null) {
    return found;
  }

  //Сам поиск, ищется первое вхождение
  while (dataParam.length) {
    const obj = dataParam.shift();
    // const delete_key = dataParam.keys().next().value;

    //Если массив добавить данные в структуру поиска
    if (Array.isArray(obj)) {
      obj.forEach((item) => {
        if (isObject(item)) {
          dataParam.push(item);
        }
      });
    }
    //-------------------------------
    if (obj !== undefined && obj !== null) {
      for (const key of Object.keys(obj)) {
        //console.log(key);
        //Если массив или объект
        if (isObject(obj[key as keyof typeof obj])) {
          if (key === paramName) {
            found = obj[key as keyof typeof obj];
            break;
          }
          if (Array.isArray(obj[key as keyof typeof obj])) {
            obj[key as keyof typeof obj].forEach((itm: any) => {
              if (isObject(itm)) {
                dataParam.push(itm);
              }
            });
          } else {
            dataParam.push(obj[key as keyof typeof obj]);
          }
        }
      }
    }
    // dataParam.delete(delete_key);
  }
  return found;
}
