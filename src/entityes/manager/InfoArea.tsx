"use client";

import dynamic from "next/dynamic";
//import GetCity from "./GetCity";

const GetCityDyn = dynamic(() => import("./GetCity"), { ssr: false });

const InfoArea = () => {
  return (
    <div className="w-full lg:max-w-120 min-h-20 mx-auto p-1 place-content-center">
      <GetCityDyn />
    </div>
  );
};

export default InfoArea;
