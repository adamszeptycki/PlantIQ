"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Quote = {
	id: string;
	quoteNumber: string;
	customerId: string;
	status: string;
	total: string;
	validUntil: string | null;
	createdAt: Date;
};

export default function QuotesPage() {
	const router = useRouter();
	const [quotes, setQuotes] = useState<Quote[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState("");
	const [total, setTotal] = useState(0);

	useEffect(() => {
		fetchQuotes();
	}, [search]);

	async function fetchQuotes() {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch(
				`/api/trpc/sales.listQuotes?input=${encodeURIComponent(JSON.stringify({ search, limit: 50, offset: 0 }))}`,
				{
					credentials: "include",
				},
			);

			if (!res.ok) {
				throw new Error("Failed to fetch quotes");
			}

			const data = await res.json();
			setQuotes(data.result.data.quotes);
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
						<h1 className="text-3xl font-bold text-white">Quotes</h1>
						<p className="text-slate-400 mt-1">Manage sales quotes and proposals</p>
					</div>
					<Link
						href="/dashboard/sales/quotes/new"
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						Create Quote
					</Link>
				</div>

				<div className="bg-slate-800 rounded-lg p-6 mb-6">
					<input
						type="text"
						placeholder="Search quotes..."
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
						<p className="text-slate-400">Loading quotes...</p>
					</div>
				) : (
					<div className="bg-slate-800 rounded-lg overflow-hidden">
						<table className="w-full">
							<thead className="bg-slate-700">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
										Quote #
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
										Valid Until
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-700">
								{quotes.length === 0 ? (
									<tr>
										<td colSpan={6} className="px-6 py-8 text-center text-slate-400">
											No quotes found. Create your first quote to get started.
										</td>
									</tr>
								) : (
									quotes.map((quote) => (
										<tr key={quote.id} className="hover:bg-slate-700/50">
											<td className="px-6 py-4 text-sm text-white">{quote.quoteNumber}</td>
											<td className="px-6 py-4 text-sm text-slate-300">{quote.customerId}</td>
											<td className="px-6 py-4 text-sm">
												<span
													className={`px-2 py-1 rounded-full text-xs font-medium ${
														quote.status === "draft"
															? "bg-slate-600 text-slate-200"
															: quote.status === "sent"
																? "bg-blue-600 text-blue-100"
																: quote.status === "accepted"
																	? "bg-green-600 text-green-100"
																	: quote.status === "rejected"
																		? "bg-red-600 text-red-100"
																		: "bg-orange-600 text-orange-100"
													}`}
												>
													{quote.status}
												</span>
											</td>
											<td className="px-6 py-4 text-sm text-white font-medium">
												${Number(quote.total).toFixed(2)}
											</td>
											<td className="px-6 py-4 text-sm text-slate-300">
												{quote.validUntil || "N/A"}
											</td>
											<td className="px-6 py-4 text-sm">
												<Link
													href={`/dashboard/sales/quotes/${quote.id}`}
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

				{quotes.length > 0 && (
					<div className="mt-4 text-sm text-slate-400 text-center">
						Showing {quotes.length} of {total} quotes
					</div>
				)}

				<div className="mt-6">
					<Link href="/dashboard" className="text-blue-400 hover:text-blue-300">
						← Back to Dashboard
					</Link>
				</div>
			</div>
		</div>
	);
}
