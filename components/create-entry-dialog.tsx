"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
	FileIcon,
	FolderIcon,
	FolderOpenIcon,
	AlertCircleIcon,
} from "lucide-react";
import { createFileInFolder } from "@/lib/actions/projects";
import { DecorIcon } from "./ui/decor-icon";
import { Icon } from "@iconify/react";
import { useSync } from "@/lib/sync-context";
import { getErrorMessage } from "@/lib/github-error";
import { validateEntryName } from "@/lib/validation";
import { GitHubError } from "@/lib/github-error";

const FILE_EXTENSIONS = [
	{ ext: ".md", label: "Markdown", icon: "vscode-icons:file-type-markdown" },
	{ ext: ".txt", label: "Text", icon: "vscode-icons:file-type-text" },
	{
		ext: ".ts",
		label: "TypeScript",
		icon: "vscode-icons:file-type-typescript-official",
	},
	{ ext: ".tsx", label: "TSX", icon: "vscode-icons:file-type-reactts" },
	{
		ext: ".js",
		label: "JavaScript",
		icon: "vscode-icons:file-type-js-official",
	},
	{ ext: ".jsx", label: "JSX", icon: "vscode-icons:file-type-reactjs" },
	{ ext: ".json", label: "JSON", icon: "vscode-icons:file-type-json" },
	{ ext: ".css", label: "CSS", icon: "vscode-icons:file-type-css" },
	{ ext: ".html", label: "HTML", icon: "vscode-icons:file-type-html" },
	{ ext: ".py", label: "Python", icon: "vscode-icons:file-type-python" },
	{ ext: ".sh", label: "Shell", icon: "vscode-icons:file-type-shell" },
];
type TreeNode = {
	id: string;
	name: string;
	depth: number;
	children?: TreeNode[];
};

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	projects: { id: string; name: string }[];
	onCreated?: () => void;
};

export function CreateEntryDialog({
	open,
	onOpenChange,
	projects,
	onCreated,
}: Props) {
	const [type, setType] = useState<"file" | "folder">("folder");
	const [name, setName] = useState("");
	const [ext, setExt] = useState(".md");
	const [location, setLocation] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const [nameError, setNameError] = useState<string | null>(null);
	const [submitError, setSubmitError] = useState<string | null>(null);

	const { startSync, finishSync } = useSync();

	const tree: TreeNode[] = projects.map((p) => ({
		id: p.id,
		name: p.name,
		depth: 0,
	}));

	const previewPath = buildPreviewPath(
		location,
		name,
		type === "file" ? ext : "",
	);

	function handleNameChange(value: string) {
		setName(value);
		setSubmitError(null);
		if (!value.trim()) {
			setNameError(null);
			return;
		}
		try {
			validateEntryName(value);
			setNameError(null);
		} catch (e) {
			setNameError(e instanceof GitHubError ? e.message : "Invalid name.");
		}
	}

	function handleTypeChange(next: "file" | "folder") {
		setType(next);
		setSubmitError(null);
	}

	async function handleCreate() {
		if (!name.trim() || nameError) return;
		setLoading(true);
		setSubmitError(null);

		const trimmedName = name.trim();
		const locationLabel = location
			? (projects.find((p) => p.id === location)?.name ?? location)
			: "root";

		try {
			if (type === "folder") {
				startSync(
					`Creating folder "${trimmedName}" in ${locationLabel}…`,
					"create",
				);
				const folderPath = location
					? `${location}/${trimmedName}/.gitkeep`
					: `${trimmedName}/.gitkeep`;
				await createFileInFolder("", folderPath, "", trimmedName);
			} else {
				startSync(
					`Creating "${trimmedName}${ext}" in ${locationLabel}…`,
					"create",
				);
				const filePath = location
					? `${location}/${trimmedName}${ext}`
					: `${trimmedName}${ext}`;
				await createFileInFolder(
					"",
					filePath,
					getInitialContent(trimmedName, ext),
					trimmedName,
				);
			}
			finishSync(true);
			onCreated?.();
			onOpenChange(false);
			setName("");
		} catch (e) {
			console.error(e);
			const message = getErrorMessage(e);
			finishSync(false, message);
			setSubmitError(message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				onInteractOutside={(e) => e.preventDefault()}
				onEscapeKeyDown={(e) => e.preventDefault()}
				className="min-w-125 h-fit bg-[radial-gradient(40%_50%_at_25%_0%,--theme(--color-foreground/.1),transparent)] rounded-none"
			>
				<div className="absolute -inset-y-4 -left-px w-px bg-border" />
				<div className="absolute -inset-y-4 -right-px w-px bg-border" />
				<div className="absolute -inset-x-4 -top-px h-px bg-border" />
				<div className="absolute -right-4 -bottom-px -left-4 h-px bg-border" />
				<DecorIcon className="size-3.5" position="top-left" />

				<DialogHeader className="">
					<DialogTitle className="text-sm font-medium">
						{type === "file" ? "Create new file" : "Create new folder"}
					</DialogTitle>
				</DialogHeader>

				<div className="px-2 py-2 flex flex-col gap-4">
					<div className="grid grid-cols-2 gap-2">
						<button
							onClick={() => handleTypeChange("folder")}
							className={cn(
								"flex flex-col items-center gap-1.5 p-3 border text-sm font-medium transition-colors",
								type === "folder"
									? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
									: "border-border bg-muted/40 text-muted-foreground hover:bg-muted",
							)}
						>
							<FolderIcon size={20} />
							Folder
						</button>
						<button
							onClick={() => handleTypeChange("file")}
							className={cn(
								"flex flex-col items-center gap-1.5 p-3 border text-sm font-medium transition-colors",
								type === "file"
									? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
									: "border-border bg-muted/40 text-muted-foreground hover:bg-muted",
							)}
						>
							<FileIcon size={20} />
							File
						</button>
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="text-xs text-muted-foreground">
							{type === "file" ? "File name" : "Folder name"}
						</label>
						<Input
							value={name}
							onChange={(e) => handleNameChange(e.target.value)}
							placeholder={type === "file" ? "index" : "My Folder"}
							autoFocus
							className={cn(
								nameError && "border-red-500 focus-visible:ring-red-500",
							)}
						/>
						{nameError && (
							<p className="flex items-center gap-1 text-xs text-red-500">
								<AlertCircleIcon size={12} className="shrink-0" />
								{nameError}
							</p>
						)}
					</div>

					{type === "file" && (
						<div className="flex flex-col gap-1.5">
							<label className="text-xs text-muted-foreground">Extension</label>
							<div className="grid grid-cols-4">
								{FILE_EXTENSIONS.map(({ ext: e, label, icon }) => (
									<button
										key={e}
										onClick={() => setExt(e)}
										className={cn(
											"flex items-center px-2 py-1.5 border text-left transition-colors",
											ext === e
												? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
												: "border-border text-muted-foreground hover:bg-muted hover:border-border-strong",
										)}
									>
										<Icon icon={icon} className="size-5 shrink-0" />
										<div className="flex flex-col min-w-0">
											<span className="text-[12px] font-mono leading-tight truncate">
												{e}
											</span>
											<span className="text-[10px] leading-tight text-muted-foreground truncate">
												{label}
											</span>
										</div>
									</button>
								))}
							</div>
						</div>
					)}

					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-medium text-muted-foreground ml-0.5">
							Location
						</label>

						<div className="flex flex-col border rounded-bl-md rounded-br-md shadow-sm bg-background overflow-hidden">
							<div
								className={cn(
									"max-h-36 overflow-y-auto",
									"[&::-webkit-scrollbar]:w-1.5",
									"[&::-webkit-scrollbar-track]:bg-transparent",
									"[&::-webkit-scrollbar-thumb]:bg-muted-foreground/20",
									"hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40 transition-colors",
								)}
							>
								<LocationRow
									icon={<FolderOpenIcon size={14} />}
									label="/ (root)"
									depth={0}
									selected={location === ""}
									onClick={() => setLocation("")}
								/>
								{tree.map((node) => (
									<LocationRow
										key={node.id}
										icon={<FolderIcon size={14} />}
										label={node.name}
										depth={1}
										selected={location === node.id}
										onClick={() => setLocation(node.id)}
									/>
								))}
							</div>

							<div className="flex items-center shrink-0 gap-2 px-3 py-2 bg-muted/50 border-t text-sm text-muted-foreground">
								<span className="text-muted-foreground/50">→</span>
								<span className="truncate">{previewPath || "—"}</span>
							</div>
						</div>
					</div>

					{submitError && (
						<div className="flex items-start gap-2 px-3 py-2 rounded-md bg-red-50 border border-red-200 text-xs text-red-600 dark:bg-red-950 dark:border-red-900 dark:text-red-400">
							<AlertCircleIcon size={14} className="shrink-0 mt-0.5" />
							<span>{submitError}</span>
						</div>
					)}
				</div>

				<DialogFooter className="px-5 py-3 rounded-none">
					<button
						className={cn(
							"h-10 px-6 bg-transparent hover:bg-muted  hover:text-foreground  border shadow-sm text-white transition-all",
							"disabled:opacity-50 disabled:cursor-not-allowed",
							"disabled:bg-muted/30 disabled:text-muted-foreground disabled:border-muted disabled:shadow-none",

							"disabled:hover:bg-muted/30 disabled:hover:text-muted-foreground",
						)}
						onClick={handleCreate}
						disabled={!name.trim() || !!nameError || loading}
					>
						{loading
							? "Creating…"
							: type === "file"
								? "Create file"
								: "Create folder"}
					</button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function LocationRow({
	icon,
	label,
	depth,
	selected,
	onClick,
}: {
	icon: React.ReactNode;
	label: string;
	depth: number;
	selected: boolean;
	onClick: () => void;
}) {
	return (
		<button
			onClick={onClick}
			className={cn(
				"w-full flex items-center gap-2 py-2 text-left text-xs border-b last:border-0 transition-all duration-200 outline-none",
				selected
					? "bg-[#252525] text-[#0072BB] font-medium"
					: "text-muted-foreground hover:bg-muted/50 hover:text-foreground focus-visible:bg-muted/50",
			)}
			style={{ paddingLeft: `${12 + depth * 16}px`, paddingRight: "12px" }}
		>
			<span
				className={cn(
					"shrink-0 transition-colors",
					selected ? "text-[#0072BB]" : "text-muted-foreground",
				)}
			>
				{icon}
			</span>
			<span className="truncate">{label}</span>
		</button>
	);
}
function buildPreviewPath(location: string, name: string, ext: string) {
	const n = name.trim();
	if (!n) return "";
	return location ? `${location}/${n}${ext}` : `${n}${ext}`;
}

function getInitialContent(name: string, ext: string): string {
	if (ext === ".md") return `# ${name}\n`;
	if (ext === ".json") return `{}\n`;
	if (ext === ".html")
		return `<!DOCTYPE html>\n<html>\n<head><title>${name}</title></head>\n<body>\n</body>\n</html>\n`;
	return "";
}
