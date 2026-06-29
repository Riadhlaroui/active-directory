"use client";

import { useState } from "react";
import Landing from "../landing/page";
import { Presentation } from "@/components/presentation/presentation";

type Theme = "dark" | "light";

export default function PresentationPage() {
	const [started, setStarted] = useState(false);
	const [theme, setTheme] = useState<Theme>("dark");

	return started ? (
		<Presentation
			onExit={() => setStarted(false)}
			theme={theme}
			setTheme={setTheme}
		/>
	) : (
		<Landing
			onStart={() => setStarted(true)}
			theme={theme}
			setTheme={setTheme}
		/>
	);
}
