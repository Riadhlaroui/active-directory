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
	ContextMenuItem,
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
import {
	createProject,
	deleteProject,
	renameProject,
	getProjectFiles,
} from "@/lib/actions/projects";
import { Project } from "@/lib/types/project";
import { CreateEntryDialog } from "./create-entry-dialog";

type GitHubEntry = {
	name: string;
	path: string;
	type: "file" | "dir";
	sha: string;
};

type ProjectWithFiles = Project & {
	files?: GitHubEntry[];
	filesLoaded?: boolean;
	filesLoading?: boolean;
	expanded?: boolean;
};

export function NavProjects({ initial = [] }: { initial?: Project[] }) {
	const [projects, setProjects] = useState<ProjectWithFiles[]>(initial);
	const [renamingId, setRenamingId] = useState<string | null>(null);
	const [renameValue, setRenameValue] = useState("");
	const renameInputRef = useRef<HTMLInputElement>(null);

	const [dialogOpen, setDialogOpen] = useState(false);

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
			const files = await getProjectFiles(id);
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

	function addProject() {
		const id = crypto.randomUUID();
		const name = `Project ${projects.length + 1}`;
		setProjects((prev) => [...prev, { id, name }]);
		setRenamingId(id);
		setRenameValue(name);
	}

	function startRename(project: Project) {
		setRenamingId(project.id);
		setRenameValue(project.name);
	}

	function commitRename() {
		if (!renamingId) return;
		const trimmed = renameValue.trim();
		if (!trimmed) {
			setRenamingId(null);
			return;
		}

		const isNew = !projects.find(
			(p) => p.id === renamingId && p.name !== renameValue,
		);

		startTransition(async () => {
			try {
				if (isNew) {
					const created = await createProject(trimmed);
					setProjects((prev) =>
						prev.map((p) => (p.id === renamingId ? created : p)),
					);
				} else {
					await renameProject(renamingId, trimmed);
					setProjects((prev) =>
						prev.map((p) =>
							p.id === renamingId ? { ...p, name: trimmed } : p,
						),
					);
				}
			} catch (e) {
				console.error(e);
				setProjects((prev) => prev.filter((p) => p.id !== renamingId));
			}
			setRenamingId(null);
		});
	}

	function handleDelete(id: string) {
		setProjects((prev) => prev.filter((p) => p.id !== id));
		startTransition(() => deleteProject(id));
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
												<div className="flex items-center gap-1.5 px-2 py-1 w-full">
													<FolderIcon
														size={14}
														className="text-muted-foreground shrink-0"
													/>
													<input
														ref={renameInputRef}
														value={renameValue}
														onChange={(e) => setRenameValue(e.target.value)}
														onBlur={commitRename}
														onKeyDown={(e) => {
															if (e.key === "Enter") commitRename();
															if (e.key === "Escape") setRenamingId(null);
														}}
														className="flex-1 min-w-0 text-sm bg-transparent border-b border-border outline-none text-foreground"
													/>
												</div>
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
													No files yet
												</span>
											</SidebarMenuSubItem>
										) : (
											project.files.map((file) => (
												<SidebarMenuSubItem key={file.sha}>
													<SidebarMenuSubButton asChild>
														<a href={`#/projects/${project.id}/${file.path}`}>
															{file.type === "dir" ? (
																<FolderIcon size={12} />
															) : (
																<FileIcon size={12} />
															)}
															<span className="truncate">{file.name}</span>
														</a>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))
										)}
									</SidebarMenuSub>
								)}
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</CollapsibleContent>
			</Collapsible>
		</SidebarGroup>
	);
}
