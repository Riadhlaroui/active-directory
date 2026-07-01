import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const { repo } = await req.json();
	const session = await getSession();
	if (!session.isLoggedIn) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	session.activeRepo = repo;
	await session.save();

	return NextResponse.json({ ok: true });
}
