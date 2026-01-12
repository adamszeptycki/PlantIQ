"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type StockItem = {
	id: string;
	productId: string;
	locationId: string;
	quantity: string;
	reservedQuantity: string;
	productSku: string;
	productName: string;
	productUom: string;
	locationName: string;
	locationCode: string;
};

export default function InventoryPage() {
	const [stock, setStock] = useState<StockItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchStock();
	}, []);

	async function fetchStock() {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch("/api/trpc/inventory.listStock", {
				credentials: "include",
			});

			if (!res.ok) {
				throw new Error("Failed to fetch stock");
			}

			const data = await res.json();
			setStock(data.result.data);
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setLoading(false);
		}
	}

	const totalValue = stock.reduce((sum, item) => {
		const qty = Number.parseFloat(item.quantity) || 0;
		return sum + qty;
	}, 0);

	const totalReserved = stock.reduce((sum, item) => {
		const reserved = Number.parseFloat(item.reservedQuantity) || 0;
		return sum + reserved;
	}, 0);

	const available = totalValue - totalReserved;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-white">Inventory</h1>
					<p className="mt-1 text-sm text-slate-400">Manage stock levels across all locations</p>
				</div>
				<Link
					href="/dashboard/inventory/locations"
					className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
				>
					Manage Locations
				</Link>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-3 gap-6">
				<div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
					<p className="text-sm font-medium text-slate-400">Total Stock</p>
					<p className="mt-2 text-3xl font-bold text-white">{totalValue.toFixed(2)}</p>
				</div>
				<div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
					<p className="text-sm font-medium text-slate-400">Reserved</p>
					<p className="mt-2 text-3xl font-bold text-yellow-400">{totalReserved.toFixed(2)}</p>
				</div>
				<div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
					<p className="text-sm font-medium text-slate-400">Available</p>
					<p className="mt-2 text-3xl font-bold text-green-400">{available.toFixed(2)}</p>
				</div>
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
					<p className="text-slate-400">Loading inventory...</p>
				</div>
			) : null}

			{/* Stock Table */}
			{!loading && stock.length > 0 ? (
				<div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900/60">
					<table className="w-full">
						<thead className="border-b border-slate-800 bg-slate-900">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
									Product
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
									Location
								</th>
								<th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-400">
									Quantity
								</th>
								<th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-400">
									Reserved
								</th>
								<th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-400">
									Available
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-800">
							{stock.map((item) => {
								const qty = Number.parseFloat(item.quantity) || 0;
								const reserved = Number.parseFloat(item.reservedQuantity) || 0;
								const avail = qty - reserved;

								return (
									<tr key={item.id} className="hover:bg-slate-800/30">
										<td className="px-6 py-4 text-sm">
											<div>
												<div className="font-medium text-white">{item.productName}</div>
												<div className="text-xs text-slate-400">{item.productSku}</div>
											</div>
										</td>
										<td className="px-6 py-4 text-sm text-slate-300">
											<div>
												<div className="font-medium">{item.locationName}</div>
												<div className="text-xs text-slate-400">{item.locationCode}</div>
											</div>
										</td>
										<td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-white">
											{qty.toFixed(2)} {item.productUom}
										</td>
										<td className="whitespace-nowrap px-6 py-4 text-right text-sm text-yellow-400">
											{reserved > 0 ? `${reserved.toFixed(2)} ${item.productUom}` : "-"}
										</td>
										<td className="whitespace-nowrap px-6 py-4 text-right text-sm">
											<span
												className={`font-medium ${
													avail <= 0 ? "text-red-400" : avail < 10 ? "text-yellow-400" : "text-green-400"
												}`}
											>
												{avail.toFixed(2)} {item.productUom}
											</span>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			) : null}

			{/* Empty State */}
			{!loading && stock.length === 0 ? (
				<div className="flex flex-col items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 py-12">
					<p className="text-slate-400">No stock records found</p>
					<p className="mt-2 text-sm text-slate-500">Stock will appear here after receiving inventory</p>
				</div>
			) : null}
		</div>
	);
}
