"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Location = {
	id: string;
	name: string;
	code: string;
	locationType: string;
	isActive: boolean;
	parentLocationId: string | null;
	createdAt: Date;
};

export default function LocationsPage() {
	const router = useRouter();
	const [locations, setLocations] = useState<Location[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showForm, setShowForm] = useState(false);

	const [formData, setFormData] = useState({
		name: "",
		code: "",
		locationType: "internal" as "internal" | "customer" | "supplier" | "transit",
		isActive: true,
	});
	const [formLoading, setFormLoading] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);

	useEffect(() => {
		fetchLocations();
	}, []);

	async function fetchLocations() {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch("/api/trpc/inventory.listLocations", {
				credentials: "include",
			});

			if (!res.ok) {
				throw new Error("Failed to fetch locations");
			}

			const data = await res.json();
			setLocations(data.result.data);
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setLoading(false);
		}
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setFormLoading(true);
		setFormError(null);

		try {
			const res = await fetch("/api/trpc/inventory.createLocation", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
				credentials: "include",
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.error?.message || "Failed to create location");
			}

			// Reset form and refetch
			setFormData({
				name: "",
				code: "",
				locationType: "internal",
				isActive: true,
			});
			setShowForm(false);
			await fetchLocations();
		} catch (err) {
			setFormError((err as Error).message);
		} finally {
			setFormLoading(false);
		}
	}

	function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
		const { name, value, type } = e.target;
		if (type === "checkbox") {
			const checked = (e.target as HTMLInputElement).checked;
			setFormData((prev) => ({ ...prev, [name]: checked }));
		} else {
			setFormData((prev) => ({ ...prev, [name]: value }));
		}
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<button
						type="button"
						onClick={() => router.back()}
						className="mb-4 text-sm text-slate-400 hover:text-white"
					>
						← Back to Inventory
					</button>
					<h1 className="text-3xl font-bold text-white">Locations</h1>
					<p className="mt-1 text-sm text-slate-400">Manage warehouse and storage locations</p>
				</div>
				<button
					type="button"
					onClick={() => setShowForm(!showForm)}
					className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
				>
					{showForm ? "Cancel" : "+ New Location"}
				</button>
			</div>

			{/* Create Form */}
			{showForm ? (
				<form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-slate-800 bg-slate-900/60 p-6">
					<h2 className="text-lg font-semibold text-white">New Location</h2>

					{formError ? (
						<div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4">
							<p className="text-sm text-red-400">{formError}</p>
						</div>
					) : null}

					<div className="grid grid-cols-2 gap-4">
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
								placeholder="Main Warehouse"
							/>
						</label>

						<label className="block">
							<span className="text-sm font-medium text-slate-300">
								Code <span className="text-red-400">*</span>
							</span>
							<input
								type="text"
								name="code"
								required
								value={formData.code}
								onChange={handleChange}
								className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
								placeholder="WH-01"
							/>
						</label>
					</div>

					<label className="block">
						<span className="text-sm font-medium text-slate-300">
							Location Type <span className="text-red-400">*</span>
						</span>
						<select
							name="locationType"
							value={formData.locationType}
							onChange={handleChange}
							className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
						>
							<option value="internal">Internal</option>
							<option value="customer">Customer</option>
							<option value="supplier">Supplier</option>
							<option value="transit">In Transit</option>
						</select>
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

					<div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
						<button
							type="button"
							onClick={() => setShowForm(false)}
							className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={formLoading}
							className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
						>
							{formLoading ? "Creating..." : "Create Location"}
						</button>
					</div>
				</form>
			) : null}

			{/* Error */}
			{error ? (
				<div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4">
					<p className="text-sm text-red-400">{error}</p>
				</div>
			) : null}

			{/* Loading */}
			{loading ? (
				<div className="flex items-center justify-center py-12">
					<p className="text-slate-400">Loading locations...</p>
				</div>
			) : null}

			{/* Locations Table */}
			{!loading && locations.length > 0 ? (
				<div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900/60">
					<table className="w-full">
						<thead className="border-b border-slate-800 bg-slate-900">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
									Code
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
									Name
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
									Type
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
									Status
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-800">
							{locations.map((location) => (
								<tr key={location.id} className="hover:bg-slate-800/30">
									<td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">
										{location.code}
									</td>
									<td className="px-6 py-4 text-sm text-slate-300">{location.name}</td>
									<td className="whitespace-nowrap px-6 py-4 text-sm text-slate-300">
										<span className="rounded-full bg-slate-800 px-2 py-1 text-xs font-medium">
											{location.locationType}
										</span>
									</td>
									<td className="whitespace-nowrap px-6 py-4 text-sm">
										<span
											className={`rounded-full px-2 py-1 text-xs font-medium ${
												location.isActive
													? "bg-green-500/20 text-green-400"
													: "bg-slate-700 text-slate-400"
											}`}
										>
											{location.isActive ? "Active" : "Inactive"}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : null}

			{/* Empty State */}
			{!loading && locations.length === 0 && !showForm ? (
				<div className="flex flex-col items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 py-12">
					<p className="text-slate-400">No locations found</p>
					<button
						type="button"
						onClick={() => setShowForm(true)}
						className="mt-4 text-sm text-blue-400 hover:text-blue-300"
					>
						Create your first location
					</button>
				</div>
			) : null}
		</div>
	);
}
