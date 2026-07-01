import { getIronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export type SessionData = {
	userId: string;
	githubToken: string;
	githubUsername: string;
	activeRepo: string | null;
	isLoggedIn: boolean;
};

const sessionOptions: SessionOptions = {
	password: process.env.SESSION_SECRET!,
	cookieName: "gws-session",
	cookieOptions: {
		secure: process.env.NODE_ENV === "production",
		httpOnly: true,
	},
};

export async function getSession() {
	const session = await getIronSession<SessionData>(
		await cookies(),
		sessionOptions,
	);
	return session;
}
