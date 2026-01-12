"use client";

import { useEffect, useState } from "react";

type Member = {
	id: string;
	userId: string;
	role: string;
	user: {
		id: string;
		name: string | null;
		email: string;
	};
};

type Invitation = {
	id: string;
	email: string;
	role: string;
	status: string;
	expiresAt: string;
};

const ROLES = ["member", "admin", "viewer"] as const;
const ROLE_COLORS: Record<string, string> = {
	owner: "bg-purple-500/20 text-purple-400 border-purple-500/30",
	admin: "bg-blue-500/20 text-blue-400 border-blue-500/30",
	member: "bg-green-500/20 text-green-400 border-green-500/30",
	viewer: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

export default function TeamPage() {
	const [members, setMembers] = useState<Member[]>([]);
	const [invitations, setInvitations] = useState<Invitation[]>([]);
	const [loading, setLoading] = useState(true);

	// Invite form state
	const [inviteEmail, setInviteEmail] = useState("");
	const [inviteRole, setInviteRole] = useState<(typeof ROLES)[number]>("member");
	const [inviting, setInviting] = useState(false);
	const [inviteError, setInviteError] = useState<string | null>(null);

	// Edit role state
	const [editingMemberId, setEditingMemberId] = useState<string | null>(null);

	useEffect(() => {
		loadTeamData();
	}, []);

	async function loadTeamData() {
		setLoading(true);
		try {
			const [membersRes, invitationsRes] = await Promise.all([
				fetch("/api/trpc/organization.listMembers", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ json: {} }),
					credentials: "include",
				}),
				fetch("/api/trpc/organization.listInvitations", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ json: { status: "pending" } }),
					credentials: "include",
				}),
			]);

			const membersData = await membersRes.json();
			const invitationsData = await invitationsRes.json();

			// tRPC with superjson wraps data in result.data.json
			const members = membersData.result?.data?.json ?? membersData.result?.data ?? [];
			const invitations = invitationsData.result?.data?.json ?? invitationsData.result?.data ?? [];

			setMembers(members);
			setInvitations(invitations);
		} catch (error) {
			console.error("Failed to load team data:", error);
		} finally {
			setLoading(false);
		}
	}

	async function handleInvite(e: React.FormEvent) {
		e.preventDefault();
		setInviting(true);
		setInviteError(null);
		try {
			const res = await fetch("/api/trpc/organization.inviteMember", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ json: { email: inviteEmail, role: inviteRole } }),
				credentials: "include",
			});
			const data = await res.json();
			if (data.error) {
				throw new Error(data.error.message || "Failed to send invitation");
			}
			setInviteEmail("");
			await loadTeamData();
		} catch (error) {
			setInviteError((error as Error).message);
		} finally {
			setInviting(false);
		}
	}

	async function handleCancelInvitation(invitationId: string) {
		try {
			await fetch("/api/trpc/organization.cancelInvitation", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ json: { invitationId } }),
				credentials: "include",
			});
			await loadTeamData();
		} catch (error) {
			console.error("Failed to cancel invitation:", error);
		}
	}

	async function handleUpdateRole(memberId: string, newRole: string) {
		try {
			await fetch("/api/trpc/organization.updateMemberRole", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ json: { memberId, role: newRole } }),
				credentials: "include",
			});
			setEditingMemberId(null);
			await loadTeamData();
		} catch (error) {
			console.error("Failed to update role:", error);
		}
	}

	async function handleRemoveMember(memberId: string) {
		if (!confirm("Are you sure you want to remove this member?")) return;
		try {
			await fetch("/api/trpc/organization.removeMember", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ json: { memberId } }),
				credentials: "include",
			});
			await loadTeamData();
		} catch (error) {
			console.error("Failed to remove member:", error);
		}
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-blue-500" />
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-2xl font-bold text-white">Team Management</h1>
				<p className="mt-1 text-slate-400">Manage your organization members and invitations</p>
			</div>

			{/* Invite Form */}
			<div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
				<h2 className="mb-4 text-lg font-semibold text-white">Invite New Member</h2>
				<form onSubmit={handleInvite} className="flex flex-wrap gap-4">
					<div className="flex-1 min-w-[200px]">
						<input
							type="email"
							required
							placeholder="Email address"
							value={inviteEmail}
							onChange={(e) => setInviteEmail(e.target.value)}
							className="w-full"
						/>
					</div>
					<div className="w-40">
						<select
							value={inviteRole}
							onChange={(e) => setInviteRole(e.target.value as (typeof ROLES)[number])}
							className="w-full"
						>
							{ROLES.map((role) => (
								<option key={role} value={role}>
									{role.charAt(0).toUpperCase() + role.slice(1)}
								</option>
							))}
						</select>
					</div>
					<button
						type="submit"
						disabled={inviting}
						className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
					>
						{inviting ? "Sending..." : "Send Invite"}
					</button>
				</form>
				{inviteError && (
					<p className="mt-2 text-sm text-red-400">{inviteError}</p>
				)}
			</div>

			{/* Members List */}
			<div className="rounded-xl border border-slate-800 bg-slate-900/50">
				<div className="border-b border-slate-800 px-6 py-4">
					<h2 className="text-lg font-semibold text-white">Members ({members.length})</h2>
				</div>
				<div className="divide-y divide-slate-800">
					{members.length === 0 ? (
						<div className="px-6 py-8 text-center text-slate-400">
							No members found
						</div>
					) : (
						members.map((member) => (
							<div key={member.id} className="flex items-center justify-between px-6 py-4">
								<div className="flex items-center gap-4">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 text-sm font-medium text-white">
										{member.user?.name?.charAt(0).toUpperCase() || member.user?.email?.charAt(0).toUpperCase() || "?"}
									</div>
									<div>
										<div className="font-medium text-white">
											{member.user?.name || "Unknown"}
										</div>
										<div className="text-sm text-slate-400">
											{member.user?.email}
										</div>
									</div>
								</div>
								<div className="flex items-center gap-3">
									{editingMemberId === member.id ? (
										<select
											value={member.role}
											onChange={(e) => handleUpdateRole(member.id, e.target.value)}
											onBlur={() => setEditingMemberId(null)}
											autoFocus
											className="w-32"
										>
											{["owner", ...ROLES].map((role) => (
												<option key={role} value={role}>
													{role.charAt(0).toUpperCase() + role.slice(1)}
												</option>
											))}
										</select>
									) : (
										<button
											onClick={() => member.role !== "owner" && setEditingMemberId(member.id)}
											disabled={member.role === "owner"}
											className={`rounded-full border px-3 py-1 text-xs font-medium ${ROLE_COLORS[member.role] || ROLE_COLORS.member} ${member.role === "owner" ? "cursor-default" : "cursor-pointer hover:opacity-80"}`}
										>
											{member.role}
										</button>
									)}
									{member.role !== "owner" && (
										<button
											onClick={() => handleRemoveMember(member.id)}
											className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-red-400"
											title="Remove member"
										>
											<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
											</svg>
										</button>
									)}
								</div>
							</div>
						))
					)}
				</div>
			</div>

			{/* Pending Invitations */}
			{invitations.length > 0 && (
				<div className="rounded-xl border border-slate-800 bg-slate-900/50">
					<div className="border-b border-slate-800 px-6 py-4">
						<h2 className="text-lg font-semibold text-white">Pending Invitations ({invitations.length})</h2>
					</div>
					<div className="divide-y divide-slate-800">
						{invitations.map((invitation) => (
							<div key={invitation.id} className="flex items-center justify-between px-6 py-4">
								<div className="flex items-center gap-4">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 text-sm font-medium text-slate-400">
										<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
										</svg>
									</div>
									<div>
										<div className="font-medium text-white">{invitation.email}</div>
										<div className="text-sm text-slate-400">
											Expires: {new Date(invitation.expiresAt).toLocaleDateString()}
										</div>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<span className={`rounded-full border px-3 py-1 text-xs font-medium ${ROLE_COLORS[invitation.role] || ROLE_COLORS.member}`}>
										{invitation.role}
									</span>
									<button
										onClick={() => handleCancelInvitation(invitation.id)}
										className="rounded-lg px-3 py-1.5 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-red-400"
									>
										Cancel
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
