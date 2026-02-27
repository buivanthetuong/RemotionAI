import {
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ─── Rotating Star SVG ────────────────────────────────────────────────────────
const RotatingStar: React.FC<{ rotation: number }> = ({ rotation }) => {
  return (
    <svg
      viewBox="0 0 200 200"
      width={520}
      height={520}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        opacity: 0.18,
        filter: "drop-shadow(0 0 24px #ffe066)",
      }}
    >
      {/* 8-pointed star made of two overlapping squares */}
      <polygon
        points="100,5 120,80 195,80 135,125 158,198 100,155 42,198 65,125 5,80 80,80"
        fill="#FFE066"
        stroke="#FFD700"
        strokeWidth="2"
      />
      <polygon
        points="100,5 120,80 195,80 135,125 158,198 100,155 42,198 65,125 5,80 80,80"
        fill="#FFE066"
        style={{ transform: "rotate(36deg)", transformOrigin: "100px 100px" }}
      />
    </svg>
  );
};

// ─── A single animated text line sliding from left ───────────────────────────
const SlideInLine: React.FC<{
  text: string;
  delayFrames: number;
  fontSize: number;
  color: string;
  isHighlight?: boolean;
}> = ({ text, delayFrames, fontSize, color, isHighlight }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delayFrames,
    fps,
    config: { damping: 200 },
    durationInFrames: Math.round(0.6 * fps),
  });

  const translateX = interpolate(progress, [0, 1], [-420, 0]);
  const opacity = interpolate(progress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        transform: `translateX(${translateX}px)`,
        opacity,
        fontSize,
        fontFamily: "'Arial Black', 'Impact', sans-serif",
        fontWeight: 900,
        color,
        textTransform: "uppercase",
        lineHeight: 1.15,
        textAlign: "center",
        letterSpacing: 1.5,
        textShadow: isHighlight
          ? "0 2px 12px rgba(0,0,0,0.7)"
          : "2px 2px 8px rgba(0,0,0,0.9)",
        padding: "0 8px",
      }}
    >
      {text}
    </div>
  );
};

// ─── Main Composition ─────────────────────────────────────────────────────────
export const MyComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Star rotates continuously: 360° over 4 seconds
  const rotation = interpolate(frame, [0, 4 * fps], [0, 360], {
    extrapolateRight: "extend", // keeps spinning forever
  });

  // Box fade-in
  const boxOpacity = interpolate(frame, [0, 0.4 * fps], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Text lines with staggered slide-in delays (in frames)
  const lines: Array<{
    text: string;
    delay: number;
    fontSize: number;
    color: string;
    isHighlight?: boolean;
  }> = [
    { text: "CẢM ƠN LOW G", delay: 4, fontSize: 52, color: "#FFE066", isHighlight: true },
    { text: "TRƯỚC CÓ TREND NÂNG TẠ", delay: 10, fontSize: 36, color: "#FFFFFF" },
    { text: "KÝ TẶNG FAN 2K3", delay: 16, fontSize: 36, color: "#FFFFFF" },
    { text: "NAY LẠI TẠO TREND MỚI", delay: 22, fontSize: 40, color: "#FFE066", isHighlight: true },
    { text: '"BỔ MẶT" KHÔNG KÉM', delay: 28, fontSize: 40, color: "#FFE066", isHighlight: true },
  ];

  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#000",
      }}
    >
      {/* ── Background image ── */}
     

      {/* ── Dark overlay for readability ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.45) 100%)",
        }}
      />

      {/* ── Rotating star (behind card) ── */}
      <div
        style={{
          position: "absolute",
          top: "48%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1,
        }}
      >
        <RotatingStar rotation={rotation} />
      </div>

      {/* ── Text card ── */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 2,
          opacity: boxOpacity,
          width: width * 0.82,
          background: "rgba(70, 140, 210, 0.72)",
          backdropFilter: "blur(6px)",
          borderRadius: 24,
          border: "2.5px solid rgba(255,255,255,0.3)",
          padding: "32px 28px 36px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          boxShadow: "0 8px 48px rgba(0,0,0,0.5)",
          overflow: "hidden",
        }}
      >
        {lines.map((line, i) => (
          <SlideInLine
            key={i}
            text={line.text}
            delayFrames={line.delay}
            fontSize={line.fontSize}
            color={line.color}
            isHighlight={line.isHighlight}
          />
        ))}
      </div>

      {/* ── TikTok logo area (bottom-left) ── */}
      <div
        style={{
          position: "absolute",
          bottom: 200,
          left: 28,
          zIndex: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
        }}
      >
        {/* TikTok icon — inline SVG approximation */}
        <svg viewBox="0 0 48 48" width={48} height={48} fill="white">
          <path d="M41 9.6A11.9 11.9 0 0 1 30.4 0h-7.6v32.7a5.1 5.1 0 1 1-3.6-4.9V20a12.7 12.7 0 1 0 11.2 12.7V16.2a19.4 19.4 0 0 0 11.3 3.6V12.2A11.9 11.9 0 0 1 41 9.6z" />
        </svg>
        <span
          style={{
            color: "white",
            fontFamily: "Arial, sans-serif",
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: 0.5,
          }}
        >
          TikTok
        </span>
        <span
          style={{
            color: "rgba(255,255,255,0.85)",
            fontFamily: "Arial, sans-serif",
            fontSize: 12,
            letterSpacing: 0.3,
          }}
        >
          @ caipagenhacrap
        </span>
      </div>
    </div>
  );
};
