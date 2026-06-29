"use client";

import { cn } from "@/lib/utils";
import { LogoIcon } from "@/components/logo";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { footerNavLinks, navGroups } from "@/components/app-shared";
import { NavGroup } from "@/components/nav-group";
import { NavProjects } from "./nav-projects";
import { Project } from "@/lib/types/project";

export function AppSidebar({ projects }: { projects: Project[] }) {
	return (
		<Sidebar
			className={cn(
				"*:data-[slot=sidebar-inner]:bg-background",
				"*:data-[slot=sidebar-inner]:dark:bg-[radial-gradient(60%_18%_at_10%_0%,--theme(--color-foreground/.08),transparent)]",
				"**:data-[slot=sidebar-menu-button]:[&>span]:text-foreground/75",
			)}
			collapsible="icon"
			variant="sidebar"
		>
			<SidebarHeader className="h-14 justify-center border-b px-2">
				<SidebarMenuButton asChild>
					<a href="#link">
						<LogoIcon />
					</a>
				</SidebarMenuButton>
			</SidebarHeader>
			<SidebarContent>
				{navGroups.map((group, index) => (
					<NavGroup key={`sidebar-group-${index}`} {...group} />
				))}
				<NavProjects initial={projects} />
			</SidebarContent>
			<SidebarFooter className="gap-0 p-0">
				<SidebarMenu className="border-t p-2">
					{footerNavLinks.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								asChild
								className="text-muted-foreground"
								isActive={item.isActive}
								size="sm"
							>
								<a href={item.path}>
									{item.icon}
									<span>{item.title}</span>
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
