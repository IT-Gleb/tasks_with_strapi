import getCacheQueryClient from "@/entityes/providers/getQueryCache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const geoData = await request.json();
  //console.log(geoData);

  const url = `https://nominatim.openstreetmap.org/reverse?lat=${geoData.latitude}&lon=${geoData.longitude}&format=json&accept-language=ru`;

  const query = getCacheQueryClient();
  const geoPos = await query.fetchQuery({
    queryKey: ["geoLocation"],
    queryFn: async () => {
      const req = await fetch(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "User-Agent": "MyGeocodingApp/ver1.0", // Требование Nominatim для идентификации приложения
        },
        method: "GET",
        signal: AbortSignal.timeout(8000),
      });
      if (req.ok) {
        return await req.json();
      }
      return null;
    },
    retry: true,
    retryDelay: 1000,
  });

  //console.log("---geoPos---", geoPos);

  // Пытаемся извлечь город из разных полей ответа
  if (geoPos) {
    const city =
      geoPos.address.city ||
      geoPos.address.town ||
      geoPos.address.village ||
      "Город не найден";
    const country = geoPos.address.country || "";
    const region = geoPos.address.region || "";
    const state = geoPos.address.state;
    return NextResponse.json({ country, region, state, city });
  }

  return NextResponse.json({
    country: "unknown",
    region: "unknown",
    state: "unknown",
    city: "unknown",
  });
}
