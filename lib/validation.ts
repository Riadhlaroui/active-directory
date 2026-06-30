import { GitHubError } from "./github-error";

const RESERVED_NAMES = [".git", ".gitkeep", ".meta.json"];
const INVALID_CHARS = /[<>:"|?*\\]/;

export function validateEntryName(name: string): void {
	const trimmed = name.trim();

	if (!trimmed) {
		throw new GitHubError("INVALID_NAME", "Name can't be empty.");
	}
	if (trimmed.length > 100) {
		throw new GitHubError(
			"INVALID_NAME",
			"Name is too long (max 100 characters).",
		);
	}
	if (trimmed.startsWith(".") || trimmed.startsWith("/")) {
		throw new GitHubError(
			"INVALID_NAME",
			"Name can't start with a dot or slash.",
		);
	}
	if (INVALID_CHARS.test(trimmed)) {
		throw new GitHubError(
			"INVALID_NAME",
			`Name can't contain: < > : " | ? * \\`,
		);
	}
	if (RESERVED_NAMES.includes(trimmed.toLowerCase())) {
		throw new GitHubError("INVALID_NAME", `"${trimmed}" is a reserved name.`);
	}
}

export async function assertNotExists(
	getFile: (path: string) => Promise<{ sha: string } | null>,
	path: string,
): Promise<void> {
	const existing = await getFile(path);
	if (existing) {
		throw new GitHubError(
			"ALREADY_EXISTS",
			`Something already exists at "${path}".`,
		);
	}
}
