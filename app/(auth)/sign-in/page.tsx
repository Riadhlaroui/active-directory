"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Repo, Step } from "@/lib/types/signin";

export default function SetupPage() {
	const [step, setStep] = useState<Step>("pick");
	const [repos, setRepos] = useState<Repo[]>([]);
	const [selected, setSelected] = useState<Repo | null>(null);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	async function loadRepos() {
		setLoading(true);
		const res = await fetch("/api/repos");
		const data = await res.json();
		setRepos(data);
		setLoading(false);
	}

	async function confirmRepo() {
		if (!selected) return;
		setLoading(true);
		await fetch("/api/repos/select", {
			method: "POST",
			body: JSON.stringify({ repo: selected.full_name }),
			headers: { "Content-Type": "application/json" },
		});
		router.push("/dashboard");
	}
}
