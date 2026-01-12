"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewProductPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [formData, setFormData] = useState({
		sku: "",
		name: "",
		description: "",
		productType: "storable" as "storable" | "consumable" | "service",
		uom: "unit",
		listPrice: "",
		cost: "",
		canBeSold: true,
		canBePurchased: true,
		canBeManufactured: false,
		leadTime: 0,
		reorderPoint: "",
		reorderQuantity: "",
		isActive: true,
	});

	function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
		const { name, value, type } = e.target;
		if (type === "checkbox") {
			const checked = (e.target as HTMLInputElement).checked;
			setFormData((prev) => ({ ...prev, [name]: checked }));
		} else if (type === "number") {
			setFormData((prev) => ({ ...prev, [name]: Number.parseInt(value) || 0 }));
		} else {
			setFormData((prev) => ({ ...prev, [name]: value }));
		}
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const res = await fetch("/api/trpc/products.create", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...formData,
					listPrice: formData.listPrice || null,
					cost: formData.cost || null,
					description: formData.description || null,
					reorderPoint: formData.reorderPoint || null,
					reorderQuantity: formData.reorderQuantity || null,
				}),
				credentials: "include",
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.error?.message || "Failed to create product");
			}

			router.push("/dashboard/products");
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="mx-auto max-w-4xl space-y-6">
			{/* Header */}
			<div>
				<button
					type="button"
					onClick={() => router.back()}
					className="mb-4 text-sm text-slate-400 hover:text-white"
				>
					← Back to Products
				</button>
				<h1 className="text-3xl font-bold text-white">New Product</h1>
				<p className="mt-1 text-sm text-slate-400">Add a new product to your catalog</p>
			</div>

			{/* Error */}
			{error ? (
				<div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4">
					<p className="text-sm text-red-400">{error}</p>
				</div>
			) : null}

			{/* Form */}
			<form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-slate-800 bg-slate-900/60 p-6">
				{/* Basic Information */}
				<div className="space-y-4">
					<h2 className="text-lg font-semibold text-white">Basic Information</h2>

					<div className="grid grid-cols-2 gap-4">
						<label className="block">
							<span className="text-sm font-medium text-slate-300">
								SKU <span className="text-red-400">*</span>
							</span>
							<input
								type="text"
								name="sku"
								required
								value={formData.sku}
								onChange={handleChange}
								className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
								placeholder="PROD-001"
							/>
						</label>

						<label className="block">
							<span className="text-sm font-medium text-slate-300">
								Product Type <span className="text-red-400">*</span>
							</span>
							<select
								name="productType"
								value={formData.productType}
								onChange={handleChange}
								className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
							>
								<option value="storable">Storable</option>
								<option value="consumable">Consumable</option>
								<option value="service">Service</option>
							</select>
						</label>
					</div>

					<label className="block">
						<span className="text-sm font-medium text-slate-300">
							Name <span className="text-red-400">*</span>
						</span>
						<input
							type="text"
							name="name"
							required
							value={formData.name}
							onChange={handleChange}
							className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
							placeholder="Product Name"
						/>
					</label>

					<label className="block">
						<span className="text-sm font-medium text-slate-300">Description</span>
						<textarea
							name="description"
							value={formData.description}
							onChange={handleChange}
							rows={3}
							className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
							placeholder="Product description..."
						/>
					</label>

					<label className="block">
						<span className="text-sm font-medium text-slate-300">Unit of Measure</span>
						<input
							type="text"
							name="uom"
							value={formData.uom}
							onChange={handleChange}
							className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
							placeholder="unit, kg, liter, etc."
						/>
					</label>
				</div>

				{/* Pricing */}
				<div className="space-y-4 border-t border-slate-800 pt-6">
					<h2 className="text-lg font-semibold text-white">Pricing</h2>

					<div className="grid grid-cols-2 gap-4">
						<label className="block">
							<span className="text-sm font-medium text-slate-300">List Price</span>
							<input
								type="text"
								name="listPrice"
								value={formData.listPrice}
								onChange={handleChange}
								className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
								placeholder="0.00"
							/>
						</label>

						<label className="block">
							<span className="text-sm font-medium text-slate-300">Cost</span>
							<input
								type="text"
								name="cost"
								value={formData.cost}
								onChange={handleChange}
								className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
								placeholder="0.00"
							/>
						</label>
					</div>
				</div>

				{/* Settings */}
				<div className="space-y-4 border-t border-slate-800 pt-6">
					<h2 className="text-lg font-semibold text-white">Settings</h2>

					<div className="space-y-3">
						<label className="flex items-center gap-3">
							<input
								type="checkbox"
								name="canBeSold"
								checked={formData.canBeSold}
								onChange={handleChange}
								className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
							/>
							<span className="text-sm text-slate-300">Can be sold</span>
						</label>

						<label className="flex items-center gap-3">
							<input
								type="checkbox"
								name="canBePurchased"
								checked={formData.canBePurchased}
								onChange={handleChange}
								className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
							/>
							<span className="text-sm text-slate-300">Can be purchased</span>
						</label>

						<label className="flex items-center gap-3">
							<input
								type="checkbox"
								name="canBeManufactured"
								checked={formData.canBeManufactured}
								onChange={handleChange}
								className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
							/>
							<span className="text-sm text-slate-300">Can be manufactured</span>
						</label>

						<label className="flex items-center gap-3">
							<input
								type="checkbox"
								name="isActive"
								checked={formData.isActive}
								onChange={handleChange}
								className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
							/>
							<span className="text-sm text-slate-300">Active</span>
						</label>
					</div>
				</div>

				{/* Inventory */}
				<div className="space-y-4 border-t border-slate-800 pt-6">
					<h2 className="text-lg font-semibold text-white">Inventory</h2>

					<div className="grid grid-cols-3 gap-4">
						<label className="block">
							<span className="text-sm font-medium text-slate-300">Lead Time (days)</span>
							<input
								type="number"
								name="leadTime"
								value={formData.leadTime}
								onChange={handleChange}
								min="0"
								className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
							/>
						</label>

						<label className="block">
							<span className="text-sm font-medium text-slate-300">Reorder Point</span>
							<input
								type="text"
								name="reorderPoint"
								value={formData.reorderPoint}
								onChange={handleChange}
								className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
								placeholder="0"
							/>
						</label>

						<label className="block">
							<span className="text-sm font-medium text-slate-300">Reorder Quantity</span>
							<input
								type="text"
								name="reorderQuantity"
								value={formData.reorderQuantity}
								onChange={handleChange}
								className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
								placeholder="0"
							/>
						</label>
					</div>
				</div>

				{/* Actions */}
				<div className="flex justify-end gap-3 border-t border-slate-800 pt-6">
					<button
						type="button"
						onClick={() => router.back()}
						className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={loading}
						className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
					>
						{loading ? "Creating..." : "Create Product"}
					</button>
				</div>
			</form>
		</div>
	);
}
