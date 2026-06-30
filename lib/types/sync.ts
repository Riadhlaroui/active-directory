export type SyncStatus = "idle" | "syncing" | "success" | "error";
export type SyncOperation = "create" | "rename" | "delete" | null;

export type SyncState = {
	status: SyncStatus;
	message: string;
	operation: SyncOperation;
};

export type SyncContextValue = {
	state: SyncState;
	startSync: (message: string, operation: SyncOperation) => void;
	finishSync: (success: boolean, message?: string) => void;
	registerRefresh: (fn: () => void | Promise<void>) => void;
	dismiss: () => void;
};
