"use server";

import { getFile, putFile, listDir, deleteFile } from "../github";
import { revalidatePath } from "next/cache";

export async function createProject(name: string) {
	const slug = slugify(name);
	const path = `prjects/${slug}/.gitkeep`;

	const existing = await getFile(name);
	if (existing) throw new Error("Project already exists");

	await putFile(path, "", `chore: create project  "${name}"`);
	revalidatePath("/");
	return { id: slug, name };
}

export async function renameProject(oldSlug: string, newName: string) {
	const newSlug = slugify(newName);
	const metaPath = `prjects/${oldSlug}/.meta.json`;

	const existing = await getFile(metaPath);

	await putFile(
		metaPath,
		JSON.stringify({ name: newName }),
		`chore: rename project to "${newSlug}"`,
		existing?.sha,
	);

	revalidatePath("/");
}

export async function deleteProject(slug: string) {
	const files = await listDir(`projects/${slug}`);
	for (const file of files) {
		if (file.type === "file") {
			await deleteFile(file.path, file.sha, `chore: delete project "${slug}"`);
		}
	}
	revalidatePath("/");
}

export async function getProjects() {
	const dirs = await listDir("");

	if (!dirs || dirs.length === 0) return [];

	return Promise.all(
		dirs
			.filter((d) => d.type === "dir")
			.map(async (d) => {
				const meta = await getFile(`${d.path}/.meta.json`);
				const name = meta
					? JSON.parse(Buffer.from(meta.content, "base64").toString()).name
					: d.name;
				return { id: d.name, name };
			}),
	);
}

export async function createFileInProject(
	projectSlug: string,
	filePath: string,
	content: string,
) {
	const fullPath = `projects/${projectSlug}/${filePath}`;
	const existing = await getFile(fullPath);
	await putFile(
		fullPath,
		content,
		`feat(${projectSlug}): add ${filePath}`,
		existing?.sha,
	);
	revalidatePath("/");
}

export async function deleteFileInProject(
	projectSlug: string,
	filePath: string,
) {
	const fullPath = `projects/${projectSlug}/${filePath}`;
	const existing = await getFile(fullPath);
	if (!existing) throw new Error("File not found");
	await deleteFile(
		fullPath,
		existing.sha,
		`chore(${projectSlug}): delete ${filePath}`,
	);
	revalidatePath("/");
}

export async function getProjectFiles(projectSlug: string) {
	return listDir(`projects/${projectSlug}`);
}

function slugify(name: string) {
	return name
		.toLocaleLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[^a-z0-9-]/g, "");
}
