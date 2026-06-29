import { AppShell } from "@/components/app-shell";
import { getProjects } from "@/lib/actions/projects";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const projects = await getProjects();
	return <AppShell projects={projects}>{children}</AppShell>;
}
