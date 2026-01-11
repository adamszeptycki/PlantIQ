"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Component = {
	componentId: string;
	quantity: string;
	scrapPercent: string;
	notes: string;
};

type Product = {
	id: string;
	name: string;
};

export default function NewBomPage() {
	const router = useRouter();
	const [productId, setProductId] = useState("");
	const [bomType, setBomType] = useState<"manufacturing" | "kit" | "phantom">("manufacturing");
	const [quantity, setQuantity] = useState("1");
	const [isActive, setIsActive] = useState(true);
	const [notes, setNotes] = useState("");
	const [components, setComponents] = useState<Component[]>([]);
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchProducts();
	}, []);

	async function fetchProducts() {
		try {
			const res = await fetch(
				`/api/trpc/products.listProducts?input=${encodeURIComponent(JSON.stringify({ limit: 100, offset: 0 }))}`,
				{ credentials: "include" },
			);

			const data = await res.json();
			setProducts(data.result.data.products);
		} catch (err) {
			console.error("Failed to fetch products:", err);
		}
	}

	const handleAddComponent = () => {
		setComponents([
			...components,
			{
				componentId: "",
				quantity: "1",
				scrapPercent: "0",
				notes: "",
			},
		]);
	};

	const handleRemoveComponent = (index: number) => {
		setComponents(components.filter((_, i) => i !== index));
	};

	const handleComponentChange = (
		index: number,
		field: keyof Component,
		value: string,
	) => {
		const updated = [...components];
		updated[index] = { ...updated[index], [field]: value };
		setComponents(updated);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!productId) {
			alert("Please select a product");
			return;
		}

		setLoading(true);
		setError(null);

		try {
			// Create BOM
			const bomRes = await fetch("/api/trpc/manufacturing.createBom", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					productId,
					bomType,
					quantity,
					isActive,
					notes: notes || null,
				}),
			});

			if (!bomRes.ok) {
				throw new Error("Failed to create BOM");
			}

			const bomData = await bomRes.json();
			const bomId = bomData.result.data.id;

			// Add components
			for (const component of components) {
				if (component.componentId) {
					await fetch("/api/trpc/manufacturing.addBomLineItem", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						credentials: "include",
						body: JSON.stringify({
							bomId,
							componentId: component.componentId,
							quantity: component.quantity,
							scrapPercent: component.scrapPercent,
							notes: component.notes || null,
						}),
					});
				}
			}

			router.push("/erp/manufacturing/boms");
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-slate-900 p-8">
			<div className="max-w-5xl mx-auto">
				<div className="mb-6">
					<h1 className="text-3xl font-bold text-white">Create New BOM</h1>
					<p className="text-slate-400 mt-1">
						Define the component structure for a product
					</p>
				</div>

				{error && (
					<div className="mb-6 bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="bg-slate-800 rounded-lg p-6 space-y-4">
						<h2 className="text-xl font-semibold text-white mb-4">
							BOM Information
						</h2>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-slate-300 mb-2">
									Product *
								</label>
								<select
									value={productId}
									onChange={(e) => setProductId(e.target.value)}
									className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
									required
								>
									<option value="">Select a product</option>
									{products.map((product) => (
										<option key={product.id} value={product.id}>
											{product.name}
										</option>
									))}
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-slate-300 mb-2">
									BOM Type
								</label>
								<select
									value={bomType}
									onChange={(e) => setBomType(e.target.value as "manufacturing" | "kit" | "phantom")}
									className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
								>
									<option value="manufacturing">Manufacturing</option>
									<option value="kit">Kit</option>
									<option value="phantom">Phantom</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-slate-300 mb-2">
									Quantity to Produce
								</label>
								<input
									type="number"
									step="0.01"
									value={quantity}
									onChange={(e) => setQuantity(e.target.value)}
									className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
									required
								/>
							</div>

							<div className="flex items-center">
								<label className="flex items-center space-x-2 cursor-pointer">
									<input
										type="checkbox"
										checked={isActive}
										onChange={(e) => setIsActive(e.target.checked)}
										className="w-5 h-5 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
									/>
									<span className="text-sm font-medium text-slate-300">Active</span>
								</label>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-slate-300 mb-2">
								Notes
							</label>
							<textarea
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
								rows={3}
							/>
						</div>
					</div>

					<div className="bg-slate-800 rounded-lg p-6">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-xl font-semibold text-white">Components</h2>
							<button
								type="button"
								onClick={handleAddComponent}
								className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
							>
								Add Component
							</button>
						</div>

						<div className="space-y-4">
							{components.map((component, index) => (
								<div
									key={index}
									className="bg-slate-700 rounded-lg p-4 space-y-3"
								>
									<div className="grid grid-cols-4 gap-3">
										<div className="col-span-2">
											<label className="block text-xs font-medium text-slate-300 mb-1">
												Component
											</label>
											<select
												value={component.componentId}
												onChange={(e) =>
													handleComponentChange(index, "componentId", e.target.value)
												}
												className="w-full px-3 py-2 bg-slate-600 text-white rounded border border-slate-500 focus:border-blue-500 focus:outline-none text-sm"
											>
												<option value="">Select component</option>
												{products.map((product) => (
													<option key={product.id} value={product.id}>
														{product.name}
													</option>
												))}
											</select>
										</div>

										<div>
											<label className="block text-xs font-medium text-slate-300 mb-1">
												Quantity
											</label>
											<input
												type="number"
												step="0.01"
												value={component.quantity}
												onChange={(e) =>
													handleComponentChange(index, "quantity", e.target.value)
												}
												className="w-full px-3 py-2 bg-slate-600 text-white rounded border border-slate-500 focus:border-blue-500 focus:outline-none text-sm"
											/>
										</div>

										<div>
											<label className="block text-xs font-medium text-slate-300 mb-1">
												Scrap %
											</label>
											<input
												type="number"
												step="0.01"
												value={component.scrapPercent}
												onChange={(e) =>
													handleComponentChange(index, "scrapPercent", e.target.value)
												}
												className="w-full px-3 py-2 bg-slate-600 text-white rounded border border-slate-500 focus:border-blue-500 focus:outline-none text-sm"
											/>
										</div>
									</div>

									<div className="flex gap-3">
										<input
											type="text"
											placeholder="Notes (optional)"
											value={component.notes}
											onChange={(e) =>
												handleComponentChange(index, "notes", e.target.value)
											}
											className="flex-1 px-3 py-2 bg-slate-600 text-white rounded border border-slate-500 focus:border-blue-500 focus:outline-none text-sm"
										/>
										<button
											type="button"
											onClick={() => handleRemoveComponent(index)}
											className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
										>
											Remove
										</button>
									</div>
								</div>
							))}

							{components.length === 0 && (
								<div className="text-center py-8 text-slate-400">
									No components added. Click "Add Component" to define what's needed
									to make this product.
								</div>
							)}
						</div>
					</div>

					<div className="flex gap-4">
						<button
							type="submit"
							disabled={loading}
							className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
						>
							{loading ? "Creating..." : "Create BOM"}
						</button>
						<Link
							href="/erp/manufacturing/boms"
							className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
						>
							Cancel
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}
