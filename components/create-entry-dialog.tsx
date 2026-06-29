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
import { FileIcon, FolderIcon, FolderOpenIcon } from "lucide-react";
import { createFileInProject, createProject } from "@/lib/actions/projects";
import { DecorIcon } from "./ui/decor-icon";
import Image from "next/image";

const FILE_EXTENSIONS = [
	{ ext: ".md", label: "Markdown", icon: "/icons/MD.png" },
	{ ext: ".txt", label: "Text", icon: "/icons/TXT.png" },
	{ ext: ".ts", label: "TypeScript", icon: "/icons/TS.png" },
	{ ext: ".tsx", label: "TSX", icon: "/icons/TSX.png" },
	{ ext: ".js", label: "JavaScript", icon: "/icons/JS.png" },
	{ ext: ".jsx", label: "JSX", icon: "/icons/JSX.png" },
	{ ext: ".json", label: "JSON", icon: "/icons/JSON.png" },
	{ ext: ".css", label: "CSS", icon: "/icons/CSS.png" },
	{ ext: ".html", label: "HTML", icon: "/icons/HTML.png" },
	{ ext: ".py", label: "Python", icon: "/icons/PY.png" },
	{ ext: ".sh", label: "Shell", icon: "/icons/SH.png" },
];
type TreeNode = {
	id: string; // slug used in GitHub path
	name: string; // display name
	depth: number;
	children?: TreeNode[];
};

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** Flat list of top-level project folders */
	projects: { id: string; name: string }[];
	onCreated?: () => void;
};

export function CreateEntryDialog({
	open,
	onOpenChange,
	projects,
	onCreated,
}: Props) {
	const [type, setType] = useState<"file" | "folder">("file");
	const [name, setName] = useState("");
	const [ext, setExt] = useState(".md");
	const [location, setLocation] = useState<string>("");
	const [loading, setLoading] = useState(false);

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

	async function handleCreate() {
		if (!name.trim()) return;
		setLoading(true);
		try {
			if (type === "folder") {
				const folderPath = location
					? `${location}/${name.trim()}/.gitkeep`
					: `${name.trim()}/.gitkeep`;
				await createFileInProject("", folderPath, "");
			} else {
				const filePath = location
					? `${location}/${name.trim()}${ext}`
					: `${name.trim()}${ext}`;
				await createFileInProject(
					"",
					filePath,
					getInitialContent(name.trim(), ext),
				);
			}
			onCreated?.();
			onOpenChange(false);
			setName("");
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="w-105 bg-[radial-gradient(50%_80%_at_25%_0%,--theme(--color-foreground/.1),transparent)] rounded-none">
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

				<div className="px-5 py-4 flex flex-col gap-4">
					<div className="grid grid-cols-2 gap-2">
						<button
							onClick={() => setType("file")}
							className={cn(
								"flex flex-col items-center gap-1.5 p-3 rounded-lg border text-sm font-medium transition-colors",
								type === "file"
									? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
									: "border-border bg-muted/40 text-muted-foreground hover:bg-muted",
							)}
						>
							<FileIcon size={20} />
							File
						</button>
						<button
							onClick={() => setType("folder")}
							className={cn(
								"flex flex-col items-center gap-1.5 p-3 rounded-lg border text-sm font-medium transition-colors",
								type === "folder"
									? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
									: "border-border bg-muted/40 text-muted-foreground hover:bg-muted",
							)}
						>
							<FolderIcon size={20} />
							Folder
						</button>
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="text-xs text-muted-foreground">
							{type === "file" ? "File name" : "Folder name"}
						</label>
						<Input
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder={type === "file" ? "index" : "my-folder"}
							autoFocus
						/>
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
										<Image
											src={icon}
											alt={label}
											width={20}
											height={20}
											className="shrink-0"
											onError={(e) => {
												e.currentTarget.style.display = "none";
											}}
										/>
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
						<label className="text-xs text-muted-foreground">Location</label>
						<div className="border rounded-md overflow-hidden max-h-36 overflow-y-auto text-sm">
							<LocationRow
								icon={<FolderOpenIcon size={13} />}
								label="/ (root)"
								depth={0}
								selected={location === ""}
								onClick={() => setLocation("")}
							/>
							{tree.map((node) => (
								<LocationRow
									key={node.id}
									icon={<FolderIcon size={13} />}
									label={node.name}
									depth={1}
									selected={location === node.id}
									onClick={() => setLocation(node.id)}
								/>
							))}
						</div>
					</div>

					<div className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted border text-xs font-mono text-muted-foreground">
						<span className="text-muted-foreground/50">→</span>
						<span className="truncate">{previewPath || "—"}</span>
					</div>
				</div>

				<DialogFooter className="px-5 py-3 ">
					<Button
						variant="ghost"
						className="mr-auto"
						size="lg"
						onClick={() => onOpenChange(false)}
					>
						Cancel
					</Button>
					<Button
						size="lg"
						onClick={handleCreate}
						disabled={!name.trim() || loading}
					>
						{loading
							? "Creating…"
							: type === "file"
								? "Create file"
								: "Create folder"}
					</Button>
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
				"w-full flex items-center gap-1.5 px-2 py-1.5 text-left text-xs border-b last:border-0 transition-colors",
				selected
					? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
					: "text-muted-foreground hover:bg-muted",
			)}
			style={{ paddingLeft: `${8 + depth * 16}px` }}
		>
			{icon}
			{label}
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
