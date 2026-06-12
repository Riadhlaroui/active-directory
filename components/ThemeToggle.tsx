import React from "react";

type Theme = "dark" | "light";

const ThemeToggle = ({
	theme,
	setTheme,
}: {
	theme: Theme;
	setTheme: (t: Theme) => void;
}) => {
	const isDark = theme === "dark";

	return (
		<button
			onClick={() => setTheme(isDark ? "light" : "dark")}
			style={{
				display: "flex",
				alignItems: "center",
				gap: 10,
				background: "none",
				border: `1px solid var(--border)`, // was isDark ? "#1e293b" : "#cbd5e1"
				borderRadius: 999,
				padding: "6px 14px 6px 10px",
				cursor: "pointer",
				color: `var(--muted-foreground)`, // was isDark ? "#64748b" : "#475569"
				fontFamily: "'JetBrains Mono', monospace",
				fontSize: "0.72rem",
				letterSpacing: "0.1em",
				transition: "all 0.2s",
			}}
		>
			{/* Track */}
			<div
				style={{
					width: 36,
					height: 20,
					borderRadius: 999,
					background: `var(--muted)`, // was isDark ? "#0f2030" : "#e2e8f0"
					border: `1px solid var(--border)`, // was isDark ? "#1e293b" : "#cbd5e1"
					position: "relative",
					transition: "all 0.3s",
					flexShrink: 0,
				}}
			>
				{/* Thumb */}
				<div
					style={{
						position: "absolute",
						top: 2,
						left: isDark ? 2 : 16, // position still needs isDark (it's layout, not color)
						width: 14,
						height: 14,
						borderRadius: "50%",
						background: `var(--primary)`, // was isDark ? "#34d399" : "#f59e0b"
						transition: "left 0.3s, background 0.3s",
						boxShadow: `0 0 6px var(--ring)`, // was conditional colored glow
					}}
				/>
			</div>
			{isDark ? "🌙 DARK" : "☀ LIGHT"}
		</button>
	);
};

export default ThemeToggle;
