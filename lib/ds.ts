export const PJS = "'Plus Jakarta Sans', sans-serif";
export const MRP = "'Manrope', sans-serif";

export const light = {
  bg:         "#fff8f5",
  bgAlt:      "#fff1e9",
  bgMuted:    "#feeade",
  card:       "#ffffff",
  border:     "#dfc0b5",
  text:       "#231a13",
  textSub:    "#58423a",
  textMuted:  "#8b7168",
  primary:    "#c4501a",
  onPrimary:  "#ffffff",
  teal:       "#436464",
  green:      "#456348",
  error:      "#ba1a1a",
  sidebar:    "#2d1a0e",
  sidebarActive: "#c4501a",
};

export const dark = {
  bg:         "#1c1009",
  bgAlt:      "#231410",
  bgMuted:    "#2d1a0e",
  card:       "#261c13",
  border:     "rgba(223,192,181,0.14)",
  text:       "#fff8f5",
  textSub:    "#ffede3",
  textMuted:  "#dfc0b5",
  primary:    "#ffb599",
  onPrimary:  "#370e00",
  teal:       "#aacdcd",
  green:      "#c9ebc8",
  error:      "#ffdad6",
  sidebar:    "#140a04",
  sidebarActive: "#c4501a",
};

export type DS = typeof light;

export function shadow(isDark: boolean, level: 1 | 2 | 3 = 1) {
  const alpha = isDark ? [0.4, 0.5, 0.6][level - 1] : [0.06, 0.1, 0.16][level - 1];
  return `0 ${[2, 4, 8][level - 1]}px ${[16, 24, 48][level - 1]}px rgba(35,26,19,${alpha})`;
}
