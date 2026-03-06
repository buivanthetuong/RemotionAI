export const calculateAudioFrames = (
  durationInSeconds: number,
  fps: number = 30,
): number => {
  return Math.ceil(durationInSeconds * fps);
};

export const timeStringToSeconds = (timeString: string): number => {
  // Parses "HH:MM:SS" or "MM:SS" or "SS" format or raw seconds
  if (!timeString) return 0;

  if (typeof timeString === "number") return timeString;

  const parts = timeString.split(":").map(Number);

  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 1) {
    return parts[0];
  }

  return 0;
};
