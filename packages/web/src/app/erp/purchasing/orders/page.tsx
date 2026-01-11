"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type PurchaseOrder = {
	id: string;
	poNumber: string;
	status: string;
	orderDate: string;
	expectedDate: string | null;
	total: string;
	vendorId: string;
	createdAt: string;
};

type Vendor = {
	id: string;
	name: string;
};

export default function PurchaseOrdersPage() {
	const [orders, setOrders] = useState<PurchaseOrder[]>([]);
	const [vendors, setVendors] = useState<Record<string, Vendor>>({});
	const [loading, setLoading] = useState(true);
	const [statusFilter, setStatusFilter] = useState("");

	useEffect(() => {
		loadOrders();
		loadVendors();
	}, [statusFilter]);

	async function loadOrders() {
		setLoading(true);
		try {
			const params = {
				limit: 50,
				offset: 0,
				status: statusFilter || null,
			};
			const res = await fetch(
				`/api/trpc/purchasing.listPurchaseOrders?input=${encodeURIComponent(JSON.stringify(params))}`,
				{
					credentials: "include",
				},
			);
			const data = await res.json();
			setOrders(data.result.data.purchaseOrders || []);
		} catch (error) {
			console.error("Failed to load purchase orders:", error);
		} finally {
			setLoading(false);
		}
	}

	async function loadVendors() {
		try {
			const res = await fetch(
				`/api/trpc/purchasing.listVendors?input=${encodeURIComponent(JSON.stringify({ limit: 1000, offset: 0 }))}`,
				{
					credentials: "include",
				},
			);
			const data = await res.json();
			const vendorMap: Record<string, Vendor> = {};
			for (const vendor of data.result.data.vendors || []) {
				vendorMap[vendor.id] = vendor;
			}
			setVendors(vendorMap);
		} catch (error) {
			console.error("Failed to load vendors:", error);
		}
	}

	function getStatusColor(status: string) {
		switch (status) {
			case "draft":
				return "bg-slate-700 text-slate-300";
			case "sent":
				return "bg-blue-900/50 text-blue-300";
			case "confirmed":
				return "bg-purple-900/50 text-purple-300";
			case "received":
				return "bg-green-900/50 text-green-300";
			case "cancelled":
				return "bg-red-900/50 text-red-300";
			default:
				return "bg-slate-700 text-slate-300";
		}
	}

	return (
		<div className="min-h-screen bg-slate-900 p-6">
			<div className="max-w-7xl mx-auto">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-2xl font-bold text-white">Purchase Orders</h1>
					<Link
						href="/erp/purchasing/orders/new"
						className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
					>
						Create Purchase Order
					</Link>
				</div>

				<div className="bg-slate-800 rounded-lg p-4 mb-6">
					<select
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value)}
						className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="">All Statuses</option>
						<option value="draft">Draft</option>
						<option value="sent">Sent</option>
						<option value="confirmed">Confirmed</option>
						<option value="received">Received</option>
						<option value="cancelled">Cancelled</option>
					</select>
				</div>

				{loading ? (
					<div className="text-slate-400 text-center py-12">Loading...</div>
				) : orders.length === 0 ? (
					<div className="bg-slate-800 rounded-lg p-12 text-center">
						<p className="text-slate-400 mb-4">No purchase orders found.</p>
						<Link
							href="/erp/purchasing/orders/new"
							className="text-blue-400 hover:text-blue-300"
						>
							Create your first purchase order
						</Link>
					</div>
				) : (
					<div className="bg-slate-800 rounded-lg overflow-hidden">
						<table className="w-full">
							<thead className="bg-slate-700">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
										PO Number
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
										Vendor
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
										Status
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
										Order Date
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
										Expected Date
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
										Total
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-700">
								{orders.map((order) => {
									const vendor = vendors[order.vendorId];
									return (
										<tr key={order.id} className="hover:bg-slate-700/50">
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm font-medium text-white">
													{order.poNumber}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
												{vendor ? vendor.name : "—"}
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<span
													className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
												>
													{order.status}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
												{new Date(order.orderDate).toLocaleDateString()}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
												{order.expectedDate
													? new Date(order.expectedDate).toLocaleDateString()
													: "—"}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-white">
												${Number.parseFloat(order.total).toFixed(2)}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
}
