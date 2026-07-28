//Проверить пользователя - manager и установить cookies

import { API_URL } from "@/shared/utils/consts";
import { NextResponse } from "next/server";

type TUserWithJWT = {
  jwt: string;
  user: {
    username: string;
    email: string;
  };
};
// Принудительно отключаем кэширование роута
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let manager: Partial<TUserWithJWT> = {};
  const url = `${API_URL}/auth/local`;

  const res = await fetch(url, {
    headers: { "Content-Type": "application/json; charset=utf-8" },
    method: "POST",
    signal: AbortSignal.timeout(5000),
    body: JSON.stringify({
      identifier: "manager@test.ru",
      password: "Test12345",
    }),
    credentials: "include",
  });

  try {
    manager = await res.json();
    // const cookieStore = await cookies();
    // cookieStore.set({
    //   name: "auth_token",
    //   value: manager.jwt as string,
    //   httpOnly: true,
    //   path: "/",
    //   sameSite: "lax",
    //   secure: false,
    //   maxAge: 60 * 60 * 8,
    // });

    //const cookielist = await cookies();
    //console.log("FROM CHECKUSER --- ", cookielist.get("auth_token"));

    // cookielist.getAll().map((i) => console.log(i.name, i.value));
    const myResponse = NextResponse.json({
      ok: true,
      token: manager.jwt as string,
    });
    const expiresDate = new Date();
    expiresDate.setHours(expiresDate.getHours() + 8);

    myResponse.cookies.set({
      name: "auth_token",
      value: manager.jwt as string,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: false,
      maxAge: 60 * 60 * 8,
      expires: expiresDate,
    });

    return myResponse;
  } catch (err: unknown) {
    console.log((err as Error).message);
    return NextResponse.json({ ok: false, token: null });
  }
}
