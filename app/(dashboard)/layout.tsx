import { AppShell } from "@/components/app-shell";
import { getFolders } from "@/lib/actions/projects";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const projects = await getFolders();
	return <AppShell projects={projects}>{children}</AppShell>;
}
