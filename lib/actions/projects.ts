"use server";

import { getFile, putFile, listDir, deleteFile } from "../github";
import { revalidatePath } from "next/cache";

export async function createFolder(name: string) {
	const slug = slugify(name);
	const path = `${slug}/.gitkeep`;

	const existing = await getFile(`${slug}/.meta.json`);
	if (existing) throw new Error("Project already exists");

	await putFile(path, "", `chore: create project "${name}"`);
	await putFile(
		`${slug}/.meta.json`,
		JSON.stringify({ name }),
		`chore: set display name for "${slug}"`,
	);
	revalidatePath("/");
	return { id: slug, name };
}

export async function renameFolder(oldSlug: string, newName: string) {
	const newSlug = slugify(newName);
	const metaPath = `${oldSlug}/.meta.json`;

	const existing = await getFile(metaPath);

	await putFile(
		metaPath,
		JSON.stringify({ name: newName }),
		`chore: rename project to "${newSlug}"`,
		existing?.sha,
	);

	revalidatePath("/");
}

export async function deleteFolder(path: string) {
	await deleteFolderRecursive(path);
	revalidatePath("/");
}

async function deleteFolderRecursive(path: string) {
	const entries = await listDir(path);

	for (const entry of entries) {
		if (entry.type === "dir") {
			await deleteFolderRecursive(entry.path);
		} else {
			await deleteFile(entry.path, entry.sha, `chore: delete ${entry.path}`);
		}
	}
}

export async function getFolders() {
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

export async function createFileInFolder(
	projectSlug: string,
	filePath: string,
	content: string,
) {
	const fullPath = projectSlug ? `${projectSlug}/${filePath}` : filePath;
	const existing = await getFile(fullPath);
	await putFile(
		fullPath,
		content,
		`feat(${projectSlug || "root"}): add ${filePath}`,
		existing?.sha,
	);
	revalidatePath("/");
}

export async function deleteFileInFolder(
	projectSlug: string,
	filePath: string,
) {
	const fullPath = projectSlug ? `${projectSlug}/${filePath}` : filePath;
	const existing = await getFile(fullPath);
	if (!existing) throw new Error("File not found");
	await deleteFile(
		fullPath,
		existing.sha,
		`chore(${projectSlug || "root"}): delete ${filePath}`,
	);
	revalidatePath("/");
}

export async function getFolderFiles(projectSlug: string) {
	return listDir(projectSlug);
}

function slugify(name: string) {
	return name
		.toLocaleLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[^a-z0-9-]/g, "");
}
