"use client";

import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";
import { Theme } from "../../app/src/types/theme";
import { getTokens } from "../../app/src/tokens";

import TheoryIcon from "../../public/files.svg";
import buildIcon from "../../public/load-test.svg";
import atkIcon from "../../public/power.svg";

const Landing = ({
	onStart,
	theme,
	setTheme,
}: {
	onStart: () => void;
	theme: Theme;
	setTheme: (t: Theme) => void;
}) => {
	const v = getTokens(theme);
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
					Active Directory Deep Dive{" "}
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
						fontSize: "0.95rem",
						flexWrap: "wrap",
						justifyContent: "center",
					}}
				>
					{[["Laroui Riadh Brahim & Hadj Aissa Mohammed Abderraouf"]].map(
						([icon, label], i) => (
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
						),
					)}
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
							icon: (
								<Image
									src={TheoryIcon}
									alt="Forest Icon"
									style={{ width: "2.3rem", height: "2.3rem" }}
								/>
							),
							title: "Part 0: Theory",
							body: "Understand what AD DS is, how the Forest/Domain/OU hierarchy works, and the protocols (LDAP, Kerberos, DNS) that power it.",
						},
						{
							color: "#34d399",
							icon: (
								<Image
									src={buildIcon}
									alt="Build Icon"
									style={{ width: "2.3rem", height: "2.3rem" }}
								/>
							),
							title: "Part 1: Build",
							body: "Set up a Windows Server 2025 Domain Controller, create users, groups, OUs.",
						},
						{
							color: "#f87171",
							icon: (
								<Image
									src={atkIcon}
									alt="Attack Icon"
									style={{ width: "2.3rem", height: "2.3rem" }}
								/>
							),
							title: "Part 2: Attack",
							body: "AS-REP Roast the DC, crack the hash, PSExec in, and compromise the DC.",
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
};

export default Landing;
