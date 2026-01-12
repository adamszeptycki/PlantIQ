"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Lead = {
	id: string;
	name: string;
	company: string | null;
	email: string | null;
	phone: string | null;
	status: string;
	estimatedValue: string | null;
	assignedTo: string | null;
	createdAt: Date;
};

const LEAD_STATUSES = [
	{ value: "new", label: "New", color: "bg-slate-700" },
	{ value: "contacted", label: "Contacted", color: "bg-blue-700" },
	{ value: "qualified", label: "Qualified", color: "bg-purple-700" },
	{ value: "proposal", label: "Proposal", color: "bg-yellow-700" },
	{ value: "negotiation", label: "Negotiation", color: "bg-orange-700" },
	{ value: "won", label: "Won", color: "bg-green-700" },
	{ value: "lost", label: "Lost", color: "bg-red-700" },
];

export default function LeadsPage() {
	const [leads, setLeads] = useState<Lead[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchLeads();
	}, []);

	async function fetchLeads() {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch(
				`/api/trpc/sales.listLeads?input=${encodeURIComponent(JSON.stringify({ limit: 100, offset: 0 }))}`,
				{
					credentials: "include",
				},
			);

			if (!res.ok) {
				throw new Error("Failed to fetch leads");
			}

			const data = await res.json();
			setLeads(data.result.data.leads);
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setLoading(false);
		}
	}

	async function updateLeadStatus(leadId: string, newStatus: string) {
		try {
			const res = await fetch("/api/trpc/sales.updateLeadStatus", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: leadId, status: newStatus }),
				credentials: "include",
			});

			if (!res.ok) {
				throw new Error("Failed to update lead status");
			}

			// Refresh leads
			await fetchLeads();
		} catch (err) {
			setError((err as Error).message);
		}
	}

	const leadsByStatus = LEAD_STATUSES.map((status) => ({
		...status,
		leads: leads.filter((lead) => lead.status === status.value),
	}));

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-white">Leads</h1>
					<p className="mt-1 text-sm text-slate-400">Track your sales pipeline</p>
				</div>
				<Link
					href="/dashboard/sales/leads/new"
					className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
				>
					+ New Lead
				</Link>
			</div>

			{/* Error */}
			{error ? (
				<div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4">
					<p className="text-sm text-red-400">{error}</p>
				</div>
			) : null}

			{/* Loading */}
			{loading ? (
				<div className="flex items-center justify-center py-12">
					<p className="text-slate-400">Loading leads...</p>
				</div>
			) : null}

			{/* Kanban Board */}
			{!loading ? (
				<div className="flex gap-4 overflow-x-auto pb-4">
					{leadsByStatus.map((column) => (
						<div key={column.value} className="min-w-80 flex-shrink-0">
							<div className="rounded-lg border border-slate-800 bg-slate-900/60">
								{/* Column Header */}
								<div className={`${column.color} rounded-t-lg px-4 py-3`}>
									<div className="flex items-center justify-between">
										<h3 className="font-semibold text-white">{column.label}</h3>
										<span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium text-white">
											{column.leads.length}
										</span>
									</div>
								</div>

								{/* Cards */}
								<div className="space-y-2 p-3">
									{column.leads.length === 0 ? (
										<p className="py-8 text-center text-sm text-slate-500">No leads</p>
									) : null}

									{column.leads.map((lead) => (
										<div
											key={lead.id}
											className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 hover:border-slate-600"
										>
											<div className="mb-2">
												<h4 className="font-medium text-white">{lead.name}</h4>
												{lead.company ? (
													<p className="text-xs text-slate-400">{lead.company}</p>
												) : null}
											</div>

											{lead.email ? (
												<p className="mb-2 text-xs text-slate-400">{lead.email}</p>
											) : null}

											{lead.estimatedValue ? (
												<p className="mb-3 text-sm font-medium text-green-400">
													${lead.estimatedValue}
												</p>
											) : null}

											{/* Status Dropdown */}
											<select
												value={lead.status}
												onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
												className="w-full rounded border border-slate-600 bg-slate-900 px-2 py-1 text-xs text-white focus:border-blue-500 focus:outline-none"
											>
												{LEAD_STATUSES.map((status) => (
													<option key={status.value} value={status.value}>
														{status.label}
													</option>
												))}
											</select>
										</div>
									))}
								</div>
							</div>
						</div>
					))}
				</div>
			) : null}

			{/* Empty State */}
			{!loading && leads.length === 0 ? (
				<div className="flex flex-col items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 py-12">
					<p className="text-slate-400">No leads found</p>
					<Link
						href="/dashboard/sales/leads/new"
						className="mt-4 text-sm text-blue-400 hover:text-blue-300"
					>
						Create your first lead
					</Link>
				</div>
			) : null}
		</div>
	);
}
