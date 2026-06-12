"use client";

import { useState, useEffect } from "react";

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<"dark" | "light">("dark");

	useEffect(() => {
		const root = document.documentElement;
		if (theme === "dark") {
			root.classList.add("dark");
		} else {
			root.classList.remove("dark");
		}
	}, [theme]);

	return <>{children}</>;
}
