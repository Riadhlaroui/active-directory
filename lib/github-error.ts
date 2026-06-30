export type GitHubErrorCode =
	| "ALREADY_EXISTS"
	| "NOT_FOUND"
	| "INVALID_NAME"
	| "INVALID_PATH"
	| "RATE_LIMITED"
	| "UNAUTHORIZED"
	| "NETWORK_ERROR"
	| "UNKNOWN";

export class GitHubError extends Error {
	code: GitHubErrorCode;
	status?: number;

	constructor(code: GitHubErrorCode, message: string, status?: number) {
		super(message);
		this.name = "GitHubError";
		this.code = code;
		this.status = status;
	}
}

export function toGitHubError(err: unknown, status?: number): GitHubError {
	if (err instanceof GitHubError) return err;

	const message = err instanceof Error ? err.message : String(err);

	if (status === 401 || status === 403) {
		return new GitHubError(
			"UNAUTHORIZED",
			"GitHub token is invalid or missing required permissions.",
			status,
		);
	}
	if (status === 404) {
		return new GitHubError(
			"NOT_FOUND",
			"The requested file or folder doesn't exist.",
			status,
		);
	}
	if (status === 409) {
		return new GitHubError(
			"ALREADY_EXISTS",
			"A file with that name already exists.",
			status,
		);
	}
	if (status === 422) {
		return new GitHubError(
			"INVALID_PATH",
			"The path is invalid (e.g. malformed name or characters).",
			status,
		);
	}
	if (status === 429) {
		return new GitHubError(
			"RATE_LIMITED",
			"GitHub API rate limit reached. Try again shortly.",
			status,
		);
	}
	if (message.includes("fetch failed") || message.includes("ENOTFOUND")) {
		return new GitHubError(
			"NETWORK_ERROR",
			"Couldn't reach GitHub. Check your connection.",
		);
	}

	return new GitHubError(
		"UNKNOWN",
		message || "Something went wrong syncing with GitHub.",
		status,
	);
}

export function getErrorMessage(err: unknown): string {
	if (err instanceof GitHubError) {
		switch (err.code) {
			case "ALREADY_EXISTS":
				return "A file or folder with that name already exists here.";
			case "NOT_FOUND":
				return "That file or folder no longer exists.";
			case "INVALID_NAME":
				return "That name isn't valid. Avoid slashes, leading dots, or special characters.";
			case "INVALID_PATH":
				return "That path is invalid.";
			case "RATE_LIMITED":
				return "Too many requests to GitHub — wait a moment and try again.";
			case "UNAUTHORIZED":
				return "GitHub access denied — check your token permissions.";
			case "NETWORK_ERROR":
				return "Couldn't reach GitHub. Check your connection and try again.";
			default:
				return err.message || "Sync failed — changes may not be reflected.";
		}
	}
	return "Sync failed — changes may not be reflected.";
}
