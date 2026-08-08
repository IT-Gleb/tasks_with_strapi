"use client";

import { getLocalIp } from "@/app/lib/actions";
import { TGeoData } from "@/shared/types/main_types";
//import dynamic from "next/dynamic";
import { useLayoutEffect, useState } from "react";
import SearchOrderInput from "./SearchOrderComponent";
//import GetCity from "./GetCity";

//const GetCityDyn = dynamic(() => import("./GetCity"), { ssr: false });

const InfoArea = () => {
  const [isGeoData, setIsGeoData] = useState<boolean>(false);
  const [geoData, setGeoData] = useState<TGeoData | null>(null);

  useLayoutEffect(() => {
    let isWork: boolean = true;
    (async function checkIp() {
      const ipData = await getLocalIp();
      if (ipData.country !== "local" || ipData.city !== "local") {
        if (isWork) {
          setIsGeoData(true);
          setGeoData(ipData);
        }
      }
    })();
    return () => {
      isWork = false;
    };
  }, []);

  return (
    <div className="w-full min-h-20 mx-auto p-2 place-content-center flex gap-2 items-center justify-between">
      {isGeoData && (
        <div className="p-1 flex flex-col gap-1 text-xs">
          <span>IP: {geoData?.ip}</span>
          <span>Страна: {geoData?.country}</span>
          <span>
            Город:{" "}
            <span className=" font-semibold uppercase text-sm">
              {geoData?.city}
            </span>
          </span>
        </div>
      )}

      <SearchOrderInput />

      {/* {!isGeoData && <GetCityDyn />} */}
    </div>
  );
};

export default InfoArea;
