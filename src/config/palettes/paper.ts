import type { Palette } from "../theme";

export const paper: Palette = {
	name: "Paper",
	colors: {
		color1: "hsl(0 0% 100%)",
		color6: "hsl(0 0% 5%)",
		/** Mix ratios: [color1%, color6%] */
		mix2: [96, 4],
		mix3: [90, 10],
		mix4: [80, 20],
		mix5: [32, 68],
	},
	dark: {
		color1Dark: "hsl(0 0% 10%)",
		color6Dark: "hsl(0 0% 100% / 85%)",
		mix2: [4, 96],
		mix3: [12, 88],
		mix4: [25, 75],
		mix5: [50, 50],
	},
};
