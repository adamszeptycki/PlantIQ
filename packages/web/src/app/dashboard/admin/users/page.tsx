"use client";

import { useEffect, useState } from "react";

type UserWithRoles = {
	userId: string;
	userName: string | null;
	userEmail: string;
	roles: string[];
};

const ALL_ROLES = ["sales", "planner", "buyer", "worker", "supervisor", "finance", "admin"];

const ROLE_DESCRIPTIONS: Record<string, string> = {
	sales: "Access to sales orders, quotes, customers, and leads",
	planner: "Access to products, inventory, and production planning",
	buyer: "Access to purchasing and vendors",
	worker: "Access to shop floor and work orders",
	supervisor: "Access to manufacturing orders and supervision",
	finance: "Access to accounting, invoices, and financial reports",
	admin: "Full access to all ERP features and user management",
};

export default function UsersPage() {
	const [users, setUsers] = useState<UserWithRoles[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);
	const [editingRoles, setEditingRoles] = useState<string[]>([]);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		loadUsers();
	}, []);

	async function loadUsers() {
		setLoading(true);
		try {
			const res = await fetch("/api/trpc/erpRoles.listUsersWithRoles", {
				credentials: "include",
			});
			const data = await res.json();
			setUsers(data.result.data || []);
		} catch (error) {
			console.error("Failed to load users:", error);
		} finally {
			setLoading(false);
		}
	}

	function openEditModal(user: UserWithRoles) {
		setSelectedUser(user);
		setEditingRoles(user.roles);
	}

	function toggleRole(role: string) {
		if (editingRoles.includes(role)) {
			setEditingRoles(editingRoles.filter((r) => r !== role));
		} else {
			setEditingRoles([...editingRoles, role]);
		}
	}

	async function saveRoles() {
		if (!selectedUser) return;

		setSaving(true);
		try {
			const res = await fetch("/api/trpc/erpRoles.setRoles", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({
					userId: selectedUser.userId,
					roles: editingRoles,
				}),
			});

			if (res.ok) {
				// Reload users to get updated roles
				await loadUsers();
				setSelectedUser(null);
			} else {
				console.error("Failed to save roles");
			}
		} catch (error) {
			console.error("Failed to save roles:", error);
		} finally {
			setSaving(false);
		}
	}

	return (
		<div className="min-h-screen bg-slate-900 p-6">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-2xl font-bold text-white mb-6">User Role Management</h1>

				{loading ? (
					<div className="text-slate-400 text-center py-12">Loading...</div>
				) : users.length === 0 ? (
					<div className="bg-slate-800 rounded-lg p-12 text-center">
						<p className="text-slate-400">No users found.</p>
					</div>
				) : (
					<div className="bg-slate-800 rounded-lg overflow-hidden">
						<table className="w-full">
							<thead className="bg-slate-700">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
										User
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
										Email
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
										Roles
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-700">
								{users.map((user) => (
									<tr key={user.userId} className="hover:bg-slate-700/50">
										<td className="px-6 py-4 whitespace-nowrap text-sm text-white">
											{user.userName || "—"}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
											{user.userEmail}
										</td>
										<td className="px-6 py-4">
											<div className="flex flex-wrap gap-2">
												{user.roles.length === 0 ? (
													<span className="text-slate-500 text-sm">No roles assigned</span>
												) : (
													user.roles.map((role) => (
														<span
															key={role}
															className="px-2 py-1 bg-blue-900/50 text-blue-300 rounded text-xs font-medium"
														>
															{role}
														</span>
													))
												)}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-right">
											<button
												type="button"
												onClick={() => openEditModal(user)}
												className="text-blue-400 hover:text-blue-300 text-sm font-medium"
											>
												Manage Roles
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{/* Edit Modal */}
				{selectedUser && (
					<div
						className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
						onClick={() => setSelectedUser(null)}
					>
						<div
							className="bg-slate-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex items-center justify-between mb-4">
								<div>
									<h2 className="text-xl font-bold text-white">Manage User Roles</h2>
									<p className="text-sm text-slate-400 mt-1">
										{selectedUser.userName || selectedUser.userEmail}
									</p>
								</div>
								<button
									type="button"
									onClick={() => setSelectedUser(null)}
									className="text-slate-400 hover:text-white"
								>
									✕
								</button>
							</div>

							<div className="space-y-3 mb-6">
								{ALL_ROLES.map((role) => {
									const isChecked = editingRoles.includes(role);
									return (
										<div
											key={role}
											className="bg-slate-700 rounded-lg p-4 cursor-pointer hover:bg-slate-600 transition-colors"
											onClick={() => toggleRole(role)}
										>
											<div className="flex items-start">
												<input
													type="checkbox"
													checked={isChecked}
													onChange={() => toggleRole(role)}
													className="mt-1 mr-3"
													onClick={(e) => e.stopPropagation()}
												/>
												<div className="flex-1">
													<div className="flex items-center gap-2">
														<span className="text-white font-medium capitalize">
															{role}
														</span>
														{isChecked && (
															<span className="px-2 py-0.5 bg-blue-900/50 text-blue-300 rounded text-xs font-medium">
																Active
															</span>
														)}
													</div>
													<p className="text-sm text-slate-400 mt-1">
														{ROLE_DESCRIPTIONS[role]}
													</p>
												</div>
											</div>
										</div>
									);
								})}
							</div>

							<div className="flex justify-end gap-3">
								<button
									type="button"
									onClick={() => setSelectedUser(null)}
									className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
									disabled={saving}
								>
									Cancel
								</button>
								<button
									type="button"
									onClick={saveRoles}
									className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
									disabled={saving}
								>
									{saving ? "Saving..." : "Save Roles"}
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
