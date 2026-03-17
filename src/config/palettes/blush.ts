import type { Palette } from "../theme";

export const blush: Palette = {
	name: "Blush",
	colors: {
		color1: "hsl(12 100% 98%)",
		color6: "hsl(12 85% 6%)",
		mix2: [95, 5],
		mix3: [90, 10],
		mix4: [80, 20],
		mix5: [50, 50],
	},
	dark: {
		color1Dark: "var(--color-6)",
		color6Dark: "var(--color-1)",
		mix2: [4, 96],
		mix3: [12, 88],
		mix4: [25, 75],
		mix5: [45, 55],
	},
};
