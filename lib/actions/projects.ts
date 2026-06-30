"use server";

import { getFile, putFile, listDir, deleteFile } from "../github";
import { revalidatePath } from "next/cache";
import { assertNotExists, validateEntryName } from "../validation";
import { GitHubError, toGitHubError } from "../github-error";

export async function createFolder(name: string) {
	try {
		validateEntryName(name);
		const slug = slugify(name);
		const path = `${slug}/.gitkeep`;

		await assertNotExists(getFile, `${slug}/.meta.json`);

		await putFile(path, "", `chore: create project "${name}"`);
		await putFile(
			`${slug}/.meta.json`,
			JSON.stringify({ name }),
			`chore: set display name for "${slug}"`,
		);
		revalidatePath("/");
		return { id: slug, name };
	} catch (e) {
		throw toGitHubError(e);
	}
}

export async function renameFolder(oldSlug: string, newName: string) {
	try {
		validateEntryName(newName);
		const newSlug = slugify(newName);

		if (newSlug !== oldSlug) {
			await assertNotExists(getFile, `${newSlug}/.meta.json`);
		}

		const metaPath = `${oldSlug}/.meta.json`;
		const existing = await getFile(metaPath);

		await putFile(
			metaPath,
			JSON.stringify({ name: newName }),
			`chore: rename project to "${newSlug}"`,
			existing?.sha,
		);

		revalidatePath("/");
	} catch (e) {
		throw toGitHubError(e);
	}
}

export async function deleteFolder(path: string) {
	try {
		await deleteFolderRecursive(path);
		revalidatePath("/");
	} catch (e) {
		throw toGitHubError(e);
	}
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

export async function getRootFiles() {
	try {
		const entries = await listDir("");
		return entries.filter(
			(e) =>
				e.type === "file" &&
				e.name !== ".gitkeep" &&
				e.name !== ".meta.json" &&
				e.name !== "README.md",
		);
	} catch (e) {
		throw toGitHubError(e);
	}
}

export async function getFolders() {
	try {
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
	} catch (e) {
		throw toGitHubError(e);
	}
}

export async function createFileInFolder(
	projectSlug: string,
	filePath: string,
	content: string,
	entryName?: string,
) {
	try {
		if (entryName) {
			validateEntryName(entryName);
		}

		const fullPath = projectSlug ? `${projectSlug}/${filePath}` : filePath;

		await assertNotExists(getFile, fullPath);

		await putFile(
			fullPath,
			content,
			`feat(${projectSlug || "root"}): add ${filePath}`,
		);
		revalidatePath("/");
	} catch (e) {
		throw toGitHubError(e);
	}
}

export async function deleteFileInFolder(
	projectSlug: string,
	filePath: string,
) {
	try {
		const fullPath = projectSlug ? `${projectSlug}/${filePath}` : filePath;
		const existing = await getFile(fullPath);
		if (!existing) throw new GitHubError("NOT_FOUND", "File not found.");
		await deleteFile(
			fullPath,
			existing.sha,
			`chore(${projectSlug || "root"}): delete ${filePath}`,
		);
		revalidatePath("/");
	} catch (e) {
		throw toGitHubError(e);
	}
}

export async function getFolderFiles(projectSlug: string) {
	try {
		return await listDir(projectSlug);
	} catch (e) {
		throw toGitHubError(e);
	}
}

function slugify(name: string) {
	return name
		.toLocaleLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[^a-z0-9-]/g, "");
}
