"use client";

import { useSync } from "@/lib/sync-context";
import {
	RefreshCwIcon,
	CheckCircle2Icon,
	AlertCircleIcon,
	XIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function SyncBanner() {
	const { state, dismiss } = useSync();

	return (
		<div
			className={cn(
				"fixed top-0 left-0 right-0 z-100 flex items-center gap-2 px-4 py-1.5 text-sm font-medium border-b",
				"transition-transform duration-300 ease-out",
				state.status === "idle" ? "-translate-y-full" : "translate-y-0",
				state.status === "syncing" && "bg-muted text-muted-foreground",
				state.status === "success" &&
					"bg-green-50 text-green-600 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-900",
				state.status === "error" &&
					"bg-red-50 text-red-600 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-900",
			)}
		>
			{state.status === "syncing" && (
				<RefreshCwIcon size={13} className="animate-spin shrink-0" />
			)}
			{state.status === "success" && (
				<CheckCircle2Icon size={13} className="shrink-0" />
			)}
			{state.status === "error" && (
				<AlertCircleIcon size={13} className="shrink-0" />
			)}

			<span>{state.message}</span>

			<span className="ml-auto text-sm text-muted-foreground/70">gws</span>

			{(state.status === "error" || state.status === "success") && (
				<button
					onClick={dismiss}
					className="ml-1 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10"
					aria-label="Dismiss"
				>
					<XIcon size={12} />
				</button>
			)}
		</div>
	);
}
