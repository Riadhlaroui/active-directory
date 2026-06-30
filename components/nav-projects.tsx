"use client";

import { useState, useRef, useEffect, startTransition } from "react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuGroup,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuShortcut,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
	BriefcaseIcon,
	ChevronRightIcon,
	PlusIcon,
	FolderIcon,
	FolderOpenIcon,
	MoreHorizontalIcon,
	PencilIcon,
	Trash2Icon,
	FileIcon,
	LoaderIcon,
} from "lucide-react";
import { Icon } from "@iconify/react";
import {
	createFolder,
	deleteFolder,
	renameFolder,
	getFolderFiles,
	deleteFileInFolder,
	getFolders,
	getRootFiles,
} from "@/lib/actions/projects";
import { GitHubEntry, Project, ProjectWithFiles } from "@/lib/types/project";
import { CreateEntryDialog } from "./create-entry-dialog";
import { useSync } from "@/lib/sync-context";
import { getErrorMessage } from "@/lib/github-error";
import { RenamePopover } from "./rename-popover";

function getFileIcon(filename: string): string {
	const ext = filename.includes(".")
		? filename.slice(filename.lastIndexOf("."))
		: "";

	const map: Record<string, string> = {
		".md": "vscode-icons:file-type-markdown",
		".txt": "vscode-icons:file-type-text",
		".ts": "vscode-icons:file-type-typescript-official",
		".tsx": "vscode-icons:file-type-reactts",
		".js": "vscode-icons:file-type-js-official",
		".jsx": "vscode-icons:file-type-reactjs",
		".json": "vscode-icons:file-type-json",
		".css": "vscode-icons:file-type-css",
		".html": "vscode-icons:file-type-html",
		".py": "vscode-icons:file-type-python",
		".sh": "vscode-icons:file-type-shell",
		".yml": "vscode-icons:file-type-yaml",
		".yaml": "vscode-icons:file-type-yaml",
		".env": "vscode-icons:file-type-dotenv",
		".sql": "vscode-icons:file-type-sql",
		".rs": "vscode-icons:file-type-rust",
		".go": "vscode-icons:file-type-go",
		".toml": "vscode-icons:file-type-toml",
	};

	return map[ext] ?? "vscode-icons:default-file";
}

export function NavProjects({ initial = [] }: { initial?: Project[] }) {
	const [projects, setProjects] = useState<ProjectWithFiles[]>(initial);
	const [rootFiles, setRootFiles] = useState<GitHubEntry[]>([]);
	const [rootFilesLoading, setRootFilesLoading] = useState(true);
	const [renamingId, setRenamingId] = useState<string | null>(null);
	const [renameValue, setRenameValue] = useState("");
	const renameInputRef = useRef<HTMLInputElement>(null);

	const [dialogOpen, setDialogOpen] = useState(false);

	const { startSync, finishSync, registerRefresh } = useSync();

	async function refreshFolders() {
		try {
			const [fresh, freshRootFiles] = await Promise.all([
				getFolders(),
				getRootFiles(),
			]);
			setProjects((prev) => {
				return fresh.map((f) => {
					const existing = prev.find((p) => p.id === f.id);
					return existing
						? {
								...f,
								expanded: existing.expanded,
								files: existing.files,
								filesLoaded: existing.filesLoaded,
							}
						: f;
				});
			});
			setRootFiles(freshRootFiles);
		} catch (e) {
			console.error("Failed to refresh folders", e);
		}
	}

	useEffect(() => {
		registerRefresh(refreshFolders);
		getRootFiles()
			.then(setRootFiles)
			.catch((e) => console.error("Failed to load root files", e))
			.finally(() => setRootFilesLoading(false));
	}, []);

	useEffect(() => {
		if (renamingId) {
			renameInputRef.current?.focus();
			renameInputRef.current?.select();
		}
	}, [renamingId]);

	async function toggleProject(id: string) {
		const project = projects.find((p) => p.id === id);
		if (!project) return;

		if (project.expanded) {
			setProjects((prev) =>
				prev.map((p) => (p.id === id ? { ...p, expanded: false } : p)),
			);
			return;
		}

		if (project.filesLoaded) {
			setProjects((prev) =>
				prev.map((p) => (p.id === id ? { ...p, expanded: true } : p)),
			);
			return;
		}

		setProjects((prev) =>
			prev.map((p) =>
				p.id === id ? { ...p, expanded: true, filesLoading: true } : p,
			),
		);

		try {
			const files = await getFolderFiles(id);
			setProjects((prev) =>
				prev.map((p) =>
					p.id === id
						? {
								...p,
								filesLoading: false,
								filesLoaded: true,
								files: files.filter(
									(f) => f.name !== ".gitkeep" && f.name !== ".meta.json",
								),
							}
						: p,
				),
			);
		} catch (e) {
			console.error(e);
			setProjects((prev) =>
				prev.map((p) =>
					p.id === id ? { ...p, filesLoading: false, expanded: false } : p,
				),
			);
		}
	}

	function startRename(project: Project) {
		setRenamingId(project.id);
		setRenameValue(project.name);
	}

	function commitRename(id: string, newName: string) {
		const originalProject = projects.find((p) => p.id === id);
		const isNew =
			!originalProject || originalProject.id !== originalProject.name; // temp UUID means it's new

		setRenamingId(null);

		startTransition(async () => {
			try {
				if (isNew && !originalProject?.name) {
					// brand-new folder (created via inline add — not used anymore but kept for safety)
					startSync(`Creating folder "${newName}"…`, "create");
					const created = await createFolder(newName);
					setProjects((prev) => prev.map((p) => (p.id === id ? created : p)));
					finishSync(true);
				} else {
					startSync(
						`Renaming "${originalProject?.name}" to "${newName}"…`,
						"rename",
					);
					await renameFolder(id, newName);
					setProjects((prev) =>
						prev.map((p) => (p.id === id ? { ...p, name: newName } : p)),
					);
					finishSync(true);
				}
			} catch (e) {
				console.error(e);
				finishSync(false, getErrorMessage(e));
			}
		});
	}

	function handleDeleteNested(projectId: string, file: GitHubEntry) {
		setProjects((prev) =>
			prev.map((p) =>
				p.id === projectId
					? { ...p, files: p.files?.filter((f) => f.sha !== file.sha) }
					: p,
			),
		);

		startTransition(async () => {
			startSync(`Deleting "${file.name}" and syncing with GitHub…`, "delete");
			try {
				if (file.type === "dir") {
					await deleteFolder(file.path);
				} else {
					await deleteFileInFolder(
						projectId,
						file.path.replace(`${projectId}/`, ""),
					);
				}
				finishSync(true);
			} catch (e) {
				console.error(e);
				finishSync(false, getErrorMessage(e));
			}
		});
	}

	function handleDeleteRootFile(file: GitHubEntry) {
		setRootFiles((prev) => prev.filter((f) => f.sha !== file.sha));

		startTransition(async () => {
			startSync(`Deleting "${file.name}" and syncing with GitHub…`, "delete");
			try {
				await deleteFileInFolder("", file.path);
				finishSync(true);
			} catch (e) {
				console.error(e);
				finishSync(false, getErrorMessage(e));
			}
		});
	}

	function handleDelete(id: string) {
		const project = projects.find((p) => p.id === id);
		setProjects((prev) => prev.filter((p) => p.id !== id));

		startTransition(async () => {
			console.log("calling startSync");
			startSync(
				`Deleting "${project?.name}" and syncing with GitHub…`,
				"delete",
			);
			try {
				await deleteFolder(id);
				console.log("calling finishSync true");
				finishSync(true);
			} catch (e) {
				console.error(e);
				finishSync(false, getErrorMessage(e));
			}
		});
	}

	return (
		<SidebarGroup>
			<Collapsible defaultOpen className="group/collapsible">
				<div className="flex items-center justify-between pr-2">
					<CollapsibleTrigger asChild>
						<SidebarGroupLabel className="flex-1 cursor-pointer select-none hover:text-foreground transition-colors">
							<BriefcaseIcon className="mr-2 size-3.5" />
							Projects
							<ChevronRightIcon className="ml-auto size-3.5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
						</SidebarGroupLabel>
					</CollapsibleTrigger>

					<button
						onClick={() => setDialogOpen(true)}
						className="flex items-center justify-center size-5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
						aria-label="New file or folder"
					>
						<PlusIcon size={13} />
					</button>

					<CreateEntryDialog
						open={dialogOpen}
						onOpenChange={setDialogOpen}
						projects={projects}
						onCreated={() => {}}
					/>
				</div>

				<CollapsibleContent>
					<SidebarMenu>
						{projects.length === 0 && (
							<p className="px-3 py-2 text-xs text-muted-foreground">
								No projects yet
							</p>
						)}

						{projects.map((project) => (
							<SidebarMenuItem key={project.id} className="group/item">
								<ContextMenu>
									<ContextMenuTrigger asChild>
										<div className="flex items-center w-full">
											{renamingId === project.id ? (
												<RenamePopover
													defaultValue={project.name}
													onCommit={(newName) =>
														commitRename(project.id, newName)
													}
													onCancel={() => setRenamingId(null)}
												/>
											) : (
												<>
													<SidebarMenuButton
														className="flex-1 min-w-0"
														onClick={() => toggleProject(project.id)}
													>
														{project.expanded ? (
															<FolderOpenIcon size={14} />
														) : (
															<FolderIcon size={14} />
														)}
														<span className="truncate">{project.name}</span>
														{project.filesLoading ? (
															<LoaderIcon
																size={11}
																className="ml-auto shrink-0 animate-spin text-muted-foreground"
															/>
														) : (
															<ChevronRightIcon
																size={11}
																className={`ml-auto shrink-0 text-muted-foreground transition-transform duration-200 ${
																	project.expanded ? "rotate-90" : ""
																}`}
															/>
														)}
													</SidebarMenuButton>

													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<SidebarMenuAction
																showOnHover
																aria-label="Project options"
															>
																<MoreHorizontalIcon size={13} />
															</SidebarMenuAction>
														</DropdownMenuTrigger>
														<DropdownMenuContent
															side="right"
															align="start"
															className="w-40"
														>
															<DropdownMenuItem
																onClick={() => startRename(project)}
															>
																<PencilIcon />
																Rename
															</DropdownMenuItem>
															<DropdownMenuItem
																variant="destructive"
																onClick={() => handleDelete(project.id)}
															>
																<Trash2Icon />
																Delete
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</>
											)}
										</div>
									</ContextMenuTrigger>

									<ContextMenuContent className="w-40">
										<ContextMenuItem onClick={() => startRename(project)}>
											<PencilIcon />
											Rename
										</ContextMenuItem>
										<ContextMenuItem
											variant="destructive"
											onClick={() => handleDelete(project.id)}
										>
											<Trash2Icon />
											Delete
										</ContextMenuItem>
									</ContextMenuContent>
								</ContextMenu>

								{project.expanded && project.filesLoaded && (
									<SidebarMenuSub>
										{!project.files || project.files.length === 0 ? (
											<SidebarMenuSubItem>
												<span className="px-2 py-1 text-xs text-muted-foreground">
													No files found
												</span>
											</SidebarMenuSubItem>
										) : (
											project.files.map((file) => (
												<SidebarMenuSubItem key={file.sha}>
													<ContextMenu>
														<ContextMenuTrigger asChild>
															<SidebarMenuSubButton asChild>
																<a
																	href={`#/projects/${project.id}/${file.path}`}
																>
																	{file.type === "dir" ? (
																		<FolderIcon
																			size={13}
																			className="shrink-0"
																		/>
																	) : (
																		<Icon
																			icon={getFileIcon(file.name)}
																			className="size-4 shrink-0"
																		/>
																	)}
																	<span className="truncate">{file.name}</span>
																</a>
															</SidebarMenuSubButton>
														</ContextMenuTrigger>
														<ContextMenuContent className="w-40">
															<ContextMenuItem
																variant="destructive"
																onClick={() =>
																	handleDeleteNested(project.id, file)
																}
															>
																<Trash2Icon />
																Delete
															</ContextMenuItem>
															<ContextMenuGroup>
																<ContextMenuItem>
																	Back
																	<ContextMenuShortcut>⌘[</ContextMenuShortcut>
																</ContextMenuItem>
																<ContextMenuItem disabled>
																	Forward
																	<ContextMenuShortcut>⌘]</ContextMenuShortcut>
																</ContextMenuItem>
																<ContextMenuItem>
																	Reload
																	<ContextMenuShortcut>⌘R</ContextMenuShortcut>
																</ContextMenuItem>
																<ContextMenuSub>
																	<ContextMenuSubTrigger>
																		More Tools
																	</ContextMenuSubTrigger>
																	<ContextMenuSubContent className="w-44">
																		<ContextMenuGroup>
																			<ContextMenuItem>
																				Save Page...
																			</ContextMenuItem>
																			<ContextMenuItem>
																				Create Shortcut...
																			</ContextMenuItem>
																			<ContextMenuItem>
																				Name Window...
																			</ContextMenuItem>
																		</ContextMenuGroup>
																		<ContextMenuSeparator />
																		<ContextMenuGroup>
																			<ContextMenuItem>
																				Developer Tools
																			</ContextMenuItem>
																		</ContextMenuGroup>
																		<ContextMenuSeparator />
																		<ContextMenuGroup>
																			<ContextMenuItem variant="destructive">
																				Delete
																			</ContextMenuItem>
																		</ContextMenuGroup>
																	</ContextMenuSubContent>
																</ContextMenuSub>
															</ContextMenuGroup>
														</ContextMenuContent>
													</ContextMenu>
												</SidebarMenuSubItem>
											))
										)}
									</SidebarMenuSub>
								)}
							</SidebarMenuItem>
						))}

						{rootFilesLoading ? (
							<SidebarMenuItem>
								<div className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground">
									<LoaderIcon size={11} className="animate-spin" />
									Loading files…
								</div>
							</SidebarMenuItem>
						) : (
							rootFiles.map((file) => (
								<SidebarMenuItem key={file.sha}>
									<ContextMenu>
										<ContextMenuTrigger asChild>
											<SidebarMenuButton asChild>
												<a href={`#/files/${file.path}`}>
													<Icon
														icon={getFileIcon(file.name)}
														className="size-4 shrink-0"
													/>
													<span className="truncate">{file.name}</span>
												</a>
											</SidebarMenuButton>
										</ContextMenuTrigger>
										<ContextMenuContent className="w-40">
											<ContextMenuItem
												variant="destructive"
												onClick={() => handleDeleteRootFile(file)}
											>
												<Trash2Icon />
												Delete
											</ContextMenuItem>
										</ContextMenuContent>
									</ContextMenu>
								</SidebarMenuItem>
							))
						)}
					</SidebarMenu>
				</CollapsibleContent>
			</Collapsible>
		</SidebarGroup>
	);
}
