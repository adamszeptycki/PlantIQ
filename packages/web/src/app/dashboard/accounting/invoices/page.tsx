"use client";

import { useEffect, useState } from "react";

type Invoice = {
	id: string;
	invoiceNumber: string;
	invoiceType: string;
	status: string;
	invoiceDate: string;
	dueDate: string | null;
	total: string;
	amountPaid: string;
	createdAt: string;
};

export default function InvoicesPage() {
	const [invoices, setInvoices] = useState<Invoice[]>([]);
	const [loading, setLoading] = useState(true);
	const [typeFilter, setTypeFilter] = useState("");

	useEffect(() => {
		loadInvoices();
	}, [typeFilter]);

	async function loadInvoices() {
		setLoading(true);
		try {
			const params = typeFilter ? { invoiceType: typeFilter } : {};
			const res = await fetch(
				`/api/trpc/accounting.listInvoices?input=${encodeURIComponent(JSON.stringify(params))}`,
				{
					credentials: "include",
				},
			);
			const data = await res.json();
			setInvoices(data.result.data || []);
		} catch (error) {
			console.error("Failed to load invoices:", error);
		} finally {
			setLoading(false);
		}
	}

	function getStatusColor(status: string) {
		switch (status) {
			case "draft":
				return "bg-slate-700 text-slate-300";
			case "posted":
				return "bg-blue-900/50 text-blue-300";
			case "paid":
				return "bg-green-900/50 text-green-300";
			case "cancelled":
				return "bg-red-900/50 text-red-300";
			default:
				return "bg-slate-700 text-slate-300";
		}
	}

	const receivables = invoices
		.filter((inv) => inv.invoiceType === "customer" && inv.status !== "paid")
		.reduce((sum, inv) => sum + Number.parseFloat(inv.total) - Number.parseFloat(inv.amountPaid), 0);

	const payables = invoices
		.filter((inv) => inv.invoiceType === "vendor" && inv.status !== "paid")
		.reduce((sum, inv) => sum + Number.parseFloat(inv.total) - Number.parseFloat(inv.amountPaid), 0);

	return (
		<div className="min-h-screen bg-slate-900 p-6">
			<div className="max-w-7xl mx-auto">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-2xl font-bold text-white">Invoices</h1>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
					<div className="bg-slate-800 rounded-lg p-6">
						<h2 className="text-sm font-medium text-slate-400 mb-2">
							Accounts Receivable
						</h2>
						<p className="text-2xl font-bold text-green-400">${receivables.toFixed(2)}</p>
						<p className="text-xs text-slate-500 mt-1">Customer invoices outstanding</p>
					</div>

					<div className="bg-slate-800 rounded-lg p-6">
						<h2 className="text-sm font-medium text-slate-400 mb-2">Accounts Payable</h2>
						<p className="text-2xl font-bold text-red-400">${payables.toFixed(2)}</p>
						<p className="text-xs text-slate-500 mt-1">Vendor bills outstanding</p>
					</div>
				</div>

				<div className="bg-slate-800 rounded-lg p-4 mb-6">
					<div className="flex gap-4">
						<button
							type="button"
							onClick={() => setTypeFilter("")}
							className={`px-4 py-2 rounded-lg transition-colors ${
								typeFilter === ""
									? "bg-blue-600 text-white"
									: "bg-slate-700 text-slate-300 hover:bg-slate-600"
							}`}
						>
							All
						</button>
						<button
							type="button"
							onClick={() => setTypeFilter("customer")}
							className={`px-4 py-2 rounded-lg transition-colors ${
								typeFilter === "customer"
									? "bg-blue-600 text-white"
									: "bg-slate-700 text-slate-300 hover:bg-slate-600"
							}`}
						>
							Customer Invoices (AR)
						</button>
						<button
							type="button"
							onClick={() => setTypeFilter("vendor")}
							className={`px-4 py-2 rounded-lg transition-colors ${
								typeFilter === "vendor"
									? "bg-blue-600 text-white"
									: "bg-slate-700 text-slate-300 hover:bg-slate-600"
							}`}
						>
							Vendor Bills (AP)
						</button>
					</div>
				</div>

				{loading ? (
					<div className="text-slate-400 text-center py-12">Loading...</div>
				) : invoices.length === 0 ? (
					<div className="bg-slate-800 rounded-lg p-12 text-center">
						<p className="text-slate-400">No invoices found.</p>
					</div>
				) : (
					<div className="bg-slate-800 rounded-lg overflow-hidden">
						<table className="w-full">
							<thead className="bg-slate-700">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
										Invoice #
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
										Type
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
										Status
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
										Date
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
										Due Date
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase">
										Total
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase">
										Paid
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase">
										Balance
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-700">
								{invoices.map((invoice) => {
									const balance =
										Number.parseFloat(invoice.total) -
										Number.parseFloat(invoice.amountPaid);
									return (
										<tr key={invoice.id} className="hover:bg-slate-700/50">
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
												{invoice.invoiceNumber}
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<span
													className={`px-2 py-1 rounded-full text-xs font-medium ${
														invoice.invoiceType === "customer"
															? "bg-green-900/50 text-green-300"
															: "bg-orange-900/50 text-orange-300"
													}`}
												>
													{invoice.invoiceType}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<span
													className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}
												>
													{invoice.status}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
												{new Date(invoice.invoiceDate).toLocaleDateString()}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
												{invoice.dueDate
													? new Date(invoice.dueDate).toLocaleDateString()
													: "—"}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono text-slate-300">
												${Number.parseFloat(invoice.total).toFixed(2)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono text-slate-300">
												${Number.parseFloat(invoice.amountPaid).toFixed(2)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono text-white font-bold">
												${balance.toFixed(2)}
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
