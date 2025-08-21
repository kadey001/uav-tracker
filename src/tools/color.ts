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