"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewCustomerPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		address: "",
		city: "",
		state: "",
		zipCode: "",
		country: "",
		taxId: "",
		creditLimit: "",
		notes: "",
	});

	function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const res = await fetch("/api/trpc/sales.createCustomer", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...formData,
					email: formData.email || null,
					phone: formData.phone || null,
					address: formData.address || null,
					city: formData.city || null,
					state: formData.state || null,
					zipCode: formData.zipCode || null,
					country: formData.country || null,
					taxId: formData.taxId || null,
					creditLimit: formData.creditLimit || null,
					notes: formData.notes || null,
				}),
				credentials: "include",
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.error?.message || "Failed to create customer");
			}

			router.push("/erp/sales/customers");
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
					← Back to Customers
				</button>
				<h1 className="text-3xl font-bold text-white">New Customer</h1>
				<p className="mt-1 text-sm text-slate-400">Add a new customer to your database</p>
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
							placeholder="Company or Individual Name"
						/>
					</label>

					<div className="grid grid-cols-2 gap-4">
						<label className="block">
							<span className="text-sm font-medium text-slate-300">Email</span>
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
								placeholder="customer@example.com"
							/>
						</label>

						<label className="block">
							<span className="text-sm font-medium text-slate-300">Phone</span>
							<input
								type="tel"
								name="phone"
								value={formData.phone}
								onChange={handleChange}
								className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
								placeholder="+1 (555) 123-4567"
							/>
						</label>
					</div>
				</div>

				{/* Address */}
				<div className="space-y-4 border-t border-slate-800 pt-6">
					<h2 className="text-lg font-semibold text-white">Address</h2>

					<label className="block">
						<span className="text-sm font-medium text-slate-300">Street Address</span>
						<input
							type="text"
							name="address"
							value={formData.address}
							onChange={handleChange}
							className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
							placeholder="123 Main St"
						/>
					</label>

					<div className="grid grid-cols-3 gap-4">
						<label className="block">
							<span className="text-sm font-medium text-slate-300">City</span>
							<input
								type="text"
								name="city"
								value={formData.city}
								onChange={handleChange}
								className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
								placeholder="San Francisco"
							/>
						</label>

						<label className="block">
							<span className="text-sm font-medium text-slate-300">State</span>
							<input
								type="text"
								name="state"
								value={formData.state}
								onChange={handleChange}
								className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
								placeholder="CA"
							/>
						</label>

						<label className="block">
							<span className="text-sm font-medium text-slate-300">ZIP Code</span>
							<input
								type="text"
								name="zipCode"
								value={formData.zipCode}
								onChange={handleChange}
								className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
								placeholder="94102"
							/>
						</label>
					</div>

					<label className="block">
						<span className="text-sm font-medium text-slate-300">Country</span>
						<input
							type="text"
							name="country"
							value={formData.country}
							onChange={handleChange}
							className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
							placeholder="United States"
						/>
					</label>
				</div>

				{/* Business Details */}
				<div className="space-y-4 border-t border-slate-800 pt-6">
					<h2 className="text-lg font-semibold text-white">Business Details</h2>

					<div className="grid grid-cols-2 gap-4">
						<label className="block">
							<span className="text-sm font-medium text-slate-300">Tax ID</span>
							<input
								type="text"
								name="taxId"
								value={formData.taxId}
								onChange={handleChange}
								className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
								placeholder="XX-XXXXXXX"
							/>
						</label>

						<label className="block">
							<span className="text-sm font-medium text-slate-300">Credit Limit</span>
							<input
								type="text"
								name="creditLimit"
								value={formData.creditLimit}
								onChange={handleChange}
								className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
								placeholder="0.00"
							/>
						</label>
					</div>

					<label className="block">
						<span className="text-sm font-medium text-slate-300">Notes</span>
						<textarea
							name="notes"
							value={formData.notes}
							onChange={handleChange}
							rows={3}
							className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
							placeholder="Additional notes..."
						/>
					</label>
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
						{loading ? "Creating..." : "Create Customer"}
					</button>
				</div>
			</form>
		</div>
	);
}
