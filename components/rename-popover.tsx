"use client";

import { useEffect, useRef, useState } from "react";
import { CheckIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
	defaultValue: string;
	onCommit: (value: string) => void;
	onCancel: () => void;
};

export function RenamePopover({ defaultValue, onCommit, onCancel }: Props) {
	const [value, setValue] = useState(defaultValue);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		inputRef.current?.focus();
		inputRef.current?.select();
	}, []);

	function handleKeyDown(e: React.KeyboardEvent) {
		e.stopPropagation();
		if (e.key === "Enter") {
			e.preventDefault();
			const trimmed = value.trim();
			if (trimmed && trimmed !== defaultValue) {
				onCommit(trimmed);
			} else {
				onCancel();
			}
		}
		if (e.key === "Escape") {
			e.preventDefault();
			onCancel();
		}
	}

	function handleCommit() {
		const trimmed = value.trim();
		if (trimmed && trimmed !== defaultValue) {
			onCommit(trimmed);
		} else {
			onCancel();
		}
	}

	return (
		<div className="flex items-center gap-1 px-2 py-1 w-full">
			<div
				className={cn(
					"flex flex-1 items-center gap-1.5 min-w-0",
					"border border-blue-500 bg-blue-950/30 rounded-sm",
					"ring-1 ring-blue-500/30",
					"px-1.5 py-0.5",
				)}
			>
				<input
					ref={inputRef}
					value={value}
					onChange={(e) => setValue(e.target.value)}
					onKeyDown={handleKeyDown}
					className="flex-1 min-w-0 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
				/>
			</div>
			<button
				onClick={handleCommit}
				className="shrink-0 flex items-center justify-center size-5 rounded hover:bg-green-500/20 text-green-500 transition-colors"
				aria-label="Confirm rename"
			>
				<CheckIcon size={12} />
			</button>
			<button
				onClick={onCancel}
				className="shrink-0 flex items-center justify-center size-5 rounded hover:bg-red-500/20 text-red-500 transition-colors"
				aria-label="Cancel rename"
			>
				<XIcon size={12} />
			</button>
		</div>
	);
}
