"use server";
import getCacheQueryClient from "@/entityes/providers/getQueryCache";
import { TGeoData } from "@/shared/types/main_types";
import { SERVER_LOCAL_API } from "@/shared/utils/consts";
//Server actions

import { cookies, headers } from "next/headers";

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
      const res = await fetch(SERVER_LOCAL_API + "/geobyip", {
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
