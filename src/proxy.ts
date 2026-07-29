//Проверить залогинен ли manager, если нет перенаправить на страницу логина

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();

  const token_data = request.cookies.get("auth_token")?.value ?? "";
  //console.log("token_data ---", token_data);

  const { pathname } = request.nextUrl;
  let cookieData: { token: string; expires: Date } = {
    token: "",
    expires: new Date(0),
  };
  let token: string = "";
  // if (token_data !== "") {
  //   console.log(JSON.parse(token_data));
  // }

  if (token_data !== "") {
    cookieData = JSON.parse(token_data);
    const nowDate = new Date();
    const expDate = cookieData.expires;
    // console.log("----------------", expDate.toLocaleString());

    if (expDate < nowDate) {
      cookieStore.delete("auth_token");
      return NextResponse.redirect(new URL("/auth", request.url));
    }
    token = cookieData.token;
  }
  // Выводим лог ТОЛЬКО при обращении к страницам, а не к API/картинкам
  // if (!pathname.startsWith("/_next") && !pathname.startsWith("/api")) {
  //   console.log(`--- [MIDDLEWARE] --- Путь: ${pathname} | Токен:`, token);
  // }
  // console.log(
  //   "--- MIDDLEWARE HIT --- URL:",
  //   request.nextUrl.pathname,
  //   "Token:",
  //   token,
  // );

  if (pathname.startsWith("/dashboard")) {
    if (token === "") {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/dashboard/:path*",
};
