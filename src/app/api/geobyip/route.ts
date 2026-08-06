import { TGeoData } from "@/shared/types/main_types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const bodyIp = await request.json();

  // console.log(bodyIp);
  let data: Partial<TGeoData> & { query: string; status: "success" | "fail" } =
    {
      status: "fail",
      query: "",
    };
  const isLocal =
    bodyIp.localIp === "127.0.0.1" || bodyIp.localIp === "0.0.0.0";
  let url = isLocal
    ? "http://ip-api.com/json/?fields=status,city,country,query&lang=ru"
    : `http://ip-api.com/json/${bodyIp.localIp}?fields=status,city,country,query&lang=ru`;

  //console.log("IP - ", bodyIp.localIp);

  const res = await fetch(url, {
    headers: { "Content-Type": "application/json; charset=utf-8" },
    method: "GET",
    signal: AbortSignal.timeout(5000),
  });
  //console.log("---------", res);
  if (res.ok) {
    data = await res.json();
    //console.log("-----data------ ", data);
    if (data.status === "success") {
      return NextResponse.json({
        country: data.country,
        city: data.city,
        ip: data.query,
      });
    }
  }
  return NextResponse.json({
    country: "local",
    city: "local",
    ip: bodyIp.localIp,
  });
}
