import type { ReactNode } from "react";
import {
	LayoutGridIcon,
	UsersIcon,
	PlugIcon,
	HelpCircleIcon,
	BookOpenIcon,
} from "lucide-react";

export type SidebarNavItem = {
	title: string;
	path?: string;
	icon?: ReactNode;
	isActive?: boolean;
	subItems?: SidebarNavItem[];
};

export type SidebarNavGroup = {
	label?: string;
	items: SidebarNavItem[];
};

export const navGroups: SidebarNavGroup[] = [
	{
		items: [
			{
				title: "Dashboard",
				path: "/dashboard",
				icon: <LayoutGridIcon />,
				isActive: true,
			},
		],
	},
	{
		label: "Workspace",
		items: [
			{
				title: "Team",
				path: "/team",
				icon: <UsersIcon />,
			},
			{
				title: "Integrations",
				path: "/integrations",
				icon: <PlugIcon />,
			},
		],
	},
];

export const footerNavLinks: SidebarNavItem[] = [
	{
		title: "Help Center",
		path: "/help",
		icon: <HelpCircleIcon />,
	},
	{
		title: "Documentation",
		path: "/documentation",
		icon: <BookOpenIcon />,
	},
];

export const navLinks: SidebarNavItem[] = [
	...navGroups.flatMap((group) =>
		group.items.flatMap((item) =>
			item.subItems?.length ? [item, ...item.subItems] : [item],
		),
	),
	...footerNavLinks,
];
