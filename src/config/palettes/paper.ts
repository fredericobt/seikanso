import type { Palette } from "../theme";

export const paper: Palette = {
	name: "Paper",
	colors: {
		color1: "hsl(0 4% 93%)",
		color6: "hsl(230 8% 13%)",
		/** Mix ratios: [color1%, color6%] */
		mix2: [93, 7],
		mix3: [90, 10],
		mix4: [80, 20],
		mix5: [36, 64],
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
