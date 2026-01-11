"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type PurchaseSuggestion = {
	productId: string;
	productName: string;
	productSku: string;
	currentStock: string;
	reorderPoint: string;
	quantityNeeded: string;
	reason: string;
};

export default function PurchasingPage() {
	const [suggestions, setSuggestions] = useState<PurchaseSuggestion[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadSuggestions();
	}, []);

	async function loadSuggestions() {
		try {
			const res = await fetch(
				"/api/trpc/purchasing.getPurchaseSuggestions",
				{
					credentials: "include",
				},
			);
			const data = await res.json();
			setSuggestions(data.result.data || []);
		} catch (error) {
			console.error("Failed to load purchase suggestions:", error);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen bg-slate-900 p-6">
			<div className="max-w-7xl mx-auto">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-2xl font-bold text-white">Purchasing</h1>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
					<Link
						href="/erp/purchasing/vendors"
						className="bg-slate-800 hover:bg-slate-700 rounded-lg p-6 transition-colors"
					>
						<h2 className="text-xl font-bold text-white mb-2">Vendors</h2>
						<p className="text-slate-400">Manage vendor relationships</p>
					</Link>

					<Link
						href="/erp/purchasing/orders"
						className="bg-slate-800 hover:bg-slate-700 rounded-lg p-6 transition-colors"
					>
						<h2 className="text-xl font-bold text-white mb-2">Purchase Orders</h2>
						<p className="text-slate-400">Create and track POs</p>
					</Link>

					<div className="bg-blue-900/30 border border-blue-700 rounded-lg p-6">
						<h2 className="text-xl font-bold text-white mb-2">
							{suggestions.length} Suggestions
						</h2>
						<p className="text-slate-400">Products to order</p>
					</div>
				</div>

				<div className="bg-slate-800 rounded-lg p-6">
					<h2 className="text-xl font-bold text-white mb-4">Purchase Suggestions</h2>

					{loading ? (
						<div className="text-slate-400 text-center py-8">Loading...</div>
					) : suggestions.length === 0 ? (
						<div className="text-slate-400 text-center py-8">
							No purchase suggestions at this time.
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-slate-700">
									<tr>
										<th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
											Product
										</th>
										<th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
											SKU
										</th>
										<th className="px-4 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
											Current Stock
										</th>
										<th className="px-4 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
											Reorder Point
										</th>
										<th className="px-4 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
											Qty Needed
										</th>
										<th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
											Reason
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-700">
									{suggestions.map((suggestion) => (
										<tr key={suggestion.productId} className="hover:bg-slate-700/50">
											<td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">
												{suggestion.productName}
											</td>
											<td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300">
												{suggestion.productSku}
											</td>
											<td className="px-4 py-3 whitespace-nowrap text-sm text-right text-slate-300">
												{Number.parseFloat(suggestion.currentStock).toFixed(0)}
											</td>
											<td className="px-4 py-3 whitespace-nowrap text-sm text-right text-slate-300">
												{Number.parseFloat(suggestion.reorderPoint).toFixed(0)}
											</td>
											<td className="px-4 py-3 whitespace-nowrap text-sm text-right font-bold text-yellow-400">
												{Number.parseFloat(suggestion.quantityNeeded).toFixed(0)}
											</td>
											<td className="px-4 py-3 whitespace-nowrap text-sm text-slate-400">
												{suggestion.reason}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
