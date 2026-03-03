import React from "react";
import { AbsoluteFill, interpolate, Easing } from "remotion";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";

// ─── Types ────────────────────────────────────────────────────────────────────
export type PageTurnDirection = "from-right" | "from-left";

export type PageTurnProps = {
  direction?: PageTurnDirection;
  perspective?: number;
};

// ─── Page Turn Presentation Component ─────────────────────────────────────────
const PageTurn: React.FC<
  TransitionPresentationComponentProps<PageTurnProps>
> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps: { direction = "from-right", perspective = 1600 },
}) => {
  const easedProgress = interpolate(
    presentationProgress,
    [0, 1],
    [0, 1],
    { easing: Easing.inOut(Easing.cubic) },
  );

  if (presentationDirection === "exiting") {
    return <ExitingPage progress={easedProgress} direction={direction} perspective={perspective}>{children}</ExitingPage>;
  }

  return <EnteringPage progress={easedProgress} direction={direction}>{children}</EnteringPage>;
};

// ─── Exiting Page (the page that curls/turns away) ────────────────────────────
const ExitingPage: React.FC<{
  progress: number;
  direction: PageTurnDirection;
  perspective: number;
  children: React.ReactNode;
}> = ({ progress, direction, perspective, children }) => {
  const rotation = interpolate(progress, [0, 1], [0, -150]);
  const scale = interpolate(progress, [0, 0.5, 1], [1, 0.97, 0.95]);
  const originX = direction === "from-right" ? "left" : "right";

  // Fold shadow on the turning page
  const foldShadowOpacity = interpolate(
    progress,
    [0, 0.3, 0.7, 1],
    [0, 0.35, 0.5, 0],
  );

  // Edge highlight
  const highlightOpacity = interpolate(
    progress,
    [0, 0.2, 0.5, 0.8, 1],
    [0, 0.6, 0.8, 0.4, 0],
  );
  const edgeWidth = interpolate(progress, [0, 0.5, 1], [0, 8, 3]);

  return (
    <AbsoluteFill
      style={{
        perspective,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          transformOrigin: `${originX} center`,
          transform: `rotateY(${rotation}deg) scale(${scale})`,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        {children}

        {/* Fold shadow gradient on the turning page */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(
              to ${direction === "from-right" ? "left" : "right"},
              rgba(0,0,0,${foldShadowOpacity * 0.6}) 0%,
              rgba(0,0,0,${foldShadowOpacity * 0.3}) 30%,
              transparent 100%
            )`,
            pointerEvents: "none",
          }}
        />

        {/* Light edge highlight */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            [direction === "from-right" ? "left" : "right"]: -edgeWidth / 2,
            width: edgeWidth,
            background: `rgba(255,255,255,${highlightOpacity})`,
            boxShadow: `0 0 ${edgeWidth * 2}px rgba(255,255,255,${highlightOpacity * 0.5})`,
            pointerEvents: "none",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Entering Page (revealed underneath) ──────────────────────────────────────
const EnteringPage: React.FC<{
  progress: number;
  direction: PageTurnDirection;
  children: React.ReactNode;
}> = ({ progress, direction, children }) => {
  // KEY FIX: The entering page starts hidden and fades in during the transition.
  // It begins appearing at 30% progress so there's always content visible
  // underneath while the page turns, avoiding transparent gaps.
  const opacity = interpolate(progress, [0, 0.3, 0.7], [0, 0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = interpolate(progress, [0.3, 1], [0.97, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const brightness = interpolate(progress, [0.3, 1], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Cast shadow from the turning page
  const castShadowOpacity = interpolate(
    progress,
    [0, 0.3, 0.7, 1],
    [0, 0.4, 0.3, 0],
  );
  const castShadowWidth = interpolate(progress, [0, 0.5, 1], [0, 200, 50]);

  return (
    <AbsoluteFill
      style={{
        opacity,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          transform: `scale(${scale})`,
          filter: `brightness(${brightness})`,
        }}
      >
        {children}

        {/* Shadow cast by the turning page */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            [direction === "from-right" ? "left" : "right"]: 0,
            width: castShadowWidth,
            background: `linear-gradient(
              to ${direction === "from-right" ? "right" : "left"},
              rgba(0,0,0,${castShadowOpacity}) 0%,
              rgba(0,0,0,${castShadowOpacity * 0.3}) 40%,
              transparent 100%
            )`,
            pointerEvents: "none",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Factory Function ─────────────────────────────────────────────────────────
/**
 * @description A realistic book page-turn transition.
 * The exiting page curls away from right to left (or left to right),
 * revealing the entering page underneath with shadows and depth.
 */
export const pageTurn = (
  props?: PageTurnProps,
): TransitionPresentation<PageTurnProps> => {
  return {
    component: PageTurn,
    props: props ?? {},
  };
};
