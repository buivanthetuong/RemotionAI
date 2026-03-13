import React from "react";
import { Composition } from "remotion";
import { MyComposition } from "./compositions/Composition";
import { VTVcabKhampha } from "./compositions/VTVcabKhamphaComposition";
import { TikTokHookTemplate } from "./compositions/TikTokHookComposition";
import { ChuaNgocHoangComposition } from "./compositions/CHUA_NGOC_HOANG/ChuaNgocHoangComposition";
import { ChuaNgocHoangComposition1 } from "./compositions/CHUA_NGOC_HOANG/ChuaNgocHoangComposition1";
import ChuaNgocHoangComposition2 from "./compositions/CHUA_NGOC_HOANG/ChuaNgocHoangComposition2";
import ChuaNgocHoangCompositiondatvao from "./compositions/CHUA_NGOC_HOANG/ChuaNgocHoangCompositiondatvao";
import NoiNayCoAnhComposition, {
  RAW_LYRICS_LINES,
} from "./compositions/NoiNayCoAnh/NoiNayCoAnhComposition";
import { getAudioDurationsAndFrames } from "./ultis/audioUtils";
import { ImageBlastComposition } from "./compositions/ImageBlastComposition";

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
        durationInFrames={270}
        fps={30}
        width={1080}
        height={1920}
      />

      <Composition
        id="chuangochoang1"
        component={ChuaNgocHoangComposition1}
        durationInFrames={270}
        fps={30}
        width={1080}
        height={1920}
      />

      <Composition
        id="chuangochoang2"
        component={ChuaNgocHoangComposition2}
        durationInFrames={270}
        fps={30}
        width={1080}
        height={1920}
      />

      <Composition
        id="chuangochoangdatvao"
        component={ChuaNgocHoangCompositiondatvao}
        durationInFrames={270}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Nơi Này Có Anh — Music Lyric Video TikTok (10 giây, 1080×1920) */}
      <Composition
        id="NoiNayCoAnh"
        component={NoiNayCoAnhComposition}
        calculateMetadata={async ({ props }) => {
          const { items, totalFrames } = await getAudioDurationsAndFrames(
            props.lyricsLines,
            30,
          );
          const finalDuration = totalFrames + 30; // +30 buffered
          return {
            durationInFrames: finalDuration,
            props: {
              ...props,
              lyricsLines: items,
              durationFrames: finalDuration,
            },
          };
        }}
        defaultProps={{
          lyricsLines: RAW_LYRICS_LINES,
          durationFrames: 300,
        }}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Image Blast — 4 ảnh đập tuần tự + text reveal (5 giây) */}
      <Composition
        id="ImageBlast"
        component={ImageBlastComposition}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
