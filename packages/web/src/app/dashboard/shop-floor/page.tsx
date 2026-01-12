"use client";

import { useEffect, useState } from "react";

type WorkOrder = {
	id: string;
	woNumber: string;
	name: string;
	description: string | null;
	status: string;
	assignedTo: string | null;
	sequence: string;
	estimatedDuration: string | null;
	actualDuration: string | null;
	startedAt: string | null;
	completedAt: string | null;
	notes: string | null;
	manufacturingOrderId: string;
	createdAt: string;
};

type TimeEntry = {
	id: string;
	startTime: string;
	endTime: string | null;
	duration: string | null;
	notes: string | null;
};

export default function ShopFloorPage() {
	const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
	const [loading, setLoading] = useState(true);
	const [activeTimer, setActiveTimer] = useState<{ woId: string; startTime: Date } | null>(null);
	const [expandedWO, setExpandedWO] = useState<string | null>(null);

	useEffect(() => {
		loadWorkOrders();
		const interval = setInterval(loadWorkOrders, 30000); // Refresh every 30 seconds
		return () => clearInterval(interval);
	}, []);

	async function loadWorkOrders() {
		try {
			const res = await fetch(
				`/api/trpc/manufacturing.listWorkOrders?input=${encodeURIComponent(JSON.stringify({ limit: 100, offset: 0 }))}`,
				{
					credentials: "include",
				},
			);
			const data = await res.json();
			const orders = data.result.data.workOrders || [];
			// Sort by status priority: in_progress > pending > completed > cancelled
			const sorted = orders.sort((a: WorkOrder, b: WorkOrder) => {
				const statusPriority: Record<string, number> = {
					in_progress: 1,
					pending: 2,
					completed: 3,
					cancelled: 4,
				};
				return (statusPriority[a.status] || 5) - (statusPriority[b.status] || 5);
			});
			setWorkOrders(sorted);
		} catch (error) {
			console.error("Failed to load work orders:", error);
		} finally {
			setLoading(false);
		}
	}

	async function handleStart(wo: WorkOrder) {
		try {
			// Update work order status to in_progress
			await fetch("/api/trpc/manufacturing.updateWorkOrderStatus", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					id: wo.id,
					status: "in_progress",
				}),
			});

			// Create time entry
			const startTime = new Date();
			await fetch("/api/trpc/manufacturing.createTimeEntry", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					workOrderId: wo.id,
					startTime: startTime.toISOString(),
				}),
			});

			setActiveTimer({ woId: wo.id, startTime });
			await loadWorkOrders();
		} catch (error) {
			console.error("Failed to start work order:", error);
			alert("Failed to start work order");
		}
	}

	async function handleComplete(wo: WorkOrder) {
		try {
			// Update work order status to completed
			await fetch("/api/trpc/manufacturing.updateWorkOrderStatus", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					id: wo.id,
					status: "completed",
				}),
			});

			// Stop active timer if it exists
			if (activeTimer?.woId === wo.id) {
				setActiveTimer(null);
			}

			await loadWorkOrders();
		} catch (error) {
			console.error("Failed to complete work order:", error);
			alert("Failed to complete work order");
		}
	}

	function getStatusColor(status: string) {
		switch (status) {
			case "pending":
				return "bg-slate-700 text-slate-300";
			case "in_progress":
				return "bg-yellow-600 text-white";
			case "completed":
				return "bg-green-600 text-white";
			case "cancelled":
				return "bg-red-600 text-white";
			default:
				return "bg-slate-700 text-slate-300";
		}
	}

	function formatDuration(seconds: number) {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		if (hours > 0) {
			return `${hours}h ${minutes}m`;
		}
		return `${minutes}m`;
	}

	function getElapsedTime(woId: string) {
		if (activeTimer?.woId === woId) {
			const now = new Date();
			const elapsed = Math.floor((now.getTime() - activeTimer.startTime.getTime()) / 1000);
			return formatDuration(elapsed);
		}
		return null;
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-slate-900 flex items-center justify-center">
				<div className="text-white text-xl">Loading work orders...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-900 p-4 pb-24">
			<div className="max-w-2xl mx-auto">
				<h1 className="text-3xl font-bold text-white mb-6 text-center">Shop Floor</h1>

				{workOrders.length === 0 ? (
					<div className="bg-slate-800 rounded-lg p-12 text-center">
						<p className="text-slate-400 text-lg">No work orders available.</p>
					</div>
				) : (
					<div className="space-y-4">
						{workOrders.map((wo) => {
							const isExpanded = expandedWO === wo.id;
							const isActive = wo.status === "in_progress";
							const isCompleted = wo.status === "completed";
							const isCancelled = wo.status === "cancelled";
							const elapsedTime = getElapsedTime(wo.id);

							return (
								<div
									key={wo.id}
									className={`bg-slate-800 rounded-lg overflow-hidden ${
										isActive ? "ring-2 ring-yellow-500" : ""
									}`}
								>
									<button
										type="button"
										onClick={() => setExpandedWO(isExpanded ? null : wo.id)}
										className="w-full p-6 text-left"
									>
										<div className="flex items-start justify-between gap-4">
											<div className="flex-1">
												<div className="flex items-center gap-3 mb-2">
													<h2 className="text-xl font-bold text-white">
														{wo.woNumber}
													</h2>
													<span
														className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(wo.status)}`}
													>
														{wo.status.replace("_", " ")}
													</span>
												</div>
												<p className="text-lg text-slate-300">{wo.name}</p>
												{elapsedTime && (
													<p className="text-yellow-400 font-mono text-lg mt-2">
														⏱️ {elapsedTime}
													</p>
												)}
											</div>
											<div className="text-slate-400 text-3xl">
												{isExpanded ? "−" : "+"}
											</div>
										</div>
									</button>

									{isExpanded && (
										<div className="px-6 pb-6 space-y-4">
											{wo.description && (
												<div>
													<p className="text-sm text-slate-400 mb-1">Description</p>
													<p className="text-slate-300">{wo.description}</p>
												</div>
											)}

											{wo.estimatedDuration && (
												<div>
													<p className="text-sm text-slate-400 mb-1">
														Estimated Duration
													</p>
													<p className="text-slate-300">
														{formatDuration(Number.parseFloat(wo.estimatedDuration) * 60)}
													</p>
												</div>
											)}

											{wo.notes && (
												<div>
													<p className="text-sm text-slate-400 mb-1">Notes</p>
													<p className="text-slate-300">{wo.notes}</p>
												</div>
											)}

											<div className="flex gap-3 mt-6">
												{wo.status === "pending" && (
													<button
														type="button"
														onClick={() => handleStart(wo)}
														className="flex-1 py-4 bg-green-600 hover:bg-green-700 text-white text-xl font-bold rounded-lg transition-colors"
													>
														▶ Start
													</button>
												)}

												{wo.status === "in_progress" && (
													<button
														type="button"
														onClick={() => handleComplete(wo)}
														className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold rounded-lg transition-colors"
													>
														✓ Complete
													</button>
												)}

												{(isCompleted || isCancelled) && (
													<div className="flex-1 py-4 bg-slate-700 text-slate-400 text-xl font-bold rounded-lg text-center">
														{isCompleted ? "✓ Completed" : "✗ Cancelled"}
													</div>
												)}
											</div>
										</div>
									)}
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
