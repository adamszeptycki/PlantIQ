"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Account = {
	id: string;
	code: string;
	name: string;
	accountType: string;
	balance: string;
	isActive: boolean;
};

export default function AccountingPage() {
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadAccounts();
	}, []);

	async function loadAccounts() {
		try {
			const res = await fetch("/api/trpc/accounting.listAccounts", {
				credentials: "include",
			});
			const data = await res.json();
			setAccounts(data.result.data || []);
		} catch (error) {
			console.error("Failed to load accounts:", error);
		} finally {
			setLoading(false);
		}
	}

	function getAccountTypeColor(type: string) {
		switch (type) {
			case "asset":
				return "bg-green-900/50 text-green-300";
			case "liability":
				return "bg-red-900/50 text-red-300";
			case "equity":
				return "bg-purple-900/50 text-purple-300";
			case "revenue":
				return "bg-blue-900/50 text-blue-300";
			case "expense":
				return "bg-orange-900/50 text-orange-300";
			default:
				return "bg-slate-700 text-slate-300";
		}
	}

	const totalAssets = accounts
		.filter((a) => a.accountType === "asset")
		.reduce((sum, a) => sum + Number.parseFloat(a.balance), 0);

	const totalLiabilities = accounts
		.filter((a) => a.accountType === "liability")
		.reduce((sum, a) => sum + Number.parseFloat(a.balance), 0);

	const totalEquity = accounts
		.filter((a) => a.accountType === "equity")
		.reduce((sum, a) => sum + Number.parseFloat(a.balance), 0);

	return (
		<div className="min-h-screen bg-slate-900 p-6">
			<div className="max-w-7xl mx-auto">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-2xl font-bold text-white">Accounting</h1>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
					<div className="bg-slate-800 rounded-lg p-6">
						<h2 className="text-sm font-medium text-slate-400 mb-2">Total Assets</h2>
						<p className="text-2xl font-bold text-green-400">
							${totalAssets.toFixed(2)}
						</p>
					</div>

					<div className="bg-slate-800 rounded-lg p-6">
						<h2 className="text-sm font-medium text-slate-400 mb-2">
							Total Liabilities
						</h2>
						<p className="text-2xl font-bold text-red-400">
							${totalLiabilities.toFixed(2)}
						</p>
					</div>

					<div className="bg-slate-800 rounded-lg p-6">
						<h2 className="text-sm font-medium text-slate-400 mb-2">Total Equity</h2>
						<p className="text-2xl font-bold text-purple-400">
							${totalEquity.toFixed(2)}
						</p>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
					<Link
						href="/dashboard/accounting/chart-of-accounts"
						className="bg-slate-800 hover:bg-slate-700 rounded-lg p-6 transition-colors"
					>
						<h2 className="text-xl font-bold text-white mb-2">Chart of Accounts</h2>
						<p className="text-slate-400">Manage account structure</p>
					</Link>

					<Link
						href="/dashboard/accounting/invoices"
						className="bg-slate-800 hover:bg-slate-700 rounded-lg p-6 transition-colors"
					>
						<h2 className="text-xl font-bold text-white mb-2">Invoices</h2>
						<p className="text-slate-400">Customer & vendor invoicing</p>
					</Link>
				</div>

				<div className="bg-slate-800 rounded-lg p-6">
					<h2 className="text-xl font-bold text-white mb-4">Chart of Accounts</h2>

					{loading ? (
						<div className="text-slate-400 text-center py-8">Loading...</div>
					) : accounts.length === 0 ? (
						<div className="text-slate-400 text-center py-8">
							No accounts found. Initialize your chart of accounts.
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-slate-700">
									<tr>
										<th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase">
											Code
										</th>
										<th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase">
											Name
										</th>
										<th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase">
											Type
										</th>
										<th className="px-4 py-3 text-right text-xs font-medium text-slate-300 uppercase">
											Balance
										</th>
										<th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase">
											Status
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-700">
									{accounts.map((account) => (
										<tr key={account.id} className="hover:bg-slate-700/50">
											<td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-slate-300">
												{account.code}
											</td>
											<td className="px-4 py-3 whitespace-nowrap text-sm text-white">
												{account.name}
											</td>
											<td className="px-4 py-3 whitespace-nowrap">
												<span
													className={`px-2 py-1 rounded-full text-xs font-medium ${getAccountTypeColor(account.accountType)}`}
												>
													{account.accountType}
												</span>
											</td>
											<td className="px-4 py-3 whitespace-nowrap text-sm text-right font-mono text-slate-300">
												${Number.parseFloat(account.balance).toFixed(2)}
											</td>
											<td className="px-4 py-3 whitespace-nowrap">
												<span
													className={`px-2 py-1 rounded-full text-xs font-medium ${
														account.isActive
															? "bg-green-900/50 text-green-300"
															: "bg-red-900/50 text-red-300"
													}`}
												>
													{account.isActive ? "Active" : "Inactive"}
												</span>
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
