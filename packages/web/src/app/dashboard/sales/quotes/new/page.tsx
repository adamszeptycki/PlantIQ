"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type LineItem = {
	productId: string;
	quantity: string;
	unitPrice: string;
	discount: string;
	lineTotal: string;
	notes: string;
};

type Customer = {
	id: string;
	name: string;
};

type Product = {
	id: string;
	name: string;
	listPrice: string | null;
};

export default function NewQuotePage() {
	const router = useRouter();
	const [quoteNumber, setQuoteNumber] = useState("");
	const [customerId, setCustomerId] = useState("");
	const [validUntil, setValidUntil] = useState("");
	const [terms, setTerms] = useState("");
	const [notes, setNotes] = useState("");
	const [lineItems, setLineItems] = useState<LineItem[]>([]);
	const [customers, setCustomers] = useState<Customer[]>([]);
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchCustomersAndProducts();
	}, []);

	async function fetchCustomersAndProducts() {
		try {
			const [customersRes, productsRes] = await Promise.all([
				fetch(
					`/api/trpc/sales.listCustomers?input=${encodeURIComponent(JSON.stringify({ limit: 100, offset: 0 }))}`,
					{ credentials: "include" },
				),
				fetch(
					`/api/trpc/products.listProducts?input=${encodeURIComponent(JSON.stringify({ limit: 100, offset: 0 }))}`,
					{ credentials: "include" },
				),
			]);

			const customersData = await customersRes.json();
			const productsData = await productsRes.json();

			setCustomers(customersData.result.data.customers);
			setProducts(productsData.result.data.products);
		} catch (err) {
			console.error("Failed to fetch data:", err);
		}
	}

	const handleAddLineItem = () => {
		setLineItems([
			...lineItems,
			{
				productId: "",
				quantity: "1",
				unitPrice: "0",
				discount: "0",
				lineTotal: "0",
				notes: "",
			},
		]);
	};

	const handleRemoveLineItem = (index: number) => {
		setLineItems(lineItems.filter((_, i) => i !== index));
	};

	const handleLineItemChange = (
		index: number,
		field: keyof LineItem,
		value: string,
	) => {
		const updated = [...lineItems];
		updated[index] = { ...updated[index], [field]: value };

		// Auto-fill price when product is selected
		if (field === "productId" && value) {
			const product = products.find((p) => p.id === value);
			if (product?.listPrice) {
				updated[index].unitPrice = product.listPrice;
			}
		}

		// Recalculate line total if quantity, unitPrice, or discount changes
		if (field === "quantity" || field === "unitPrice" || field === "discount" || field === "productId") {
			const quantity = Number.parseFloat(updated[index].quantity) || 0;
			const unitPrice = Number.parseFloat(updated[index].unitPrice) || 0;
			const discount = Number.parseFloat(updated[index].discount) || 0;
			const lineTotal = quantity * unitPrice * (1 - discount / 100);
			updated[index].lineTotal = lineTotal.toFixed(2);
		}

		setLineItems(updated);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!quoteNumber || !customerId) {
			alert("Please fill in all required fields");
			return;
		}

		setLoading(true);
		setError(null);

		try {
			// Create quote
			const quoteRes = await fetch("/api/trpc/sales.createQuote", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					quoteNumber,
					customerId,
					validUntil: validUntil || null,
					terms: terms || null,
					notes: notes || null,
				}),
			});

			if (!quoteRes.ok) {
				throw new Error("Failed to create quote");
			}

			const quoteData = await quoteRes.json();
			const quoteId = quoteData.result.data.id;

			// Add line items
			for (const item of lineItems) {
				if (item.productId) {
					await fetch("/api/trpc/sales.addQuoteLineItem", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						credentials: "include",
						body: JSON.stringify({
							quoteId,
							productId: item.productId,
							quantity: item.quantity,
							unitPrice: item.unitPrice,
							discount: item.discount,
							lineTotal: item.lineTotal,
							notes: item.notes || null,
						}),
					});
				}
			}

			router.push("/dashboard/sales/quotes");
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setLoading(false);
		}
	};

	const subtotal = lineItems.reduce(
		(sum, item) => sum + Number.parseFloat(item.lineTotal),
		0,
	);

	return (
		<div className="min-h-screen bg-slate-900 p-8">
			<div className="max-w-5xl mx-auto">
				<div className="mb-6">
					<h1 className="text-3xl font-bold text-white">Create New Quote</h1>
					<p className="text-slate-400 mt-1">
						Create a sales quote for a customer
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
							Quote Information
						</h2>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-slate-300 mb-2">
									Quote Number *
								</label>
								<input
									type="text"
									value={quoteNumber}
									onChange={(e) => setQuoteNumber(e.target.value)}
									className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-slate-300 mb-2">
									Customer *
								</label>
								<select
									value={customerId}
									onChange={(e) => setCustomerId(e.target.value)}
									className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
									required
								>
									<option value="">Select a customer</option>
									{customers.map((customer) => (
										<option key={customer.id} value={customer.id}>
											{customer.name}
										</option>
									))}
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-slate-300 mb-2">
									Valid Until
								</label>
								<input
									type="date"
									value={validUntil}
									onChange={(e) => setValidUntil(e.target.value)}
									className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-slate-300 mb-2">
								Terms & Conditions
							</label>
							<textarea
								value={terms}
								onChange={(e) => setTerms(e.target.value)}
								className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
								rows={3}
							/>
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
							<h2 className="text-xl font-semibold text-white">Line Items</h2>
							<button
								type="button"
								onClick={handleAddLineItem}
								className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
							>
								Add Item
							</button>
						</div>

						<div className="space-y-4">
							{lineItems.map((item, index) => (
								<div
									key={index}
									className="bg-slate-700 rounded-lg p-4 space-y-3"
								>
									<div className="grid grid-cols-6 gap-3">
										<div className="col-span-2">
											<label className="block text-xs font-medium text-slate-300 mb-1">
												Product
											</label>
											<select
												value={item.productId}
												onChange={(e) =>
													handleLineItemChange(index, "productId", e.target.value)
												}
												className="w-full px-3 py-2 bg-slate-600 text-white rounded border border-slate-500 focus:border-blue-500 focus:outline-none text-sm"
											>
												<option value="">Select product</option>
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
												value={item.quantity}
												onChange={(e) =>
													handleLineItemChange(index, "quantity", e.target.value)
												}
												className="w-full px-3 py-2 bg-slate-600 text-white rounded border border-slate-500 focus:border-blue-500 focus:outline-none text-sm"
											/>
										</div>

										<div>
											<label className="block text-xs font-medium text-slate-300 mb-1">
												Unit Price
											</label>
											<input
												type="number"
												step="0.01"
												value={item.unitPrice}
												onChange={(e) =>
													handleLineItemChange(index, "unitPrice", e.target.value)
												}
												className="w-full px-3 py-2 bg-slate-600 text-white rounded border border-slate-500 focus:border-blue-500 focus:outline-none text-sm"
											/>
										</div>

										<div>
											<label className="block text-xs font-medium text-slate-300 mb-1">
												Discount %
											</label>
											<input
												type="number"
												step="0.01"
												value={item.discount}
												onChange={(e) =>
													handleLineItemChange(index, "discount", e.target.value)
												}
												className="w-full px-3 py-2 bg-slate-600 text-white rounded border border-slate-500 focus:border-blue-500 focus:outline-none text-sm"
											/>
										</div>

										<div>
											<label className="block text-xs font-medium text-slate-300 mb-1">
												Line Total
											</label>
											<input
												type="text"
												value={item.lineTotal}
												readOnly
												className="w-full px-3 py-2 bg-slate-600 text-white rounded border border-slate-500 text-sm"
											/>
										</div>
									</div>

									<div className="flex gap-3">
										<input
											type="text"
											placeholder="Notes (optional)"
											value={item.notes}
											onChange={(e) =>
												handleLineItemChange(index, "notes", e.target.value)
											}
											className="flex-1 px-3 py-2 bg-slate-600 text-white rounded border border-slate-500 focus:border-blue-500 focus:outline-none text-sm"
										/>
										<button
											type="button"
											onClick={() => handleRemoveLineItem(index)}
											className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
										>
											Remove
										</button>
									</div>
								</div>
							))}

							{lineItems.length === 0 && (
								<div className="text-center py-8 text-slate-400">
									No line items added. Click "Add Item" to add products to this
									quote.
								</div>
							)}
						</div>

						{lineItems.length > 0 && (
							<div className="mt-6 pt-4 border-t border-slate-600">
								<div className="flex justify-end">
									<div className="text-right">
										<div className="text-lg font-semibold text-white">
											Subtotal: ${subtotal.toFixed(2)}
										</div>
									</div>
								</div>
							</div>
						)}
					</div>

					<div className="flex gap-4">
						<button
							type="submit"
							disabled={loading}
							className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
						>
							{loading ? "Creating..." : "Create Quote"}
						</button>
						<Link
							href="/dashboard/sales/quotes"
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
