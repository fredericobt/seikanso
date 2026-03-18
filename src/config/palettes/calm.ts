import type { Palette } from "../theme";

export const calm: Palette = {
	name: "Calm",
	colors: {
		color1: "hsl(39 61% 87%)",
		color6: "hsl(30 15% 11%)",
		mix2: [95, 5],
		mix3: [90, 10],
		mix4: [80, 20],
		mix5: [40, 60],
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
