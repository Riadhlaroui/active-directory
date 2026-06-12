"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	UserIcon,
	SettingsIcon,
	LogOutIcon,
	SunIcon,
	MoonIcon,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "../app/src/context/theme-context";

const user = {
	name: "Arc",
	email: "arc@gmail.com",
};

export function NavUser() {
	const { theme, setTheme } = useTheme();
	const isDark = theme === "dark";

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Avatar className="size-8 cursor-pointer">
					<AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-60">
				<DropdownMenuItem className="flex items-center justify-start gap-2">
					<DropdownMenuLabel className="flex items-center gap-3">
						<Avatar className="size-10">
							<AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
						</Avatar>
						<div>
							<span className="font-medium text-foreground">{user.name}</span>
							<br />
							<div className="max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-muted-foreground text-xs">
								{user.email}
							</div>
						</div>
					</DropdownMenuLabel>
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<DropdownMenuItem>
						<UserIcon />
						Account
					</DropdownMenuItem>
					<DropdownMenuItem>
						<SettingsIcon />
						Settings
					</DropdownMenuItem>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				<DropdownMenuItem
					onSelect={(e) => e.preventDefault()}
					onClick={() => setTheme(isDark ? "light" : "dark")}
					className="flex items-center justify-between gap-2 cursor-pointer"
				>
					<div className="flex items-center gap-2">
						{isDark ? <MoonIcon size={16} /> : <SunIcon size={16} />}
						<span>Dark mode</span>
					</div>
					<Switch
						checked={isDark}
						onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
						onClick={(e) => e.stopPropagation()}
					/>
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<DropdownMenuItem
						className="w-full cursor-pointer"
						variant="destructive"
					>
						<LogOutIcon />
						Log out
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
