"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Customer = {
	id: string;
	name: string;
	email: string | null;
	phone: string | null;
	city: string | null;
	state: string | null;
	creditLimit: string | null;
	createdAt: Date;
};

export default function CustomersPage() {
	const router = useRouter();
	const [customers, setCustomers] = useState<Customer[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState("");
	const [total, setTotal] = useState(0);

	useEffect(() => {
		fetchCustomers();
	}, [search]);

	async function fetchCustomers() {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch(
				`/api/trpc/sales.listCustomers?input=${encodeURIComponent(JSON.stringify({ search, limit: 50, offset: 0 }))}`,
				{
					credentials: "include",
				},
			);

			if (!res.ok) {
				throw new Error("Failed to fetch customers");
			}

			const data = await res.json();
			setCustomers(data.result.data.customers);
			setTotal(data.result.data.total);
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-white">Customers</h1>
					<p className="mt-1 text-sm text-slate-400">Manage your customer base</p>
				</div>
				<Link
					href="/dashboard/sales/customers/new"
					className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
				>
					+ New Customer
				</Link>
			</div>

			{/* Search */}
			<div className="flex items-center gap-4">
				<input
					type="text"
					placeholder="Search customers..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="w-96 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
				/>
				<p className="text-sm text-slate-400">{total} customers</p>
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
					<p className="text-slate-400">Loading customers...</p>
				</div>
			) : null}

			{/* Customers Table */}
			{!loading && customers.length > 0 ? (
				<div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900/60">
					<table className="w-full">
						<thead className="border-b border-slate-800 bg-slate-900">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
									Name
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
									Contact
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
									Location
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
									Credit Limit
								</th>
								<th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-400">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-800">
							{customers.map((customer) => (
								<tr key={customer.id} className="hover:bg-slate-800/30">
									<td className="px-6 py-4 text-sm font-medium text-white">{customer.name}</td>
									<td className="px-6 py-4 text-sm text-slate-300">
										<div>
											{customer.email ? (
												<div className="text-sm">{customer.email}</div>
											) : null}
											{customer.phone ? (
												<div className="text-xs text-slate-400">{customer.phone}</div>
											) : null}
										</div>
									</td>
									<td className="px-6 py-4 text-sm text-slate-300">
										{customer.city && customer.state
											? `${customer.city}, ${customer.state}`
											: customer.city || customer.state || "-"}
									</td>
									<td className="px-6 py-4 text-sm text-slate-300">
										{customer.creditLimit ? `$${customer.creditLimit}` : "-"}
									</td>
									<td className="whitespace-nowrap px-6 py-4 text-right text-sm">
										<button
											type="button"
											className="text-blue-400 hover:text-blue-300"
											onClick={() => router.push(`/dashboard/sales/customers/${customer.id}`)}
										>
											View
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : null}

			{/* Empty State */}
			{!loading && customers.length === 0 ? (
				<div className="flex flex-col items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 py-12">
					<p className="text-slate-400">No customers found</p>
					<Link
						href="/dashboard/sales/customers/new"
						className="mt-4 text-sm text-blue-400 hover:text-blue-300"
					>
						Create your first customer
					</Link>
				</div>
			) : null}
		</div>
	);
}
