"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewLeadPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [formData, setFormData] = useState({
		name: "",
		company: "",
		email: "",
		phone: "",
		status: "new" as "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "won" | "lost",
		estimatedValue: "",
		notes: "",
	});

	function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const res = await fetch("/api/trpc/sales.createLead", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...formData,
					company: formData.company || null,
					email: formData.email || null,
					phone: formData.phone || null,
					estimatedValue: formData.estimatedValue || null,
					notes: formData.notes || null,
				}),
				credentials: "include",
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.error?.message || "Failed to create lead");
			}

			router.push("/erp/sales/leads");
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
					← Back to Leads
				</button>
				<h1 className="text-3xl font-bold text-white">New Lead</h1>
				<p className="mt-1 text-sm text-slate-400">Add a new lead to your pipeline</p>
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
					<h2 className="text-lg font-semibold text-white">Lead Information</h2>

					<div className="grid grid-cols-2 gap-4">
						<label className="block">
							<span className="text-sm font-medium text-slate-300">
								Contact Name <span className="text-red-400">*</span>
							</span>
							<input
								type="text"
								name="name"
								required
								value={formData.name}
								onChange={handleChange}
								className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
								placeholder="John Doe"
							/>
						</label>

						<label className="block">
							<span className="text-sm font-medium text-slate-300">Company</span>
							<input
								type="text"
								name="company"
								value={formData.company}
								onChange={handleChange}
								className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
								placeholder="Acme Corp"
							/>
						</label>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<label className="block">
							<span className="text-sm font-medium text-slate-300">Email</span>
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
								placeholder="john@example.com"
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

				{/* Lead Details */}
				<div className="space-y-4 border-t border-slate-800 pt-6">
					<h2 className="text-lg font-semibold text-white">Lead Details</h2>

					<div className="grid grid-cols-2 gap-4">
						<label className="block">
							<span className="text-sm font-medium text-slate-300">Status</span>
							<select
								name="status"
								value={formData.status}
								onChange={handleChange}
								className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
							>
								<option value="new">New</option>
								<option value="contacted">Contacted</option>
								<option value="qualified">Qualified</option>
								<option value="proposal">Proposal</option>
								<option value="negotiation">Negotiation</option>
								<option value="won">Won</option>
								<option value="lost">Lost</option>
							</select>
						</label>

						<label className="block">
							<span className="text-sm font-medium text-slate-300">Estimated Value</span>
							<input
								type="text"
								name="estimatedValue"
								value={formData.estimatedValue}
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
							rows={4}
							className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
							placeholder="Additional notes about this lead..."
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
						{loading ? "Creating..." : "Create Lead"}
					</button>
				</div>
			</form>
		</div>
	);
}
