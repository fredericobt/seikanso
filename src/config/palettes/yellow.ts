import type { Palette } from "../theme";

export const yellow: Palette = {
	name: "Yellow",
	colors: {
		color1: "hsl(0 0% 100%)",
		color6: "hsl(0 0% 0%)",
		mix2: [96, 4],
		mix3: [93, 7],
		mix4: [80, 20],
		mix5: [30, 70],
		accent: "#FFAC00",
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
