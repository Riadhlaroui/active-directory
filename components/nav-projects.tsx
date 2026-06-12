"use client";

import { useState, useRef, useEffect } from "react";
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
	BriefcaseIcon,
	ChevronRightIcon,
	PlusIcon,
	FolderIcon,
	MoreHorizontalIcon,
	PencilIcon,
	Trash2Icon,
} from "lucide-react";

type Project = {
	id: string;
	name: string;
};

export function NavProjects() {
	const [projects, setProjects] = useState<Project[]>([
		{ id: "1", name: "Website Redesign" },
		{ id: "2", name: "Mobile App" },
	]);
	const [renamingId, setRenamingId] = useState<string | null>(null);
	const [renameValue, setRenameValue] = useState("");
	const renameInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (renamingId) {
			renameInputRef.current?.focus();
			renameInputRef.current?.select();
		}
	}, [renamingId]);

	function addProject() {
		const id = crypto.randomUUID();
		const name = `Project ${projects.length + 1}`;
		setProjects((prev) => [...prev, { id, name }]);
		// immediately rename the new one
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
		if (trimmed) {
			setProjects((prev) =>
				prev.map((p) => (p.id === renamingId ? { ...p, name: trimmed } : p)),
			);
		}
		setRenamingId(null);
	}

	function deleteProject(id: string) {
		setProjects((prev) => prev.filter((p) => p.id !== id));
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

					{/* Add project button */}
					<button
						onClick={addProject}
						className="flex items-center justify-center size-5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
						aria-label="Add project"
					>
						<PlusIcon size={13} />
					</button>
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
								<div className="flex items-center w-full">
									{renamingId === project.id ? (
										// Inline rename input
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
											<SidebarMenuButton asChild className="flex-1 min-w-0">
												<a href={`#/projects/${project.id}`}>
													<FolderIcon />
													<span className="truncate">{project.name}</span>
												</a>
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
														onClick={() => deleteProject(project.id)}
													>
														<Trash2Icon />
														Delete
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</>
									)}
								</div>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</CollapsibleContent>
			</Collapsible>
		</SidebarGroup>
	);
}
