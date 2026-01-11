"use client";

import { useEffect, useState } from "react";

type AuditLog = {
	id: string;
	organizationId: string;
	userId: string;
	userName: string | null;
	userEmail: string | null;
	action: "create" | "update" | "delete";
	entityType: string;
	entityId: string;
	entityName: string | null;
	beforeState: any;
	afterState: any;
	changes: any;
	ipAddress: string | null;
	userAgent: string | null;
	createdAt: string;
};

export default function AuditTrailPage() {
	const [logs, setLogs] = useState<AuditLog[]>([]);
	const [loading, setLoading] = useState(true);
	const [entityTypeFilter, setEntityTypeFilter] = useState("");
	const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

	useEffect(() => {
		loadAuditLogs();
	}, [entityTypeFilter]);

	async function loadAuditLogs() {
		setLoading(true);
		try {
			const params = entityTypeFilter ? { entityType: entityTypeFilter } : {};
			const res = await fetch(
				`/api/trpc/audit.list?input=${encodeURIComponent(JSON.stringify(params))}`,
				{
					credentials: "include",
				},
			);
			const data = await res.json();
			setLogs(data.result.data || []);
		} catch (error) {
			console.error("Failed to load audit logs:", error);
		} finally {
			setLoading(false);
		}
	}

	function getActionColor(action: string) {
		switch (action) {
			case "create":
				return "bg-green-900/50 text-green-300";
			case "update":
				return "bg-blue-900/50 text-blue-300";
			case "delete":
				return "bg-red-900/50 text-red-300";
			default:
				return "bg-slate-700 text-slate-300";
		}
	}

	return (
		<div className="min-h-screen bg-slate-900 p-6">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-2xl font-bold text-white mb-6">Audit Trail</h1>

				{/* Filters */}
				<div className="bg-slate-800 rounded-lg p-4 mb-6">
					<div className="flex gap-4 items-center">
						<label className="text-slate-300 text-sm">
							Entity Type:
							<select
								value={entityTypeFilter}
								onChange={(e) => setEntityTypeFilter(e.target.value)}
								className="ml-2 px-3 py-2 bg-slate-700 text-white rounded-lg"
							>
								<option value="">All</option>
								<option value="product">Product</option>
								<option value="sales_order">Sales Order</option>
								<option value="manufacturing_order">Manufacturing Order</option>
								<option value="purchase_order">Purchase Order</option>
								<option value="invoice">Invoice</option>
								<option value="customer">Customer</option>
								<option value="vendor">Vendor</option>
							</select>
						</label>
						<button
							type="button"
							onClick={() => setEntityTypeFilter("")}
							className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600"
						>
							Clear
						</button>
					</div>
				</div>

				{loading ? (
					<div className="text-slate-400 text-center py-12">Loading...</div>
				) : logs.length === 0 ? (
					<div className="bg-slate-800 rounded-lg p-12 text-center">
						<p className="text-slate-400">No audit logs found.</p>
					</div>
				) : (
					<div className="bg-slate-800 rounded-lg overflow-hidden">
						<table className="w-full">
							<thead className="bg-slate-700">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
										Timestamp
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
										User
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
										Action
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
										Entity
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
										Details
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-700">
								{logs.map((log) => (
									<tr
										key={log.id}
										className="hover:bg-slate-700/50 cursor-pointer"
										onClick={() => setSelectedLog(log)}
									>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
											{new Date(log.createdAt).toLocaleString()}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-white">
											{log.userName || log.userEmail || "Unknown"}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span
												className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}
											>
												{log.action}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
											{log.entityType}
										</td>
										<td className="px-6 py-4 text-sm text-slate-300">
											{log.entityName || log.entityId}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{/* Detail Modal */}
				{selectedLog && (
					<div
						className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
						onClick={() => setSelectedLog(null)}
					>
						<div
							className="bg-slate-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-xl font-bold text-white">Audit Log Details</h2>
								<button
									type="button"
									onClick={() => setSelectedLog(null)}
									className="text-slate-400 hover:text-white"
								>
									✕
								</button>
							</div>

							<div className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<p className="text-sm text-slate-400">Timestamp</p>
										<p className="text-white">
											{new Date(selectedLog.createdAt).toLocaleString()}
										</p>
									</div>
									<div>
										<p className="text-sm text-slate-400">User</p>
										<p className="text-white">
											{selectedLog.userName || selectedLog.userEmail || "Unknown"}
										</p>
									</div>
									<div>
										<p className="text-sm text-slate-400">Action</p>
										<span
											className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(selectedLog.action)}`}
										>
											{selectedLog.action}
										</span>
									</div>
									<div>
										<p className="text-sm text-slate-400">Entity Type</p>
										<p className="text-white">{selectedLog.entityType}</p>
									</div>
									<div>
										<p className="text-sm text-slate-400">Entity ID</p>
										<p className="text-white font-mono text-xs">{selectedLog.entityId}</p>
									</div>
									<div>
										<p className="text-sm text-slate-400">Entity Name</p>
										<p className="text-white">{selectedLog.entityName || "—"}</p>
									</div>
									{selectedLog.ipAddress && (
										<div>
											<p className="text-sm text-slate-400">IP Address</p>
											<p className="text-white font-mono text-xs">
												{selectedLog.ipAddress}
											</p>
										</div>
									)}
								</div>

								{selectedLog.beforeState && (
									<div>
										<p className="text-sm text-slate-400 mb-2">Before State</p>
										<pre className="bg-slate-900 p-4 rounded-lg text-xs text-slate-300 overflow-x-auto">
											{JSON.stringify(selectedLog.beforeState, null, 2)}
										</pre>
									</div>
								)}

								{selectedLog.afterState && (
									<div>
										<p className="text-sm text-slate-400 mb-2">After State</p>
										<pre className="bg-slate-900 p-4 rounded-lg text-xs text-slate-300 overflow-x-auto">
											{JSON.stringify(selectedLog.afterState, null, 2)}
										</pre>
									</div>
								)}

								{selectedLog.changes && (
									<div>
										<p className="text-sm text-slate-400 mb-2">Changes</p>
										<pre className="bg-slate-900 p-4 rounded-lg text-xs text-slate-300 overflow-x-auto">
											{JSON.stringify(selectedLog.changes, null, 2)}
										</pre>
									</div>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
