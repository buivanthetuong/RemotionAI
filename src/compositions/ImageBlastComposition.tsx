import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ─── Config ────────────────────────────────────────────────────────────────────
// 4 images to blast in, each with a unique top-area position
const IMAGES = [
  {
    src: staticFile("BG_5.jpg"),
    // top-left area
    left: 20,
    top: 220,
    rotate: -8,
    width: 420,
    height: 300,
  },
  {
    src: staticFile("conan.png"),
    // top-center-right
    left: 580,
    top: 180,
    rotate: 6,
    width: 360,
    height: 360,
  },
  {
    src: staticFile("BG_6.jpg"),
    // top-center-left
    left: 180,
    top: 340,
    rotate: -4,
    width: 440,
    height: 280,
  },
  {
    src: staticFile("image.png"),
    // top-right
    left: 620,
    top: 380,
    rotate: 10,
    width: 380,
    height: 320,
  },
];

// Each image "blasts in" for this many frames before the next one appears
const BLAST_INTERVAL = 6; // frames — very fast, creates rapid-fire visual effect
const IMAGE_START_FRAME = 0;
const TEXT_START_FRAME =
  IMAGE_START_FRAME + IMAGES.length * BLAST_INTERVAL + 10;

// ─── Single blasting image ─────────────────────────────────────────────────────
const BlastImage: React.FC<{
  src: string;
  targetLeft: number;
  targetTop: number;
  rotate: number;
  width: number;
  height: number;
}> = ({ src, targetLeft, targetTop, rotate, width, height }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Slight "punch" scale-down after arrival
  const punchScale = interpolate(frame, [0, 4, 8, 12], [0, 1.12, 0.95, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <div
      style={{
        position: "absolute",
        left: targetLeft,
        top: targetTop,
        width,
        height,
        transform: `rotate(${rotate}deg) scale(${punchScale})`,
        transformOrigin: "center center",
        opacity,
        borderRadius: 12,
        overflow: "hidden",
        boxShadow:
          "0 8px 40px rgba(0,0,0,0.7), 0 0 0 3px rgba(255,255,255,0.25)",
      }}
    >
      <Img
        src={src}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
};

// ─── Text reveal ──────────────────────────────────────────────────────────────
const TextReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line1Progress = spring({
    frame: frame,
    fps,
    config: { damping: 18, stiffness: 200 },
    durationInFrames: 30,
  });

  const line2Progress = spring({
    frame: frame - 12,
    fps,
    config: { damping: 18, stiffness: 200 },
    durationInFrames: 30,
  });

  const line1TranslateY = interpolate(line1Progress, [0, 1], [80, 0]);
  const line1Opacity = interpolate(line1Progress, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });

  const line2TranslateY = interpolate(line2Progress, [0, 1], [80, 0]);
  const line2Opacity = interpolate(line2Progress, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Glow pulse behind text
  const glowOpacity = interpolate(frame, [0, 20, 40, 60], [0, 0.7, 0.5, 0.7], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 480,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        zIndex: 10,
        paddingLeft: 40,
        paddingRight: 40,
      }}
    >
      {/* Glow blob behind text */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 200,
          background:
            "radial-gradient(ellipse at center, rgba(255,180,0,0.35) 0%, transparent 70%)",
          opacity: glowOpacity,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      {/* Line 1 */}
      <div
        style={{
          transform: `translateY(${line1TranslateY}px)`,
          opacity: line1Opacity,
          fontFamily: "'Arial Black', Impact, sans-serif",
          fontSize: 88,
          fontWeight: 900,
          color: "#FFE000",
          textAlign: "center",
          letterSpacing: 3,
          textTransform: "uppercase",
          textShadow:
            "0 0 30px rgba(255,200,0,0.8), 2px 4px 0px rgba(0,0,0,0.9), -1px -1px 0 #000",
          lineHeight: 1.1,
          padding: "0 40px",
        }}
      >
        KHÔNG CÒN AI
      </div>

      {/* Line 2 */}
      <div
        style={{
          transform: `translateY(${line2TranslateY}px)`,
          opacity: line2Opacity,
          fontFamily: "'Arial Black', Impact, sans-serif",
          fontSize: 60,
          fontWeight: 700,
          color: "#FFFFFF",
          textAlign: "center",
          letterSpacing: 2,
          textShadow:
            "0 0 20px rgba(255,255,255,0.5), 2px 3px 0px rgba(0,0,0,0.9)",
          padding: "0 60px",
          lineHeight: 1.2,
        }}
      >
        CHỜ TA Ở NƠI NÀY NỮA
      </div>
    </div>
  );
};

// ─── Main Composition ──────────────────────────────────────────────────────────
export const ImageBlastComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      {/* Dark vignette background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a0a 100%)",
        }}
      />

      {/* Images blast in one by one */}
      {IMAGES.map((img, i) => {
        const startFrame = IMAGE_START_FRAME + i * BLAST_INTERVAL;
        return (
          <React.Fragment key={i}>
            <Sequence from={startFrame} layout="none">
              <BlastImage
                src={img.src}
                targetLeft={img.left}
                targetTop={img.top}
                rotate={img.rotate}
                width={img.width}
                height={img.height}
              />
            </Sequence>
          </React.Fragment>
        );
      })}

      {/* Text appears after all images have blasted in */}
      <Sequence from={TEXT_START_FRAME} layout="none">
        <TextReveal />
      </Sequence>
    </AbsoluteFill>
  );
};
