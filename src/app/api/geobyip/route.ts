import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const bodyIp = await request.json();

  // console.log(bodyIp);
  let data: any = {};
  if (bodyIp.localIp === "127.0.0.1") {
    const res = await fetch(
      "http://ip-api.com/json/?fields=status,city,country&lang=ru",
      {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: "GET",
        signal: AbortSignal.timeout(5000),
      },
    );
    //console.log("---------", res);
    if (res.ok) {
      data = await res.json();
      //console.log("-----data------ ", data);
      if (data.status === "success") {
        return NextResponse.json({ country: data.country, city: data.city });
      }
    }
    return NextResponse.json({ country: "local", city: "local" });
  }

  return NextResponse.json({
    sity: "local",
    country: "local",
    region: "local",
    state: "local",
  });
}
