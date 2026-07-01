import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
	const session = await getSession();
	if (!session.isLoggedIn) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const res = await fetch(
		"https://api.github.com/user/repos?sort=updated&per_page=100&type=all",
		{
			headers: {
				Authorization: `Bearer ${session.githubToken}`,
				Accept: "application/vnd.github+json",
			},
		},
	);

	const repos = await res.json();
	return NextResponse.json(repos);
}
