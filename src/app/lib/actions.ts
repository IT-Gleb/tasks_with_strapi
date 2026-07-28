"use server";
//Server actions

import { cookies } from "next/headers";

//Установить куку с токеном для manager
export async function setAuthCookie(token: string) {
  "use server";
  const cookiesList = await cookies();
  const expiresDate = new Date();
  expiresDate.setHours(expiresDate.getHours() + 8);

  if (!cookiesList.has("auth_token")) {
    cookiesList.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 8,
      path: "/",
      expires: expiresDate,
    });
  }
}
