import React from "react";
import {
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";

// ─── Load Fonts ───────────────────────────────────────────────────────────────
const { fontFamily: montserratFamily } = loadFont("normal", {
  weights: ["700", "800", "900"],
  subsets: ["latin", "vietnamese"],
});

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

// ─── VTVcab logo text component ───────────────────────────────────────────────
const VTVcabLogo: React.FC<{ progress: number }> = ({ progress }) => {
  const translateX = interpolate(progress, [0, 1], [-220, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(progress, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <div
      style={{
        transform: `translateX(${translateX}px)`,
        opacity,
        display: "flex",
        alignItems: "baseline",
        gap: 0,
      }}
    >
      {/* "VTV" in bold italic white */}
      <span
        style={{
          fontFamily: montserratFamily,
          fontWeight: 900,
          fontSize: 52,
          color: "#FFFFFF",
          letterSpacing: -1,
          fontStyle: "italic",
          lineHeight: 1,
        }}
      >
        Review
      </span>
      {/* "cab" in bold italic orange-yellow */}
      <span
        style={{
          fontFamily: montserratFamily,
          fontWeight: 900,
          fontSize: 52,
          color: "#F7941D",
          letterSpacing: -1,
          fontStyle: "italic",
          lineHeight: 1,
        }}
      >
        Phim
      </span>
    </div>
  );
};

// ─── KHÁM PHÁ badge component ─────────────────────────────────────────────────
const KhamPhaBadge: React.FC<{ progress: number }> = ({ progress }) => {
  const translateX = interpolate(progress, [0, 1], [-220, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(progress, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <div
      style={{
        transform: `translateX(${translateX}px)`,
        opacity,
        marginTop: 6,
        backgroundColor: "#F7941D",
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 4,
        paddingBottom: 4,
        display: "inline-block",
        alignSelf: "flex-start",
      }}
    >
      <span
        style={{
          fontFamily: montserratFamily,
          fontWeight: 800,
          fontSize: 20,
          color: "#FFFFFF",
          letterSpacing: 2,
          textTransform: "uppercase" as const,
        }}
      >
        Review
      </span>
    </div>
  );
};

// ─── Divider line animating from bottom ────────────────────────────────────────
const DividerLine: React.FC<{ progress: number }> = ({ progress }) => {
  const translateY = interpolate(progress, [0, 1], [60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(progress, [0, 0.5], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <div
      style={{
        transform: `translateY(${translateY}px)`,
        opacity,
        width: 5,
        backgroundColor: "#F7941D",
        borderRadius: 2,
        alignSelf: "stretch",
        minHeight: 100,
        marginRight: 18,
        flexShrink: 0,
      }}
    />
  );
};

// ─── Title text animating from right (Kinetic Slide) ─────────────────────────
const KineticTitle: React.FC<{ progress: number; text: string }> = ({
  progress,
  text,
}) => {
  const translateX = interpolate(progress, [0, 1], [300, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(progress, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <div
      style={{
        transform: `translateX(${translateX}px)`,
        opacity,
      }}
    >
      <span
        style={{
          fontFamily: montserratFamily,
          fontWeight: 800,
          fontSize: 42,
          color: "#FFFFFF",
          lineHeight: 1.3,
          letterSpacing: 0.5,
          textTransform: "uppercase" as const,
          textShadow: "2px 3px 10px rgba(0,0,0,0.85)",
        }}
      >
        {text}
      </span>
    </div>
  );
};

// ─── Main Composition ─────────────────────────────────────────────────────────
export const VTVcabKhampha: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // ── Background slow pan: moves from left to right over full 5s ──
  const bgTranslateX = interpolate(frame, [0, 5 * fps], [0, -200], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // ── Animation timings (in frames) ──
  // Phase 1: VTVcab slides in from left — starts at frame 0
  const vtvcabProgress = kineticSlide(frame, fps, 0, Math.round(0.45 * fps));

  // Phase 2: KHÁM PHÁ slides in right after VTVcab — starts at frame 12
  const khamPhaProgress = kineticSlide(frame, fps, 5, Math.round(0.45 * fps));

  // Phase 3: Divider line rises from bottom — starts at frame 25
  const dividerProgress = kineticSlide(frame, fps, 30, Math.round(0.4 * fps));

  // Phase 4: Title text slides from right — starts at frame 38
  const titleProgress = kineticSlide(frame, fps, 35, Math.round(0.55 * fps));

  const title =
    "Đừng bản thân phải buồn bã, hãy để tôi giúp bạn tìm ra niềm vui trong cuộc sống của bạn nhé!";

  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#0a1628",
      }}
    >
      {/* ── Background image with slow pan and blur overlay ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile("BG_6.jpg")}
          style={{
            width: "120%",
            height: "100%",
            objectFit: "cover",
            transform: `translateX(${bgTranslateX}px)`,
            filter: "blur(2px) brightness(0.55)",
          }}
        />
      </div>

      {/* ── Dark gradient overlay for depth ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(160deg, rgba(10,22,40,0.25) 0%, rgba(10,22,40,0.15) 40%, rgba(10,22,40,0.70) 100%)",
          zIndex: 1,
        }}
      />

      {/* ── Bottom content area ── */}
      <div
        style={{
          position: "absolute",
          bottom: "500px",
          left: 0,
          right: 0,
          zIndex: 2,
          padding: "0 0 80px 48px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 0,
        }}
      >
        {/* VTVcab logo */}
        <VTVcabLogo progress={vtvcabProgress} />

        {/* KHÁM PHÁ badge */}
        <KhamPhaBadge progress={khamPhaProgress} />

        {/* Spacer */}
        <div style={{ height: 20 }} />

        {/* Divider + Title row */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
            gap: 0,
            width: "91%",
          }}
        >
          <DividerLine progress={dividerProgress} />
          <KineticTitle progress={titleProgress} text={title} />
        </div>
      </div>
    </div>
  );
};
