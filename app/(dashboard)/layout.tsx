import { AppShell } from "@/components/app-shell";
import { getFolders } from "@/lib/actions/projects";

import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getSession();

	if (!session.isLoggedIn) redirect("/sign-in");
	if (!session.activeRepo) redirect("/setup");

	const projects = await getFolders();
	return <AppShell projects={projects}>{children}</AppShell>;
}
