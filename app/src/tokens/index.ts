import type { Theme } from "../types/theme";

export const themes = {
	dark: {
		bg: "#050a0e",
		bgGrad: "radial-gradient(ellipse at 50% 0%, #0d2218 0%, #050a0e 70%)",
		presGrad: "radial-gradient(ellipse at 50% 0%, #0a1520 0%, #050a0e 80%)",
		text: "#cbd5e1",
		textStrong: "#f1f5f9",
		textMuted: "#64748b",
		textDim: "#475569",
		accent: "#34d399",
		dark: "#0E1012",
		db: "#1F75FE",
		border: "#0f2030",
		borderMid: "#1e293b",
		cardBg: "#060e18",
		cardBg2: "#0a1520",
		codeBg: "#060e18",
		slideLines: "rgba(0,255,100,0.012)",
		termColor: "#38bdf8",
		bodyText: "#94a3b8",
	},
	light: {
		bg: "#f8fafc",
		bgGrad: "radial-gradient(ellipse at 50% 0%, #e8f5f0 0%, #f8fafc 70%)",
		presGrad: "radial-gradient(ellipse at 50% 0%, #eef6f2 0%, #f8fafc 80%)",
		text: "#334155",
		textStrong: "#0f172a",
		textMuted: "#64748b",
		textDim: "#94a3b8",
		accent: "#059669",
		dark: "#0E1012",
		db: "#1F75FE",
		border: "#e2e8f0",
		borderMid: "#cbd5e1",
		cardBg: "#ffffff",
		cardBg2: "#f1f5f9",
		codeBg: "#f1f5f9",
		slideLines: "rgba(0,100,50,0.04)",
		termColor: "#0284c7",
		bodyText: "#475569",
	},
} satisfies Record<Theme, object>;

export type Tokens = typeof themes.dark;

export function getTokens(theme: Theme): Tokens {
	return themes[theme];
}
