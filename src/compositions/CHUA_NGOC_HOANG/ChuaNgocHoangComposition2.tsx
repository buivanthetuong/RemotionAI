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

// Fixed offsets for each slide to create a "messy stack" look
const STACK_OFFSETS = [
  { x: 0, y: -20, rotation: 4 },
  { x: 50, y: -60, rotation: -4 },
  { x: -60, y: -40, rotation: 4 },
  { x: 0, y: 0, rotation: -4 },
];

// ─── Image Layer with Swipe Stack Effect ──────────────────────────────────────
/**
 * Renders images in a messy stack. Instead of page flipping, the top image
 * "swipes" (slides) out to the left or right to reveal the one underneath.
 */
const ImageLayer: React.FC<{
  slideIndex: number;
  slideFrame: number;
  isTransitioning: boolean;
}> = ({ slideIndex, slideFrame, isTransitioning }) => {
  const { fps } = useVideoConfig();

  // Swipe progress 0→1 during TRANSITION_DURATION frames
  const swipeProgress = isTransitioning
    ? springProgress(slideFrame, fps, 0, TRANSITION_DURATION)
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
    backgroundColor: "#faf8f5", // Cream color frame
    padding: "15px", // Padding creates the photo border effect
    borderRadius: 4,
    boxShadow: "0 10px 30px rgba(0,0,0,0.15), 0 5px 15px rgba(0,0,0,0.1)",
    border: "1px solid rgba(0,0,0,0.05)",
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
        const isPrevious = i === slideIndex - 1;

        // Only render images from the current stack (current slide and future ones)
        // plus the one that is currently swiping away
        if (i < slideIndex - 1) return null;
        if (isPrevious && !isTransitioning) return null;

        const offset = STACK_OFFSETS[i % STACK_OFFSETS.length];

        // Swipe animation logic
        let translateX = offset.x;
        let rotate = offset.rotation;
        let opacity = 1;
        const scale = i === 0 ? 1.2 : 1;

        if (isPrevious) {
          const direction = i % 2 === 0 ? -1 : 1; // Alternate left/right
          translateX = interpolate(
            swipeProgress,
            [0, 1],
            [offset.x, direction * 1000],
          );
          rotate = interpolate(
            swipeProgress,
            [0, 1],
            [offset.rotation, offset.rotation + direction * 25],
          );
          opacity = interpolate(swipeProgress, [0.8, 1], [1, 0]);
        }

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              transform: `translateX(${translateX}px) translateY(${offset.y}px) rotate(${rotate}deg) scale(${scale})`,
              zIndex: SLIDES.length - i,
              opacity,
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
                  borderRadius: 2, // Photo itself has sharp/slight radius
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
export const ChuaNgocHoangComposition2: React.FC = () => {
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
    <AbsoluteFill style={{ backgroundColor: "#f6f3ee" }}>
      {/* Background gradient: Warmer cream look */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 40%, #fdfcfb 0%, #f6f3ee 100%)",
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

export default ChuaNgocHoangComposition2;
