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
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadNotoSans } from "@remotion/google-fonts/NotoSansJP";

// ─── Load Fonts ───────────────────────────────────────────────────────────────
const { fontFamily: montserratFamily } = loadFont("normal", {
  weights: ["400", "600", "700", "900"],
  subsets: ["latin", "vietnamese"],
});

const { fontFamily: notoFamily } = loadNotoSans("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

// ─── Constants ────────────────────────────────────────────────────────────────
// TikTok: 1080 x 1920, 30fps, 10s = 300 frames
const DURATION_FRAMES = 300;

// Lyrics lines - each appears for ~3s, staggered
const LYRICS_LINES = [
  { text: "Nơi này có anh, có em bên nhau", startFrame: 0, duration: 80 },
  { text: "Từng khoảnh khắc đẹp mãi in sâu", startFrame: 60, duration: 80 },
  { text: "Nhớ ánh mắt em ngày ấy dịu dàng", startFrame: 120, duration: 80 },
  { text: "Như ánh sao đêm giữa không gian", startFrame: 180, duration: 80 },
  { text: "Nơi này có anh luôn ở bên em", startFrame: 240, duration: 80 },
];

// ─── Background Layer ──────────────────────────────────────────────────────────
const BackgroundLayer: React.FC = () => (
  <>
    {/* Full-screen blurred Conan image */}
    <Img
      src={staticFile("conan.png")}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "center 20%",
        filter: "blur(22px) brightness(0.45) saturate(1.3)",
        transform: "scale(1.1)",
      }}
    />
    {/* Dark overlay: bottom darker for lyrics readability */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(to bottom, rgba(0,0,20,0.55) 0%, rgba(0,5,30,0.4) 35%, rgba(0,0,20,0.7) 70%, rgba(0,0,15,0.9) 100%)",
      }}
    />
    {/* Vignette */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse at 50% 40%, transparent 35%, rgba(0,0,15,0.6) 100%)",
      }}
    />
  </>
);

// ─── Floating Particles ────────────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: 3 + ((i * 137.5) % 94),
  baseY: 5 + ((i * 73) % 90),
  size: 2 + (i % 4),
  speed: 0.25 + (i % 5) * 0.12,
  phase: (i * 43) % 360,
  opacity: 0.25 + (i % 4) * 0.12,
}));

const FloatingParticles: React.FC<{ frame: number }> = ({ frame }) => (
  <>
    {PARTICLES.map((p) => {
      const t = frame * p.speed + p.phase;
      const floatY = Math.sin((t * Math.PI) / 180) * 25;
      const floatX = Math.cos((t * 0.7 * Math.PI) / 180) * 10;
      return (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.baseY}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            backgroundColor: `rgba(180,210,255,${p.opacity})`,
            transform: `translate(${floatX}px,${floatY}px)`,
            boxShadow: `0 0 ${p.size * 3}px rgba(180,210,255,0.5)`,
          }}
        />
      );
    })}
  </>
);

// ─── 1. Song Title Section (top) ───────────────────────────────────────────────
const SongTitleSection: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const progress = spring({
    frame,
    fps,
    delay: 5,
    config: { damping: 200 },
    durationInFrames: 30,
  });

  const opacity = interpolate(progress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(progress, [0, 1], [-40, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        paddingTop: 120,
        paddingBottom: 40,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {/* Decorative top bar */}
      <div
        style={{
          width: 60,
          height: 3,
          background:
            "linear-gradient(to right, transparent, rgba(255,255,255,0.8), transparent)",
          marginBottom: 28,
          borderRadius: 2,
        }}
      />

      {/* Song name */}
      <div
        style={{
          fontFamily: notoFamily,
          fontSize: 52,
          fontWeight: 700,
          color: "rgba(255,255,255,0.96)",
          letterSpacing: "4px",
          textAlign: "center",
          textShadow:
            "0 0 30px rgba(120,160,255,0.6), 0 3px 15px rgba(0,0,40,0.9)",
          paddingLeft: 40,
          paddingRight: 40,
          lineHeight: 1.2,
        }}
      >
        《Nơi Này Có Anh》
      </div>

      {/* Artist name */}
      <div
        style={{
          marginTop: 16,
          fontFamily: montserratFamily,
          fontSize: 30,
          fontWeight: 400,
          color: "rgba(180,210,255,0.75)",
          letterSpacing: "3px",
          textAlign: "center",
        }}
      >
        Sơn Tùng M-TP
      </div>

      {/* Decorative bottom bar */}
      <div
        style={{
          marginTop: 28,
          width: 120,
          height: 1,
          background:
            "linear-gradient(to right, transparent, rgba(255,255,255,0.5), transparent)",
          borderRadius: 1,
        }}
      />
    </div>
  );
};

// ─── 2. Album Art + Rotating Square (center) ──────────────────────────────────
const AlbumSection: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  // Entrance spring
  const entranceProgress = spring({
    frame,
    fps,
    delay: 15,
    config: { damping: 26, stiffness: 90 },
    durationInFrames: 45,
  });

  const scale = interpolate(entranceProgress, [0, 1], [0.7, 1]);
  const opacity = interpolate(entranceProgress, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Slow continuous rotation: 36°/s → full circle every 10s
  const rotationDeg = (frame / 30) * 36;

  return (
    <div
      style={{
        position: "absolute",
        top: 500, // Moved down from 380
        left: 0,
        right: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {/* Rotating square (behind album) */}
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          border: "7px solid rgba(255,255,255,0.7)",
          boxShadow:
            "0 0 40px rgba(100,140,255,0.35), inset 0 0 30px rgba(100,140,255,0.1)",
          transform: `rotate(${rotationDeg}deg)`,
          borderRadius: 4,
        }}
      />

      {/* Outer glow ring */}
      <div
        style={{
          position: "absolute",
          width: 420,
          height: 420,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(80,120,255,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Album art frame */}
      <div
        style={{
          position: "relative",
          width: 340,
          height: 340,
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(6px)",
          borderRadius: 12,
          border: "1.5px solid rgba(255,255,255,0.3)",
          padding: 12,
          boxShadow: "0 12px 48px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4)",
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile("conan.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 15%",
            borderRadius: 6,
            display: "block",
          }}
        />
        {/* Subtle shimmer overlay on album art */}
        <div
          style={{
            position: "absolute",
            inset: 12,
            borderRadius: 6,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%)",
          }}
        />
      </div>
    </div>
  );
};

// ─── 3. Lyrics Section (bottom half) ──────────────────────────────────────────
const LyricsLine: React.FC<{
  text: string;
  startFrame: number;
  duration: number;
  frame: number;
  fps: number;
}> = ({ text, startFrame, duration, frame, fps }) => {
  const localFrame = frame - startFrame;
  if (localFrame < 0 || localFrame > duration) return null;

  const enterProgress = spring({
    frame: localFrame,
    fps,
    config: { damping: 26, stiffness: 110 },
    durationInFrames: 22,
  });

  const exitStart = duration - 18;
  const exitOpacity =
    localFrame > exitStart
      ? interpolate(localFrame, [exitStart, duration], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  const opacity =
    interpolate(enterProgress, [0, 0.35], [0, 1], {
      extrapolateRight: "clamp",
    }) * exitOpacity;

  const translateY = interpolate(enterProgress, [0, 1], [30, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        fontFamily: montserratFamily,
        fontSize: 42,
        fontWeight: 700,
        color: "rgba(255,255,255,0.95)",
        textShadow:
          "0 0 24px rgba(120,170,255,0.75), 0 2px 12px rgba(0,0,0,0.95)",
        letterSpacing: "1.5px",
        lineHeight: 1.55,
        textAlign: "center",
        paddingLeft: 60,
        paddingRight: 60,
      }}
    >
      {text}
    </div>
  );
};

const LyricsSection: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => (
  <div
    style={{
      position: "absolute",
      bottom: 580,
      left: 0,
      right: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8,
      minHeight: 280,
      justifyContent: "center",
    }}
  >
    {/* Decorative divider above lyrics */}
    <div
      style={{
        width: 200,
        height: 1,
        background:
          "linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent)",
        marginBottom: 20,
      }}
    />
    {LYRICS_LINES.map((line, i) => (
      <LyricsLine
        key={i}
        text={line.text}
        startFrame={line.startFrame}
        duration={line.duration}
        frame={frame}
        fps={fps}
      />
    ))}
  </div>
);

// ─── Progress Bar ──────────────────────────────────────────────────────────────
const MusicProgressBar: React.FC<{ frame: number }> = ({ frame }) => {
  const progress = frame / DURATION_FRAMES;
  return (
    <div
      style={{
        position: "absolute",
        bottom: 500,
        left: 150,
        right: 150,
        height: 10,
        backgroundColor: "rgba(255,255,255,0.15)",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress * 100}%`,
          background:
            "linear-gradient(to right, rgba(100,150,255,0.8), rgba(200,230,255,1))",
          borderRadius: 3,
          boxShadow: "0 0 10px rgba(120,170,255,0.9)",
        }}
      />
    </div>
  );
};

// ─── Corner Decorations ────────────────────────────────────────────────────────
const CornerDecorations: React.FC = () => {
  const lineStyle: React.CSSProperties = {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    boxShadow: "0 0 10px rgba(255, 255, 255, 0.2)",
  };

  const len = 80;
  const thick = 3;
  const offset = 60; // Distance from the edge

  return (
    <>
      {/* Top Left */}
      <div
        style={{
          ...lineStyle,
          top: offset,
          left: offset,
          width: len,
          height: thick,
        }}
      />
      <div
        style={{
          ...lineStyle,
          top: offset,
          left: offset,
          width: thick,
          height: len,
        }}
      />

      {/* Top Right */}
      <div
        style={{
          ...lineStyle,
          top: offset,
          right: offset,
          width: len,
          height: thick,
        }}
      />
      <div
        style={{
          ...lineStyle,
          top: offset,
          right: offset,
          width: thick,
          height: len,
        }}
      />

      {/* Bottom Left */}
      <div
        style={{
          ...lineStyle,
          bottom: offset,
          left: offset,
          width: len,
          height: thick,
          backgroundColor: "rgba(255,255,255,0.25)",
        }}
      />
      <div
        style={{
          ...lineStyle,
          bottom: offset,
          left: offset,
          width: thick,
          height: len,
          backgroundColor: "rgba(255,255,255,0.25)",
        }}
      />

      {/* Bottom Right */}
      <div
        style={{
          ...lineStyle,
          bottom: offset,
          right: offset,
          width: len,
          height: thick,
          backgroundColor: "rgba(255,255,255,0.25)",
        }}
      />
      <div
        style={{
          ...lineStyle,
          bottom: offset,
          right: offset,
          width: thick,
          height: len,
          backgroundColor: "rgba(255,255,255,0.25)",
        }}
      />
    </>
  );
};

// ─── Main Composition ──────────────────────────────────────────────────────────
export const NoiNayCoAnhComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#000010" }}>
      {/* Layer 0: Blurred background */}
      <BackgroundLayer />

      {/* Layer 1: Floating particles */}
      <FloatingParticles frame={frame} />

      {/* Layer 2 (TOP): Song title + artist */}
      <SongTitleSection frame={frame} fps={fps} />

      {/* Layer 3 (MIDDLE): Album art with rotating square */}
      <AlbumSection frame={frame} fps={fps} />

      {/* Layer 4 (BOTTOM): Scrolling lyrics */}
      <LyricsSection frame={frame} fps={fps} />

      {/* Layer 5: Progress bar at very bottom */}
      <MusicProgressBar frame={frame} />

      {/* Layer 6: Corner Decorative Elements */}
      <CornerDecorations />
    </AbsoluteFill>
  );
};

export default NoiNayCoAnhComposition;
