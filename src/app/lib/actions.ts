"use server";
import getCacheQueryClient from "@/entityes/providers/getQueryCache";
import { TGeoData } from "@/shared/types/main_types";
import { GetServer_LOCAL_API } from "@/shared/utils/consts";
import * as z from "zod";
//Server actions

import { cookies, headers } from "next/headers";

const managerValidate = z.object({
  email: z
    .email({ message: "Не верный  e-mail" })
    .min(6, { message: "E-mail - минимум 6 символов." }),
  pass: z.coerce
    .string()
    .nonempty()
    .min(8, { message: "Минимум 8 символов" })
    .max(16, { message: "Максимум - 16 символов" }),
  age: z.string().trim().max(0, { message: "Поле не должно быть заполненным" }),
});

//Установить куку с токеном для manager
export async function setAuthCookie(token: string) {
  "use server";
  const cookiesList = await cookies();
  const expiresDate = new Date();
  expiresDate.setHours(expiresDate.getHours() + 8);
  const cookieData = {
    token: token,
    expires: expiresDate,
  };

  //if (!cookiesList.has("auth_token")) {
  cookiesList.set({
    name: "auth_token",
    value: JSON.stringify(cookieData),
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
    path: "/",
    expires: expiresDate,
  });
  //}
}

export async function getLocalIp(): Promise<TGeoData> {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  let localIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "0.0.0.0";
  localIp = localIp.replace("::ffff:", "");

  const query = getCacheQueryClient();
  const data: TGeoData = await query.fetchQuery({
    queryKey: ["geoFromIp", localIp],
    queryFn: async () => {
      const res = await fetch(GetServer_LOCAL_API() + "/geobyip", {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: "POST",
        signal: AbortSignal.timeout(5000),
        body: JSON.stringify({ localIp }),
      });
      if (res.ok) {
        return (await res.json()) as TGeoData;
      }
      return {
        state: "unknown",
        city: "unknown",
        country: "unknown",
        region: "unknown",
        ip: "unknown",
      };
    },
  });

  return data;
}

export async function handlerUserWithCookie(data: {
  email: string;
  pass: string;
  age: string;
}) {
  "use server";
  try {
    await managerValidate.parseAsync(data);
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      console.log(err.issues);

      return { status: "error" };
    }
  }

  const query = getCacheQueryClient();
  const url = GetServer_LOCAL_API() + "/checkuser";
  //console.log(url);

  const isToken = await query.fetchQuery({
    queryKey: ["manager", 1],
    queryFn: async () => {
      const res = await fetch(url, {
        headers: { "content-type": "application/json; charset=utf-8" },
        method: "POST",
        signal: AbortSignal.timeout(5000),
        body: JSON.stringify({ email: data.email, password: data.pass }),
        credentials: "include",
      });

      const result = await res.json();
      return result;
      //console.log(user);
    },
    staleTime: 10000,
  });
  //console.log(isToken);
  if (isToken.ok) {
    //cookiesList.getAll().map((i) => console.log(i.name, i.value));
    //console.log(isToken.ok, isToken.token);

    await setAuthCookie(isToken.token);
    return { status: "ok" };
  }
  return { status: "error" };
}
