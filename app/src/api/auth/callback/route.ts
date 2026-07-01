import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET(req: NextRequest) {
	const code = req.nextUrl.searchParams.get("code");
	if (!code) return NextResponse.redirect("/sign-in?error=no_code");

	const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify({
			client_id: process.env.GITHUB_CLIENT_ID,
			client_secret: process.env.GITHUB_CLIENT_SECRET,
			code,
			redirect_uri: `${process.env.APP_URL}/api/auth/callback`,
		}),
	});

	const { access_token, error } = await tokenRes.json();
	if (error || !access_token) {
		return NextResponse.redirect("/sign-in?error=oauth_failed");
	}

	const userRes = await fetch("https://api.github.com/user", {
		headers: { Authorization: `Bearer ${access_token}` },
	});
	const user = await userRes.json();

	const session = await getSession();
	session.isLoggedIn = true;
	session.githubToken = access_token;
	session.userId = String(user.id);
	session.githubUsername = user.login;
	session.activeRepo = null;
	await session.save();

	return NextResponse.redirect(`${process.env.APP_URL}/setup`);
}
