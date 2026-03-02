import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";

// ─── Load Fonts ───────────────────────────────────────────────────────────────
const { fontFamily: montserratFamily } = loadFont("normal", {
  weights: ["700", "800", "900"],
  subsets: ["latin", "vietnamese"],
});

// ─── Helper: eased spring progress (match VTVcab helper) ───────────────────────
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

// ─── Background / decorative components ──────────────────────────────────────
const AnimatedBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const angle = (frame / Math.max(1, durationInFrames)) * 360;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `conic-gradient(from ${angle}deg, #0f172a, #6b21a8, #be185d, #0f172a)`,
        opacity: 0.85,
        pointerEvents: "none",
      }}
    />
  );
};

const AnimatedBorder: React.FC<{ progress: number }> = ({ progress }) => {
  const scale = interpolate(progress, [0, 1], [0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(progress, [0, 0.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        border: "48px solid #ff682d36",
        boxSizing: "border-box",
        transform: `scale(${scale})`,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

const WhiteFrame: React.FC<{ progress: number }> = ({ progress }) => {
  const scale = interpolate(progress, [0, 1], [1.06, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(progress, [0.15, 0.45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        width: "80%",
        height: "30%",
        top: "50%",
        left: "50%",
        transform: `translate(-50%, -50%) scale(${scale})`,
        borderRadius: 60,
        border: "12px solid #fff",
        boxSizing: "border-box",
        opacity,
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
};

const WhiteFrame2: React.FC<{ progress: number }> = ({ progress }) => {
  const scale = interpolate(progress, [0, 1], [1.06, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(progress, [0.15, 0.45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        width: "70%",
        height: "25%",
        top: "50%",
        left: "50%",
        transform: `translate(-50%, -50%) scale(${scale})`,
        backgroundColor: "#fff",
        borderRadius: 20,
        boxSizing: "border-box",
        opacity,
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
};

const ContentText: React.FC<{ progress: number }> = ({ progress }) => {
  const opacity = interpolate(progress, [0.3, 0.6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(progress, [0.3, 0.6], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textScale = interpolate(progress, [0.3, 0.6], [1.04, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: `translate(-50%, calc(-50% + ${translateY}px)) scale(${textScale})`,
        textAlign: "center",
        opacity,
        zIndex: 100,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontFamily: montserratFamily,
          fontSize: 72,
          fontWeight: 900,
          color: "#000000",
          lineHeight: 1.05,
          marginBottom: 12,
        }}
      >
        Trending Hook
      </div>

      <div
        style={{
          fontFamily: montserratFamily,
          fontSize: 44,
          fontWeight: 800,
          color: "#000000",
          opacity: 0.95,
        }}
      >
        Most Played This Week
      </div>
    </div>
  );
};

// ─── Main Composition ───────────────────────────────────────────────────────
export const TikTokHookTemplate: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Timings use the same kineticSlide helper for consistent spring feel
  const entranceProgress = kineticSlide(frame, fps, 0, Math.round(0.45 * fps));
  const contentProgress = kineticSlide(
    frame,
    fps,
    Math.round(0.35 * fps),
    Math.round(0.6 * fps),
  );

  const textProgress = kineticSlide(
    frame,
    fps,
    Math.round(0.6 * fps),
    Math.round(0.6 * fps),
  );

  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#071025",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <AnimatedBackground />

      <AnimatedBorder progress={entranceProgress} />

      <WhiteFrame progress={contentProgress} />

      <WhiteFrame2 progress={contentProgress} />

      <ContentText progress={textProgress} />
    </div>
  );
};
