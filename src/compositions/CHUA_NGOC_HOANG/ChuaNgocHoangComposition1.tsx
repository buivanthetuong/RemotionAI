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

// ─── Load Fonts ───────────────────────────────────────────────────────────────
const { fontFamily: montserratFamily } = loadFont("normal", {
  weights: ["700", "800", "900"],
  subsets: ["latin", "vietnamese"],
});

// ─── Constants & Timings ──────────────────────────────────────────────────────
const ITEM_DURATION = 90; // 4 seconds at 30fps per slide
const TRANSITION_DURATION = 30; // 1 second for image page-flip transition

// Each slide: { text, image }
const SLIDES = [
  { text: "đây là", image: "chuangochoang1.png" },
  { text: "chùa ngọc hoàng", image: "chuangochoang2.png" },
  { text: "một danh lam", image: "chuangochoang3.png" },
  { text: "tại tp HCM", image: "chuangochoang4.png" },
];

// ─── Helper: spring progress ──────────────────────────────────────────────────
function springProgress(
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
    from: 0,
    to: 1,
  });
}

// ─── Image Layer with Page Flip Effect ───────────────────────────────────────
/**
 * Renders two images stacked. The "old" image flips away (left half → right turn)
 * and the "new" image flips in. Uses CSS perspective + rotateY.
 * This layer changes independently from the text layer.
 */
const ImageLayer: React.FC<{
  slideIndex: number;
  slideFrame: number;
  isTransitioning: boolean;
}> = ({ slideIndex, slideFrame, isTransitioning }) => {
  const { fps } = useVideoConfig();

  // Page-flip progress 0→1 during TRANSITION_DURATION frames
  const flipProgress = isTransitioning
    ? interpolate(slideFrame, [0, TRANSITION_DURATION], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // Zoom out + Fade in entrance for the first slide (starts at frame 0)
  const zoomProgress =
    slideIndex === 0 ? springProgress(slideFrame, fps, 0, 35) : 1;
  const zoomScale = interpolate(zoomProgress, [0, 1], [1.5, 1]);
  const zoomOpacity = interpolate(zoomProgress, [0, 0.4], [0, 1]);

  // Move image up from center for the first slide (starts at frame 30)
  const moveProgress =
    slideIndex === 0 ? springProgress(slideFrame, fps, 30, 25) : 1;
  const yOffset = interpolate(moveProgress, [0, 1], [135, 0]);

  const imageStyle: React.CSSProperties = {
    width: 700,
    height: 450,
    borderRadius: 24,
    overflow: "hidden",
    boxShadow: "0 30px 60px rgba(0,0,0,0.3)",
    border: "4px solid white",
    backgroundColor: "white",
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 600,
        left: 0,
        right: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: 1600,
        transform: `translateY(${yOffset}px) scale(${zoomScale})`,
        opacity: zoomOpacity,
      }}
    >
      {SLIDES.map((slide, i) => {
        // Decide if this image should be rendered
        const isPrevious = i === slideIndex - 1;

        // Skip images already flipped away
        if (i < slideIndex - 1) return null;
        // Skip previous image if we're not transitioning anymore
        if (isPrevious && !isTransitioning) return null;

        // Logic for flipping the top image away
        const rotateY = isPrevious
          ? interpolate(flipProgress, [0, 1], [0, 180])
          : 0;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              transformOrigin: "right center",
              transform: `rotateY(${rotateY}deg)`,
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
              zIndex: SLIDES.length - i, // Earlier images are on top
            }}
          >
            <div style={imageStyle}>
              <Img
                src={staticFile(slide.image)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Text Layer (independent, normal animations) ──────────────────────────────
/**
 * Text fades in and slides up. Changes slide index when ITEM_DURATION passes.
 * Text is NOT affected by the image page-flip at all.
 */
const TextLayer: React.FC<{
  slideIndex: number;
  slideFrame: number;
  isTransitioning: boolean;
}> = ({ slideIndex, slideFrame, isTransitioning }) => {
  const { fps } = useVideoConfig();

  // Delay text only for the first slide (slideIndex === 0)
  const delay = slideIndex === 0 ? 30 : 15;
  const textProgress = springProgress(slideFrame, fps, delay, 20);

  const opacity = interpolate(textProgress, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(textProgress, [0, 1], [50, 0], {
    extrapolateRight: "clamp",
  });

  // Text exit: fade out slightly before next slide
  const exitStart = ITEM_DURATION - 20;
  const exitProgress =
    !isTransitioning && slideFrame > exitStart
      ? interpolate(slideFrame, [exitStart, ITEM_DURATION], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);

  const currentText = SLIDES[slideIndex]?.text ?? "";

  return (
    <div
      style={{
        position: "absolute",
        top: 1200,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontFamily: montserratFamily,
          fontWeight: 900,
          fontSize: 72,
          textTransform: "uppercase",
          color: "#1a1a1a",
          textAlign: "center",
          letterSpacing: "4px",
          textShadow: "0 4px 16px rgba(0,0,0,0.12)",
          opacity: opacity * exitOpacity,
          transform: `translateY(${translateY}px)`,
          padding: "0 40px",
        }}
      >
        {currentText}
      </div>
    </div>
  );
};

// ─── Main Composition ─────────────────────────────────────────────────────────
export const ChuaNgocHoangComposition1: React.FC = () => {
  const frame = useCurrentFrame();

  // Calculate which slide we're on and local frame within that slide
  // Slides share frames during transition (transition overlaps adjacent slides)
  let accumulated = 0;
  let slideIndex = 0;
  let slideFrame = 0;
  let isTransitioning = false;

  for (let i = 0; i < SLIDES.length; i++) {
    const slideEnd = accumulated + ITEM_DURATION;
    if (i < SLIDES.length - 1) {
      // Transition starts at slide's end - TRANSITION_DURATION
      const transitionStart = slideEnd - TRANSITION_DURATION;
      if (frame < transitionStart) {
        slideIndex = i;
        slideFrame = frame - accumulated;
        isTransitioning = false;
        break;
      } else if (frame < slideEnd) {
        // In transition between slide i and i+1
        slideIndex = i + 1;
        slideFrame = frame - transitionStart;
        isTransitioning = true;
        break;
      }
      accumulated = transitionStart; // next slide starts overlapping here
    } else {
      // Last slide
      slideIndex = i;
      slideFrame = frame - accumulated;
      isTransitioning = false;
    }
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#fff" }}>
      {/* Background gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 40%, #ffffff 0%, #ececec 100%)",
        }}
      />
      {/* Paper texture overlay */}
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

      {/* Image layer: page flip affects ONLY this layer */}
      <ImageLayer
        slideIndex={slideIndex}
        slideFrame={slideFrame}
        isTransitioning={isTransitioning}
      />

      {/* Text layer: completely independent, normal animations */}
      <TextLayer
        slideIndex={slideIndex}
        slideFrame={slideFrame}
        isTransitioning={isTransitioning}
      />
    </AbsoluteFill>
  );
};

export default ChuaNgocHoangComposition1;
