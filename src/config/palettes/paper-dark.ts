import type { Palette } from "../theme";

export const paperDark: Palette = {
	name: "Paper Dark",
	colors: {
		color1: "#1F2023",
		color6: "#F1F1F0",
		mix2: [95, 5],
		mix3: [90, 10],
		mix4: [80, 20],
		mix5: [25, 75],
	},
	dark: {
		color1Dark: "var(--color-6)",
		color6Dark: "var(--color-1)",
		mix2: [93, 7],
		mix3: [90, 10],
		mix4: [80, 20],
		mix5: [36, 64],
	},
};
