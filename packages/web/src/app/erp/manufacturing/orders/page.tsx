"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ManufacturingOrder = {
	id: string;
	moNumber: string;
	status: string;
	quantityToProduce: string;
	quantityProduced: string;
	scheduledStartDate: string | null;
	scheduledEndDate: string | null;
	actualStartDate: string | null;
	actualEndDate: string | null;
	notes: string | null;
	createdAt: string;
};

type Product = {
	id: string;
	name: string;
	sku: string;
};

export default function ManufacturingOrdersPage() {
	const [orders, setOrders] = useState<ManufacturingOrder[]>([]);
	const [products, setProducts] = useState<Record<string, Product>>({});
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("");

	useEffect(() => {
		loadOrders();
		loadProducts();
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
				`/api/trpc/manufacturing.listManufacturingOrders?input=${encodeURIComponent(JSON.stringify(params))}`,
				{
					credentials: "include",
				},
			);
			const data = await res.json();
			setOrders(data.result.data.manufacturingOrders || []);
		} catch (error) {
			console.error("Failed to load manufacturing orders:", error);
		} finally {
			setLoading(false);
		}
	}

	async function loadProducts() {
		try {
			const res = await fetch(
				`/api/trpc/products.listProducts?input=${encodeURIComponent(JSON.stringify({ limit: 1000, offset: 0 }))}`,
				{
					credentials: "include",
				},
			);
			const data = await res.json();
			const productMap: Record<string, Product> = {};
			for (const product of data.result.data.products || []) {
				productMap[product.id] = product;
			}
			setProducts(productMap);
		} catch (error) {
			console.error("Failed to load products:", error);
		}
	}

	function getStatusColor(status: string) {
		switch (status) {
			case "draft":
				return "bg-slate-700 text-slate-300";
			case "confirmed":
				return "bg-blue-900/50 text-blue-300";
			case "in_progress":
				return "bg-yellow-900/50 text-yellow-300";
			case "done":
				return "bg-green-900/50 text-green-300";
			case "cancelled":
				return "bg-red-900/50 text-red-300";
			default:
				return "bg-slate-700 text-slate-300";
		}
	}

	const filteredOrders = orders.filter((order) => {
		if (search && !order.moNumber.toLowerCase().includes(search.toLowerCase())) {
			return false;
		}
		return true;
	});

	return (
		<div className="min-h-screen bg-slate-900 p-6">
			<div className="max-w-7xl mx-auto">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-2xl font-bold text-white">Manufacturing Orders</h1>
					<Link
						href="/erp/manufacturing/orders/new"
						className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
					>
						Create Manufacturing Order
					</Link>
				</div>

				<div className="bg-slate-800 rounded-lg p-4 mb-6">
					<div className="flex gap-4">
						<input
							type="text"
							placeholder="Search by MO number..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<select
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
							className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="">All Statuses</option>
							<option value="draft">Draft</option>
							<option value="confirmed">Confirmed</option>
							<option value="in_progress">In Progress</option>
							<option value="done">Done</option>
							<option value="cancelled">Cancelled</option>
						</select>
					</div>
				</div>

				{loading ? (
					<div className="text-slate-400 text-center py-12">Loading...</div>
				) : filteredOrders.length === 0 ? (
					<div className="bg-slate-800 rounded-lg p-12 text-center">
						<p className="text-slate-400 mb-4">No manufacturing orders found.</p>
						<Link
							href="/erp/manufacturing/orders/new"
							className="text-blue-400 hover:text-blue-300"
						>
							Create your first manufacturing order
						</Link>
					</div>
				) : (
					<div className="bg-slate-800 rounded-lg overflow-hidden">
						<table className="w-full">
							<thead className="bg-slate-700">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
										MO Number
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
										Product
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
										Status
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
										Quantity
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
										Progress
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
										Scheduled Start
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-700">
								{filteredOrders.map((order) => {
									const product = products[(order as any).productId];
									const progress =
										(Number.parseFloat(order.quantityProduced) /
											Number.parseFloat(order.quantityToProduce)) *
										100;
									return (
										<tr key={order.id} className="hover:bg-slate-700/50">
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm font-medium text-white">
													{order.moNumber}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm text-slate-300">
													{product ? `${product.name} (${product.sku})` : "—"}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<span
													className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
												>
													{order.status.replace("_", " ")}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
												{order.quantityProduced} / {order.quantityToProduce}
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center gap-2">
													<div className="flex-1 bg-slate-700 rounded-full h-2 max-w-[100px]">
														<div
															className="bg-blue-500 h-2 rounded-full transition-all"
															style={{ width: `${Math.min(progress, 100)}%` }}
														/>
													</div>
													<span className="text-xs text-slate-400">
														{Math.round(progress)}%
													</span>
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
												{order.scheduledStartDate
													? new Date(order.scheduledStartDate).toLocaleDateString()
													: "—"}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm">
												<Link
													href={`/erp/manufacturing/orders/${order.id}`}
													className="text-blue-400 hover:text-blue-300"
												>
													View
												</Link>
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
