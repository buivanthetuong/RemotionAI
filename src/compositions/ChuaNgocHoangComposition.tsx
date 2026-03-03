import React from "react";
import {
  Easing,
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";

// ─── Load Fonts ───────────────────────────────────────────────────────────────
const { fontFamily: montserratFamily } = loadFont("normal", {
  weights: ["700", "800", "900"],
  subsets: ["latin", "vietnamese"],
});

// ─── Constants & Timings ──────────────────────────────────────────────────────
const ITEM_DURATION = 60; // 3 seconds at 30fps
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
  const { fps, width } = useVideoConfig();

  // 1. Entrance (Image + Container)
  const entrance = kineticSlide(frame, fps, 0, 15);
  // 2. Push up image
  const pushUp = kineticSlide(frame, fps, 15, 15);
  // 3. Text appear - Start at 0 if no image, else 22
  const textProgress = kineticSlide(frame, fps, showImage ? 22 : 0, 18);
  // 4. Exit slide left - Start earlier (frame 50) since duration is 60
  const exitProgress = kineticSlide(frame, fps, 50, 10);

  const exitTranslateX = interpolate(exitProgress, [0, 1], [0, -width]);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `translateX(${exitTranslateX}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
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
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // Background slow pan (VTV style)
  const bgTranslateX = interpolate(frame, [0, 12 * fps], [0, -150], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#fff",
      }}
    >
      {/* ── Background decoration ── */}
      <AbsoluteFill>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle, #ffffff 0%, #ececec 100%)",
            transform: `translateX(${bgTranslateX}px)`,
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
      </AbsoluteFill>

      {/* Intro: "ĐÂY LÀ" + Image */}
      <Sequence from={0} durationInFrames={ITEM_DURATION}>
        <ContentGroup text="đây là" showImage />
      </Sequence>

      {/* Subsequent 3 text sequences */}
      {texts.map((text, i) => (
        <Sequence
          key={i}
          from={(i + 1) * ITEM_DURATION}
          durationInFrames={ITEM_DURATION}
        >
          <ContentGroup text={text} />
        </Sequence>
      ))}
    </div>
  );
};

export default ChuaNgocHoangComposition;
