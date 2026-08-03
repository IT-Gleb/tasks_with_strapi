"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const GetCity = () => {
  const [currPosition, setCurrPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [geoLoading, setGeoLoading] = useState<boolean>(false);

  if (!("navigator" in window)) {
    return null;
  }
  if (!("geolocation" in navigator)) {
    return null;
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["geoLocation", 1],
    queryFn: async () => {
      const req = await fetch("/api/geodata", {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: "POST",
        body: JSON.stringify(currPosition),
        signal: AbortSignal.timeout(9000),
      });
      if (req.ok) {
        return await req.json();
      }
      return {
        country: "unknown",
        region: "unknown",
        state: "unknown",
        city: "unknown",
      };
    },
    enabled: currPosition !== null,
  });

  useEffect(() => {
    let isWork: boolean = true;
    setGeoLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (isWork) {
          setCurrPosition({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setGeoLoading(false);
        }
      },
      () => {
        setCurrPosition(null);
        console.log("error geo");
        setGeoLoading(false);
      },
      {
        enableHighAccuracy: true, // Включить точный GPS (если доступен)
        timeout: 10000, // Макс. время ожидания (мс)
        maximumAge: 0, // Не использовать кэш
      },
    );

    return () => {
      isWork = false;
    };
  }, []);

  //console.log(currPosition);
  if (isLoading || geoLoading) {
    return (
      <div className="w-fit mx-auto">
        <Loader2 size={32} className=" animate-spin" />
      </div>
    );
  }

  if (error) {
    return <span>{(error as Error).message}</span>;
  }
  //console.log(data);
  if (
    !data ||
    (data && data["country"] === "unknown") ||
    currPosition === null
  ) {
    return null;
  }

  return (
    <div
      suppressHydrationWarning
      title="Ваше местоположение"
      className="mt-2 flex flex-col items-start text-xs p-1 pt-3 relative before:content-[attr(title)] before:absolute before:left-2 before:-top-2.5 before:text-xs before:p-1 before:text-indigo-400 "
    >
      <span>Страна: {data?.country}</span>
      <span>Округ: {data?.region}</span>
      <span>Регион: {data?.state}</span>
      <span>
        Город: <span className=" font-semibold uppercase">{data?.city}</span>
      </span>
    </div>
  );
};

export default GetCity;
