import { TDateISOString, TDateTimeISOString } from "../types/main_types";

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
    urlParam.append("limit", "20");
    // res
    //   .filter((item) => item.trim().length > 2)
    //   .map((item,index) => urlParam.append(`word${index+1}`, item));

    return urlParam.toString();
  }
  return "";
}
