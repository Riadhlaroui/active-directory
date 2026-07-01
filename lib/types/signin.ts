export type Repo = {
	id: number;
	full_name: string;
	private: boolean;
	default_branch: string;
};
export type Step = "pick" | "verify" | "done";
