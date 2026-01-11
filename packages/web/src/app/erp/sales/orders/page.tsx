"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type SalesOrder = {
	id: string;
	orderNumber: string;
	customerId: string;
	status: string;
	total: string;
	orderDate: string | null;
	expectedDeliveryDate: string | null;
	createdAt: Date;
};

export default function SalesOrdersPage() {
	const router = useRouter();
	const [orders, setOrders] = useState<SalesOrder[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState("");
	const [total, setTotal] = useState(0);

	useEffect(() => {
		fetchOrders();
	}, [search]);

	async function fetchOrders() {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch(
				`/api/trpc/sales.listSalesOrders?input=${encodeURIComponent(JSON.stringify({ search, limit: 50, offset: 0 }))}`,
				{
					credentials: "include",
				},
			);

			if (!res.ok) {
				throw new Error("Failed to fetch sales orders");
			}

			const data = await res.json();
			setOrders(data.result.data.salesOrders);
			setTotal(data.result.data.total);
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen bg-slate-900 p-8">
			<div className="max-w-7xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<div>
						<h1 className="text-3xl font-bold text-white">Sales Orders</h1>
						<p className="text-slate-400 mt-1">Manage customer orders and fulfillment</p>
					</div>
					<Link
						href="/erp/sales/orders/new"
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						Create Order
					</Link>
				</div>

				<div className="bg-slate-800 rounded-lg p-6 mb-6">
					<input
						type="text"
						placeholder="Search orders..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
					/>
				</div>

				{error && (
					<div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400">
						{error}
					</div>
				)}

				{loading ? (
					<div className="bg-slate-800 rounded-lg p-8 text-center">
						<p className="text-slate-400">Loading orders...</p>
					</div>
				) : (
					<div className="bg-slate-800 rounded-lg overflow-hidden">
						<table className="w-full">
							<thead className="bg-slate-700">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
										Order #
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
										Customer
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
										Status
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
										Total
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
										Order Date
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
										Expected Delivery
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-700">
								{orders.length === 0 ? (
									<tr>
										<td colSpan={7} className="px-6 py-8 text-center text-slate-400">
											No orders found. Create your first order to get started.
										</td>
									</tr>
								) : (
									orders.map((order) => (
										<tr key={order.id} className="hover:bg-slate-700/50">
											<td className="px-6 py-4 text-sm text-white">{order.orderNumber}</td>
											<td className="px-6 py-4 text-sm text-slate-300">{order.customerId}</td>
											<td className="px-6 py-4 text-sm">
												<span
													className={`px-2 py-1 rounded-full text-xs font-medium ${
														order.status === "draft"
															? "bg-slate-600 text-slate-200"
															: order.status === "confirmed"
																? "bg-blue-600 text-blue-100"
																: order.status === "in_production"
																	? "bg-purple-600 text-purple-100"
																	: order.status === "ready"
																		? "bg-yellow-600 text-yellow-100"
																		: order.status === "delivered"
																			? "bg-green-600 text-green-100"
																			: order.status === "invoiced"
																				? "bg-teal-600 text-teal-100"
																				: "bg-red-600 text-red-100"
													}`}
												>
													{order.status}
												</span>
											</td>
											<td className="px-6 py-4 text-sm text-white font-medium">
												${Number(order.total).toFixed(2)}
											</td>
											<td className="px-6 py-4 text-sm text-slate-300">
												{order.orderDate || "N/A"}
											</td>
											<td className="px-6 py-4 text-sm text-slate-300">
												{order.expectedDeliveryDate || "N/A"}
											</td>
											<td className="px-6 py-4 text-sm">
												<Link
													href={`/erp/sales/orders/${order.id}`}
													className="text-blue-400 hover:text-blue-300"
												>
													View
												</Link>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				)}

				{orders.length > 0 && (
					<div className="mt-4 text-sm text-slate-400 text-center">
						Showing {orders.length} of {total} orders
					</div>
				)}

				<div className="mt-6">
					<Link href="/erp" className="text-blue-400 hover:text-blue-300">
						← Back to Dashboard
					</Link>
				</div>
			</div>
		</div>
	);
}
