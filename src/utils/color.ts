import { UAV } from "@/types";

export function stringToNeonColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Use the modulo operator to get a hue value between 0 and 360
  // The bitwise operation ">>> 0" ensures the number is a positive 32-bit integer
  const hue = (hash % 360 + 360) % 360;

  // Set high saturation and lightness for a vibrant neon look
  const saturation = 90; // A high saturation value
  const lightness = 60;   // A medium-to-high lightness value to avoid it being too dark or too white

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// Function to determine color based on a UAV status
export function getUAVColor(uav: UAV) {
  switch (uav.status) {
    case "active":
      return "hsl(120, 100%, 50%)"; // Green for active UAVs
    case "inactive":
      return "hsl(0, 0%, 50%)"; // Gray for inactive UAVs
    case "low-battery":
      return "hsl(45, 100%, 50%)"; // Yellow for low-battery UAVs
    case "warning":
      return "hsl(30, 100%, 50%)"; // Orange for warning state
    case "error":
      return "hsl(0, 100%, 50%)"; // Red for error state
    default:
      return "hsl(0, 0%, 100%)"; // Fallback to white
  }
}
