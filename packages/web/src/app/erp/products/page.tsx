"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Product = {
	id: string;
	sku: string;
	name: string;
	description: string | null;
	productType: string;
	listPrice: string | null;
	cost: string | null;
	isActive: boolean;
	createdAt: Date;
};

export default function ProductsPage() {
	const router = useRouter();
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState("");
	const [total, setTotal] = useState(0);

	useEffect(() => {
		fetchProducts();
	}, [search]);

	async function fetchProducts() {
		setLoading(true);
		setError(null);
		try {
			const params = new URLSearchParams();
			if (search) params.append("search", search);
			params.append("limit", "50");
			params.append("offset", "0");

			const res = await fetch(`/api/trpc/products.list?input=${encodeURIComponent(JSON.stringify({ search, limit: 50, offset: 0 }))}`, {
				credentials: "include",
			});

			if (!res.ok) {
				throw new Error("Failed to fetch products");
			}

			const data = await res.json();
			setProducts(data.result.data.products);
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
					<h1 className="text-3xl font-bold text-white">Products</h1>
					<p className="mt-1 text-sm text-slate-400">Manage your product catalog</p>
				</div>
				<Link
					href="/erp/products/new"
					className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
				>
					+ New Product
				</Link>
			</div>

			{/* Search */}
			<div className="flex items-center gap-4">
				<input
					type="text"
					placeholder="Search products..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="w-96 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
				/>
				<p className="text-sm text-slate-400">{total} products</p>
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
					<p className="text-slate-400">Loading products...</p>
				</div>
			) : null}

			{/* Products Table */}
			{!loading && products.length > 0 ? (
				<div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900/60">
					<table className="w-full">
						<thead className="border-b border-slate-800 bg-slate-900">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
									SKU
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
									Name
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
									Type
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
									List Price
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
									Cost
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
									Status
								</th>
								<th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-400">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-800">
							{products.map((product) => (
								<tr key={product.id} className="hover:bg-slate-800/30">
									<td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">
										{product.sku}
									</td>
									<td className="px-6 py-4 text-sm text-slate-300">
										<div>
											<div className="font-medium text-white">{product.name}</div>
											{product.description ? (
												<div className="mt-1 text-xs text-slate-400">{product.description}</div>
											) : null}
										</div>
									</td>
									<td className="whitespace-nowrap px-6 py-4 text-sm text-slate-300">
										<span className="rounded-full bg-slate-800 px-2 py-1 text-xs font-medium">
											{product.productType}
										</span>
									</td>
									<td className="whitespace-nowrap px-6 py-4 text-sm text-slate-300">
										{product.listPrice ? `$${product.listPrice}` : "-"}
									</td>
									<td className="whitespace-nowrap px-6 py-4 text-sm text-slate-300">
										{product.cost ? `$${product.cost}` : "-"}
									</td>
									<td className="whitespace-nowrap px-6 py-4 text-sm">
										<span
											className={`rounded-full px-2 py-1 text-xs font-medium ${
												product.isActive
													? "bg-green-500/20 text-green-400"
													: "bg-slate-700 text-slate-400"
											}`}
										>
											{product.isActive ? "Active" : "Inactive"}
										</span>
									</td>
									<td className="whitespace-nowrap px-6 py-4 text-right text-sm">
										<button
											type="button"
											className="text-blue-400 hover:text-blue-300"
											onClick={() => router.push(`/erp/products/${product.id}`)}
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
			{!loading && products.length === 0 ? (
				<div className="flex flex-col items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 py-12">
					<p className="text-slate-400">No products found</p>
					<Link
						href="/erp/products/new"
						className="mt-4 text-sm text-blue-400 hover:text-blue-300"
					>
						Create your first product
					</Link>
				</div>
			) : null}
		</div>
	);
}
