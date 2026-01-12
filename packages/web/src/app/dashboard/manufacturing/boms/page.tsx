"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Bom = {
	id: string;
	productId: string;
	bomType: string;
	quantity: string;
	isActive: boolean;
	createdAt: Date;
};

export default function BomsPage() {
	const router = useRouter();
	const [boms, setBoms] = useState<Bom[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [total, setTotal] = useState(0);

	useEffect(() => {
		fetchBoms();
	}, []);

	async function fetchBoms() {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch(
				`/api/trpc/manufacturing.listBoms?input=${encodeURIComponent(JSON.stringify({ limit: 50, offset: 0 }))}`,
				{
					credentials: "include",
				},
			);

			if (!res.ok) {
				throw new Error("Failed to fetch BOMs");
			}

			const data = await res.json();
			setBoms(data.result.data.boms);
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
						<h1 className="text-3xl font-bold text-white">Bills of Materials</h1>
						<p className="text-slate-400 mt-1">Define product component structures</p>
					</div>
					<Link
						href="/dashboard/manufacturing/boms/new"
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						Create BOM
					</Link>
				</div>

				{error && (
					<div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400 mb-6">
						{error}
					</div>
				)}

				{loading ? (
					<div className="bg-slate-800 rounded-lg p-8 text-center">
						<p className="text-slate-400">Loading BOMs...</p>
					</div>
				) : (
					<div className="bg-slate-800 rounded-lg overflow-hidden">
						<table className="w-full">
							<thead className="bg-slate-700">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
										Product
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
										Type
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
										Quantity
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
										Status
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-700">
								{boms.length === 0 ? (
									<tr>
										<td colSpan={5} className="px-6 py-8 text-center text-slate-400">
											No BOMs found. Create your first BOM to get started.
										</td>
									</tr>
								) : (
									boms.map((bom) => (
										<tr key={bom.id} className="hover:bg-slate-700/50">
											<td className="px-6 py-4 text-sm text-white">{bom.productId}</td>
											<td className="px-6 py-4 text-sm text-slate-300">
												<span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-600 text-purple-100">
													{bom.bomType}
												</span>
											</td>
											<td className="px-6 py-4 text-sm text-slate-300">{bom.quantity}</td>
											<td className="px-6 py-4 text-sm">
												{bom.isActive ? (
													<span className="px-2 py-1 rounded-full text-xs font-medium bg-green-600 text-green-100">
														Active
													</span>
												) : (
													<span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-600 text-slate-200">
														Inactive
													</span>
												)}
											</td>
											<td className="px-6 py-4 text-sm">
												<Link
													href={`/dashboard/manufacturing/boms/${bom.id}`}
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

				{boms.length > 0 && (
					<div className="mt-4 text-sm text-slate-400 text-center">
						Showing {boms.length} of {total} BOMs
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
