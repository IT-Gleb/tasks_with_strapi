import { API_URL } from "@/shared/utils/consts";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const tokenData = cookieStore.get("auth_token")?.value ?? null;
  let token = "";
  if (tokenData !== null) {
    token = JSON.parse(tokenData).token ?? "";
  }

  //console.log("---totken----", token);
  if (token === "") {
    return NextResponse.json({ message: "Нужно авторизоваться!" });
  }

  const urls = [
    `${API_URL}/orders?pagination[pageSize]=1&pagination[page]=1`,
    `${API_URL}/orders?filters[s_status][$notIn][0]=success&filters[s_status][$notIn][1]=cancelled&pagination[pageSize]=1&pagination[page]=1`,
    `${API_URL}/orders?filters[s_status][$eq]=success&pagination[pageSize]=1&pagination[page]=1`,
    `${API_URL}/orders?filters[s_status][$eq]=cancelled&pagination[pageSize]=1&pagination[page]=1`,
  ];
  const getUrls = urls.map((url) =>
    fetch(url, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${token}`,
      },

      method: "GET",
      signal: AbortSignal.timeout(5000),
    }).then((data) => data.json()),
  );

  const resObj = { total: 0, inWork: 0, cancelled: 0, successed: 0 };

  const res = await Promise.allSettled(getUrls).then((data) => {
    data.forEach((item, index) => {
      if (item.status === "fulfilled") {
        const data = item.value;
        switch (index) {
          case 0:
            resObj.total = data.meta.pagination.total;
            break;
          case 1:
            resObj.inWork = data.meta.pagination.total;
            break;
          case 2:
            resObj.successed = data.meta.pagination.total;
            break;
          case 3:
            resObj.cancelled = data.meta.pagination.total;
            break;
        }

        //console.log(data.meta.pagination.total);
      }
    });
  });

  return NextResponse.json(resObj);
}
