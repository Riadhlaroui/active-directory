export type Project = {
	id: string;
	name: string;
};

export type GitHubEntry = {
	name: string;
	path: string;
	type: "file" | "dir";
	sha: string;
};

export type ProjectWithFiles = Project & {
	files?: GitHubEntry[];
	filesLoaded?: boolean;
	filesLoading?: boolean;
	expanded?: boolean;
};
