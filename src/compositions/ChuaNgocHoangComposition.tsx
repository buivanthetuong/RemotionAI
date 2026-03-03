import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { pageTurn } from "../presentations/pageTurn";
import { loadFont } from "@remotion/google-fonts/Montserrat";

// ─── Load Fonts ───────────────────────────────────────────────────────────────
const { fontFamily: montserratFamily } = loadFont("normal", {
  weights: ["700", "800", "900"],
  subsets: ["latin", "vietnamese"],
});

// ─── Constants & Timings ──────────────────────────────────────────────────────
const ITEM_DURATION = 80; // 3 seconds at 30fps
const TRANSITION_DURATION = 40; // Longer duration for realistic page turn
const texts = ["chùa ngọc hoàng", "một danh lam", "tại tp HCM"];

// ─── Helper: eased spring progress ────────────────────────────────────────────
function kineticSlide(
  frame: number,
  fps: number,
  startFrame: number,
  durationFrames: number,
): number {
  return spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 28, stiffness: 120, mass: 0.8 },
    durationInFrames: durationFrames,
  });
}

// ─── Image Card Component ─────────────────────────────────────────────────────
const ImageCard: React.FC<{ progress: number; pushUpProgress: number }> = ({
  progress,
  pushUpProgress,
}) => {
  const scale = interpolate(progress, [0, 1], [0.8, 1]);
  const opacity = interpolate(progress, [0, 0.5], [0, 1]);
  const translateY = interpolate(pushUpProgress, [0, 1], [0, -160]);

  return (
    <div
      style={{
        width: 640,
        borderRadius: 24,
        overflow: "hidden",
        boxShadow: "0 30px 60px rgba(0,0,0,0.3)",
        opacity,
        transform: `scale(${scale}) translateY(${translateY}px)`,
        border: "4px solid white",
      }}
    >
      <Img
        src={staticFile("Ngochoang_001.png")}
        style={{ width: "100%", height: "auto", display: "block" }}
      />
    </div>
  );
};

// ─── Text Label Component ─────────────────────────────────────────────────────
const TextLabel: React.FC<{
  progress: number;
  text: string;
  hasImage: boolean;
}> = ({ progress, text, hasImage }) => {
  const opacity = interpolate(progress, [0, 0.4], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [40, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        fontFamily: montserratFamily,
        fontWeight: 900,
        fontSize: 72,
        textTransform: "uppercase",
        color: "#000",
        textAlign: "center",
        width: "100%",
        letterSpacing: "4px",
        marginTop: hasImage ? 20 : 0,
        textShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      {text}
    </div>
  );
};

// ─── Content Group Component ──────────────────────────────────────────────────
const ContentGroup: React.FC<{
  text: string;
  showImage?: boolean;
}> = ({ text, showImage = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Entrance (Image + Container)
  const entrance = kineticSlide(frame, fps, 0, 15);
  // 2. Push up image
  const pushUp = kineticSlide(frame, fps, 15, 15);
  // 3. Text appear - Start at 0 if no image, else 22
  const textProgress = kineticSlide(frame, fps, showImage ? 22 : 0, 18);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
      }}
    >
      {/* ── Background decoration ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle, #ffffff 0%, #ececec 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0) 100%)",
        }}
      />
      {/* ── Paper texture overlay ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.05) 2px,
            rgba(0,0,0,0.05) 4px
          )`,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        {showImage && <ImageCard progress={entrance} pushUpProgress={pushUp} />}
        <TextLabel progress={textProgress} text={text} hasImage={showImage} />
      </div>
    </AbsoluteFill>
  );
};

// ─── Main Composition ─────────────────────────────────────────────────────────
export const ChuaNgocHoangComposition: React.FC = () => {
  return (
    <TransitionSeries>
      {/* Intro: "ĐÂY LÀ" + Image */}
      <TransitionSeries.Sequence durationInFrames={ITEM_DURATION}>
        <ContentGroup text="đây là" showImage />
      </TransitionSeries.Sequence>

      {/* Subsequent 3 text sequences with page-turn transitions */}
      {texts.map((text, i) => (
        <React.Fragment key={i}>
          <TransitionSeries.Transition
            presentation={pageTurn({ direction: "from-right", perspective: 1600 })}
            timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
          />
          <TransitionSeries.Sequence durationInFrames={ITEM_DURATION}>
            <ContentGroup text={text} />
          </TransitionSeries.Sequence>
        </React.Fragment>
      ))}
    </TransitionSeries>
  );
};

export default ChuaNgocHoangComposition;
