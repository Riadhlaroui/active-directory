import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";

export function CustomSidebarTrigger() {
	return (
		<Tooltip delayDuration={1000}>
			<TooltipTrigger asChild>
				<SidebarTrigger />
			</TooltipTrigger>
		</Tooltip>
	);
}
