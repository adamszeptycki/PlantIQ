"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type Product = {
	id: string;
	name: string;
	sku: string;
};

type Bom = {
	id: string;
	productId: string;
	bomType: string;
	quantity: string;
	isActive: boolean;
};

export default function NewManufacturingOrderPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [products, setProducts] = useState<Product[]>([]);
	const [boms, setBoms] = useState<Bom[]>([]);
	const [filteredBoms, setFilteredBoms] = useState<Bom[]>([]);

	const [formData, setFormData] = useState({
		productId: "",
		bomId: "",
		moNumber: "",
		status: "draft",
		quantityToProduce: "1",
		scheduledStartDate: "",
		scheduledEndDate: "",
		responsiblePerson: "",
		notes: "",
	});

	useEffect(() => {
		loadProducts();
		loadBoms();
	}, []);

	useEffect(() => {
		if (formData.productId) {
			const productBoms = boms.filter(
				(bom) => bom.productId === formData.productId && bom.isActive,
			);
			setFilteredBoms(productBoms);
			// Auto-select first BOM if available
			if (productBoms.length > 0 && !formData.bomId) {
				setFormData((prev) => ({ ...prev, bomId: productBoms[0].id }));
			}
		} else {
			setFilteredBoms([]);
		}
	}, [formData.productId, boms]);

	async function loadProducts() {
		try {
			const res = await fetch(
				`/api/trpc/products.listProducts?input=${encodeURIComponent(JSON.stringify({ limit: 1000, offset: 0 }))}`,
				{
					credentials: "include",
				},
			);
			const data = await res.json();
			setProducts(data.result.data.products || []);
		} catch (error) {
			console.error("Failed to load products:", error);
		}
	}

	async function loadBoms() {
		try {
			const res = await fetch(
				`/api/trpc/manufacturing.listBoms?input=${encodeURIComponent(JSON.stringify({ limit: 1000, offset: 0 }))}`,
				{
					credentials: "include",
				},
			);
			const data = await res.json();
			setBoms(data.result.data.boms || []);
		} catch (error) {
			console.error("Failed to load BOMs:", error);
		}
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);

		try {
			const payload = {
				...formData,
				bomId: formData.bomId || null,
				scheduledStartDate: formData.scheduledStartDate || null,
				scheduledEndDate: formData.scheduledEndDate || null,
				responsiblePerson: formData.responsiblePerson || null,
				notes: formData.notes || null,
			};

			const res = await fetch("/api/trpc/manufacturing.createManufacturingOrder", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				throw new Error("Failed to create manufacturing order");
			}

			router.push("/dashboard/manufacturing/orders");
		} catch (error) {
			console.error("Error creating manufacturing order:", error);
			alert("Failed to create manufacturing order");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen bg-slate-900 p-6">
			<div className="max-w-3xl mx-auto">
				<h1 className="text-2xl font-bold text-white mb-6">
					Create Manufacturing Order
				</h1>

				<form onSubmit={handleSubmit} className="bg-slate-800 rounded-lg p-6 space-y-6">
					{/* MO Number */}
					<div>
						<label className="block text-sm font-medium text-slate-300 mb-2">
							MO Number *
						</label>
						<input
							type="text"
							required
							value={formData.moNumber}
							onChange={(e) =>
								setFormData({ ...formData, moNumber: e.target.value })
							}
							className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="MO-001"
						/>
					</div>

					{/* Product */}
					<div>
						<label className="block text-sm font-medium text-slate-300 mb-2">
							Product *
						</label>
						<select
							required
							value={formData.productId}
							onChange={(e) =>
								setFormData({ ...formData, productId: e.target.value, bomId: "" })
							}
							className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="">Select a product</option>
							{products.map((product) => (
								<option key={product.id} value={product.id}>
									{product.name} ({product.sku})
								</option>
							))}
						</select>
					</div>

					{/* BOM */}
					{filteredBoms.length > 0 && (
						<div>
							<label className="block text-sm font-medium text-slate-300 mb-2">
								Bill of Materials
							</label>
							<select
								value={formData.bomId}
								onChange={(e) => setFormData({ ...formData, bomId: e.target.value })}
								className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="">No BOM</option>
								{filteredBoms.map((bom) => (
									<option key={bom.id} value={bom.id}>
										{bom.bomType} - Qty: {bom.quantity}
									</option>
								))}
							</select>
						</div>
					)}

					{/* Status */}
					<div>
						<label className="block text-sm font-medium text-slate-300 mb-2">
							Status *
						</label>
						<select
							required
							value={formData.status}
							onChange={(e) => setFormData({ ...formData, status: e.target.value })}
							className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="draft">Draft</option>
							<option value="confirmed">Confirmed</option>
							<option value="in_progress">In Progress</option>
							<option value="done">Done</option>
							<option value="cancelled">Cancelled</option>
						</select>
					</div>

					{/* Quantity to Produce */}
					<div>
						<label className="block text-sm font-medium text-slate-300 mb-2">
							Quantity to Produce *
						</label>
						<input
							type="number"
							step="0.01"
							min="0.01"
							required
							value={formData.quantityToProduce}
							onChange={(e) =>
								setFormData({ ...formData, quantityToProduce: e.target.value })
							}
							className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					{/* Scheduled Start Date */}
					<div>
						<label className="block text-sm font-medium text-slate-300 mb-2">
							Scheduled Start Date
						</label>
						<input
							type="date"
							value={formData.scheduledStartDate}
							onChange={(e) =>
								setFormData({ ...formData, scheduledStartDate: e.target.value })
							}
							className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					{/* Scheduled End Date */}
					<div>
						<label className="block text-sm font-medium text-slate-300 mb-2">
							Scheduled End Date
						</label>
						<input
							type="date"
							value={formData.scheduledEndDate}
							onChange={(e) =>
								setFormData({ ...formData, scheduledEndDate: e.target.value })
							}
							className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					{/* Notes */}
					<div>
						<label className="block text-sm font-medium text-slate-300 mb-2">
							Notes
						</label>
						<textarea
							rows={4}
							value={formData.notes}
							onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
							className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
							placeholder="Additional notes..."
						/>
					</div>

					{/* Actions */}
					<div className="flex gap-4">
						<button
							type="button"
							onClick={() => router.back()}
							className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={loading}
							className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? "Creating..." : "Create Manufacturing Order"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
