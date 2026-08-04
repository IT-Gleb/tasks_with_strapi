"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
//import GetCity from "./GetCity";

const GetCityDyn = dynamic(() => import("./GetCity"), { ssr: false });

const InfoArea = ({
  paramIpData,
}: {
  paramIpData: {
    country: string;
    city: string;
    region?: string;
    state?: string;
  };
}) => {
  const [isGeoData] = useState<boolean>(
    paramIpData.city !== "local" && paramIpData.city !== "unknown",
  );
  return (
    <div className="w-full lg:max-w-120 min-h-20 mx-auto p-1 place-content-center">
      {isGeoData && (
        <div className="p-1 flex flex-col gap-1 text-xs">
          <span>Страна: {paramIpData.country}</span>
          <span>
            Город:{" "}
            <span className=" font-semibold uppercase text-sm">
              {paramIpData.city}
            </span>
          </span>
        </div>
      )}

      {!isGeoData && <GetCityDyn />}
    </div>
  );
};

export default InfoArea;
