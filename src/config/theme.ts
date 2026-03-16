import { paper } from "./palettes/paper";

/* ── Types ── */

export interface PaletteColors {
	color1: string;
	color6: string;
	/** color-mix ratios for intermediate colors: [color1%, color6%] */
	mix2: [number, number];
	mix3: [number, number];
	mix4: [number, number];
	mix5: [number, number];
	/** Optional accent color (for blue, green, red, yellow palettes) */
	accent?: string;
}

export interface PaletteDark {
	color1Dark: string;
	color6Dark: string;
	mix2: [number, number];
	mix3: [number, number];
	mix4: [number, number];
	mix5: [number, number];
}

export interface Palette {
	name: string;
	colors: PaletteColors;
	dark: PaletteDark;
}

export type FontPreset = "inter" | "monospace" | "serif";

export interface FontConfig {
	name: string;
	family: string;
	bodySize: string;
	bodyLineHeight: string;
	headingWeight: string;
	headingLineHeight: string;
}

/* ── Font presets ── */

export const fontPresets: Record<FontPreset, FontConfig> = {
	inter: {
		name: "Inter",
		family: '"Inter", sans-serif',
		bodySize: "0.925rem",
		bodyLineHeight: "1.6",
		headingWeight: "550",
		headingLineHeight: "1.45",
	},
	monospace: {
		name: "Geist Mono",
		family: '"Geist Mono", monospace',
		bodySize: "0.85rem",
		bodyLineHeight: "1.7",
		headingWeight: "600",
		headingLineHeight: "1.4",
	},
	serif: {
		name: "Noto Serif",
		family: '"Noto Serif", serif',
		bodySize: "0.925rem",
		bodyLineHeight: "1.6",
		headingWeight: "550",
		headingLineHeight: "1.45",
	},
};

/* ── Active theme configuration ── */

/** Change these to switch palette/font across the entire site */
export const activePalette: Palette = paper;
export const activeFont: FontPreset = "inter";

/* ── Spacing tokens (matching WP theme.json) ── */

export const spacing = {
	xs: "8px",
	sm: "16px",
	md: "24px",
	lg: "32px",
	xl: "48px",
	"2xl": "60px",
	"3xl": "72px",
} as const;

/* ── Layout tokens ── */

export const layout = {
	contentWidth: "440px",
	wideWidth: "640px",
} as const;

/* ── Font sizes (fluid, matching WP theme.json) ── */

export const fontSizes = {
	small: "0.885rem",
	medium: "clamp(0.885rem, 0.85rem + 0.15vw, 0.925rem)",
	large: "clamp(0.925rem, 0.9rem + 0.15vw, 1rem)",
	xLarge: "clamp(1rem, 0.95rem + 0.2vw, 1.075rem)",
} as const;
