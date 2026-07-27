//Проверить залогинен ли manager, если нет перенаправить на страницу логина

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

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
    if (!token) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/dashboard/:path*",
};
