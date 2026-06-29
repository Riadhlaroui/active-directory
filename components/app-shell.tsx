import { cn } from "@/lib/utils";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { Project } from "@/lib/types/project";

export function AppShell({
	children,
	projects,
}: {
	children: React.ReactNode;
	projects: Project[];
}) {
	return (
		<SidebarProvider className={cn("[--app-wrapper-max-width:80rem]")}>
			<AppSidebar projects={projects} />
			<SidebarInset>
				<AppHeader />
				<div
					className={cn(
						"flex flex-1 flex-col p-4 md:p-6",
						"mx-auto w-full max-w-(--app-wrapper-max-width)",
					)}
				>
					{children}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
