import React from "react";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { VTVcabKhampha } from "./VTVcabKhamphaComposition";

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
    </>
  );
};
