"use client";

import {
	createContext,
	useContext,
	useState,
	useCallback,
	useRef,
} from "react";
import { SyncContextValue, SyncOperation, SyncState } from "./types/sync";

const SyncContext = createContext<SyncContextValue | null>(null);

export function SyncProvider({ children }: { children: React.ReactNode }) {
	const [state, setState] = useState<SyncState>({
		status: "idle",
		message: "",
		operation: null,
	});
	const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const opId = useRef(0);
	const refreshFn = useRef<(() => void | Promise<void>) | null>(null);

	const registerRefresh = useCallback((fn: () => void | Promise<void>) => {
		refreshFn.current = fn;
	}, []);

	const startSync = useCallback((message: string, operation: SyncOperation) => {
		if (dismissTimer.current) clearTimeout(dismissTimer.current);
		opId.current += 1;
		setState({ status: "syncing", message, operation });
	}, []);

	const dismiss = useCallback(() => {
		if (dismissTimer.current) clearTimeout(dismissTimer.current);
		setState({ status: "idle", message: "", operation: null });
	}, []);

	const finishSync = useCallback((success: boolean, message?: string) => {
		if (dismissTimer.current) clearTimeout(dismissTimer.current);

		if (success) {
			setState((prev) => ({
				status: "success",
				message: message ?? buildDefaultSuccessMessage(prev.operation),
				operation: prev.operation,
			}));

			refreshFn.current?.();

			const myOp = opId.current;
			dismissTimer.current = setTimeout(() => {
				if (opId.current === myOp) {
					setState({ status: "idle", message: "", operation: null });
				}
			}, 2500);
		} else {
			setState((prev) => ({
				status: "error",
				message: message ?? "Sync failed changes may not be reflected",
				operation: prev.operation,
			}));
		}
	}, []);

	return (
		<SyncContext.Provider
			value={{ state, startSync, finishSync, registerRefresh, dismiss }}
		>
			{children}
		</SyncContext.Provider>
	);
}

function buildDefaultSuccessMessage(operation: SyncOperation) {
	switch (operation) {
		case "create":
			return "Created synced to GitHub";
		case "rename":
			return "Renamed synced to GitHub";
		case "delete":
			return "Deleted synced to GitHub";
		default:
			return "Up to date changes synced to GitHub";
	}
}

export function useSync() {
	const ctx = useContext(SyncContext);
	if (!ctx) throw new Error("useSync must be used within SyncProvider");
	return ctx;
}
