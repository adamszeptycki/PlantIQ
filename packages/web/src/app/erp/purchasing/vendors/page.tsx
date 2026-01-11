"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Vendor = {
	id: string;
	name: string;
	code: string | null;
	email: string | null;
	phone: string | null;
	city: string | null;
	country: string | null;
	isActive: boolean;
	createdAt: string;
};

export default function VendorsPage() {
	const [vendors, setVendors] = useState<Vendor[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");

	useEffect(() => {
		loadVendors();
	}, []);

	async function loadVendors() {
		try {
			const res = await fetch(
				`/api/trpc/purchasing.listVendors?input=${encodeURIComponent(JSON.stringify({ limit: 100, offset: 0 }))}`,
				{
					credentials: "include",
				},
			);
			const data = await res.json();
			setVendors(data.result.data.vendors || []);
		} catch (error) {
			console.error("Failed to load vendors:", error);
		} finally {
			setLoading(false);
		}
	}

	const filteredVendors = vendors.filter((vendor) => {
		if (search && !vendor.name.toLowerCase().includes(search.toLowerCase())) {
			return false;
		}
		return true;
	});

	return (
		<div className="min-h-screen bg-slate-900 p-6">
			<div className="max-w-7xl mx-auto">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-2xl font-bold text-white">Vendors</h1>
					<Link
						href="/erp/purchasing/vendors/new"
						className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
					>
						Add Vendor
					</Link>
				</div>

				<div className="bg-slate-800 rounded-lg p-4 mb-6">
					<input
						type="text"
						placeholder="Search vendors..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				{loading ? (
					<div className="text-slate-400 text-center py-12">Loading...</div>
				) : filteredVendors.length === 0 ? (
					<div className="bg-slate-800 rounded-lg p-12 text-center">
						<p className="text-slate-400 mb-4">No vendors found.</p>
						<Link
							href="/erp/purchasing/vendors/new"
							className="text-blue-400 hover:text-blue-300"
						>
							Add your first vendor
						</Link>
					</div>
				) : (
					<div className="bg-slate-800 rounded-lg overflow-hidden">
						<table className="w-full">
							<thead className="bg-slate-700">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
										Name
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
										Code
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
										Contact
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
										Location
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
										Status
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-700">
								{filteredVendors.map((vendor) => (
									<tr key={vendor.id} className="hover:bg-slate-700/50">
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm font-medium text-white">
												{vendor.name}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
											{vendor.code || "—"}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm text-slate-300">
												{vendor.email || "—"}
											</div>
											<div className="text-xs text-slate-400">
												{vendor.phone || ""}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
											{vendor.city && vendor.country
												? `${vendor.city}, ${vendor.country}`
												: vendor.country || vendor.city || "—"}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span
												className={`px-2 py-1 rounded-full text-xs font-medium ${
													vendor.isActive
														? "bg-green-900/50 text-green-300"
														: "bg-red-900/50 text-red-300"
												}`}
											>
												{vendor.isActive ? "Active" : "Inactive"}
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
	);
}
