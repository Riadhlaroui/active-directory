"use client";

import { cn } from "@/lib/utils";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { Project } from "@/lib/types/project";
import { SyncProvider } from "@/lib/sync-context";
import { SyncBanner } from "@/components/sync-banner";
import { useSync } from "@/lib/sync-context";

function ShellContent({
	children,
	projects,
}: {
	children: React.ReactNode;
	projects: Project[];
}) {
	const { state } = useSync();
	const bannerVisible = state.status !== "idle";

	return (
		<SidebarProvider
			className={cn(
				"[--app-wrapper-max-width:80rem]",
				"transition-[padding-top] duration-300 ease-out",
				bannerVisible ? "pt-9" : "pt-0",
			)}
		>
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

export function AppShell({
	children,
	projects,
}: {
	children: React.ReactNode;
	projects: Project[];
}) {
	return (
		<SyncProvider>
			<SyncBanner />
			<ShellContent projects={projects}>{children}</ShellContent>
		</SyncProvider>
	);
}
