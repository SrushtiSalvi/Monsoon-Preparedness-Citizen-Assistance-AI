/**
 * Design Tokens - "Monsoon Instrument Panel"
 * A field-instrument aesthetic (barometers, rain gauges, harbor signage)
 * rather than a generic admin dashboard.
 */

export const colors = {
  // Primary brand colors
  ink: "#0B2035", // Deep navy
  inkSoft: "#123049",
  teal: "#0E6E68", // Primary brand teal
  tealDeep: "#0A4F4B",
  tealSoft: "#E4F1EF", // Light teal background

  // Semantic colors
  rain: "#2E7FB8", // Rain blue
  cloudBg: "#EEF3F4", // Cloud gray
  mist: "#FFFFFF", // White

  // Neutral palette
  slate: "#516775",
  slateLight: "#8CA0AB",

  // Status colors
  amber: "#C8850A", // Warning/medium
  amberSoft: "#FBF0DC",
  coral: "#C04A3B", // Danger/high
  coralSoft: "#FBE7E3",
  green: "#2C8A63", // Success/low
  greenSoft: "#E3F3EA",

  // Utility
  border: "#DCE6E7",
  black: "#000000",
};

export const typography = {
  // Font families
  heading: "'Space Grotesk', sans-serif",
  body: "'Inter', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

export const spacing = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  xxl: "32px",
  xxxl: "48px",
};

export const borderRadius = {
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  full: "9999px",
};

export const shadows = {
  xs: "0 1px 2px rgba(11, 32, 53, 0.04)",
  sm: "0 2px 4px rgba(11, 32, 53, 0.08)",
  md: "0 4px 8px rgba(11, 32, 53, 0.12)",
  lg: "0 8px 16px rgba(11, 32, 53, 0.16)",
};

export const riskLevels = {
  low: { level: "Low", color: colors.green, bg: colors.greenSoft },
  medium: { level: "Medium", color: colors.amber, bg: colors.amberSoft },
  high: { level: "High", color: colors.coral, bg: colors.coralSoft },
  severe: { level: "Severe", color: colors.coral, bg: colors.coralSoft },
};

export const priorities = {
  high: colors.coral,
  medium: colors.amber,
  low: colors.green,
};
