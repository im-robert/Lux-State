"use client";

import dynamic from "next/dynamic";

export const PropertyMapDynamic = dynamic(
  () => import("./PropertyMap").then((mod) => mod.PropertyMap),
  { ssr: false, loading: () => <div className="w-full aspect-[4/3] bg-slate-100 animate-pulse rounded-lg flex items-center justify-center"><span className="material-icons text-mosque/50">map</span></div> }
);
