import React from "react";
import { Composition } from "remotion";
import { MyComposition } from "./compositions/Composition";
import { VTVcabKhampha } from "./compositions/VTVcabKhamphaComposition";
import { TikTokHookTemplate } from "./compositions/TikTokHookComposition";
import { ChuaNgocHoangComposition } from "./compositions/ChuaNgocHoangComposition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Original composition — kept as-is */}
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={210}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* VTVcab Khám Phá — Kinetic Slide composition (5 giây) */}
      <Composition
        id="VTVcabKhampha"
        component={VTVcabKhampha}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* TikTok Hook Template — Top 5 Most Downloaded Videos (4 giây) */}
      <Composition
        id="TikTokHook"
        component={TikTokHookTemplate}
        durationInFrames={120}
        fps={30}
        width={1080}
        height={1920}
      />

      <Composition
        id="chuangochoang"
        component={ChuaNgocHoangComposition}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
