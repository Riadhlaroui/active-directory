const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;
const token = process.env.GITHUB_TOKEN;

const BASE = `https://api.github.com/repos/${owner}/${repo}/contents`;

const headers = {
	Authorization: `Bearer ${token}`,
	Accept: "application/vnd.github+json",
	"X-GitHub-Api-Version": "2022-11-28",
	"Content-Type": "application/json",
};

export async function getFile(path: string) {
	const res = await fetch(`${BASE}/${path}`, {
		headers,
		cache: "no-store",
	});

	if (res.status === 404) return null;
	if (!res.ok)
		throw new Error(
			`GitHub getFile failed [${res.status}]: ${await res.text()}`,
		);
	return res.json() as Promise<{
		sha: string;
		content: string;
		encoding: string;
	}>;
}

export async function listDir(path: string) {
	const res = await fetch(`${BASE}/${path}`, {
		headers,
		cache: "no-store",
	});

	if (res.status === 404) return [];
	if (!res.ok)
		throw new Error(
			`GitHub listDir failed [${res.status}]: ${await res.text()}`,
		);
	return res.json() as unknown as Array<{
		name: string;
		path: string;
		type: "file" | "dir";
		sha: string;
	}>;
}

export async function putFile(
	path: string,
	content: string,
	message: string,
	sha?: string,
) {
	const body: Record<string, string> = {
		message,
		content: Buffer.from(content).toString("base64"),
	};
	if (sha) body.sha = sha;

	const res = await fetch(`${BASE}/${path}`, {
		method: "PUT",
		headers,
		body: JSON.stringify(body),
	});

	if (!res.ok) {
		const text = await res.text();
		const err = new Error(`GitHub putFile failed [${res.status}]: ${text}`);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(err as any).status = res.status;
		throw err;
	}
	return res.json();
}

export async function deleteFile(path: string, sha: string, message: string) {
	const res = await fetch(`${BASE}/${path}`, {
		method: "DELETE",
		headers,
		body: JSON.stringify({ message, sha }),
	});

	if (!res.ok)
		throw new Error(
			`GitHub deleteFile failed [${res.status}]: ${await res.text()}`,
		);
	return res.json();
}
