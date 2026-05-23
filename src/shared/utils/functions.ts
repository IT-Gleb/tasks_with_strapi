import { TDateTimeISOString } from "../types/main_types";

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
