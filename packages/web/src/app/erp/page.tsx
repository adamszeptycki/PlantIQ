"use client";

import Link from "next/link";

export default function ErpDashboardPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold text-white">ERP Dashboard</h1>
				<p className="mt-1 text-sm text-slate-400">Welcome to PlantIQ ERP System</p>
			</div>

			{/* Quick Stats */}
			<div className="grid grid-cols-4 gap-6">
				<div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
					<p className="text-sm font-medium text-slate-400">Products</p>
					<p className="mt-2 text-3xl font-bold text-white">-</p>
				</div>
				<div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
					<p className="text-sm font-medium text-slate-400">Sales Orders</p>
					<p className="mt-2 text-3xl font-bold text-white">-</p>
				</div>
				<div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
					<p className="text-sm font-medium text-slate-400">Manufacturing Orders</p>
					<p className="mt-2 text-3xl font-bold text-white">-</p>
				</div>
				<div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
					<p className="text-sm font-medium text-slate-400">Inventory Value</p>
					<p className="mt-2 text-3xl font-bold text-white">-</p>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="space-y-4">
				<h2 className="text-xl font-semibold text-white">Quick Actions</h2>
				<div className="grid grid-cols-3 gap-4">
					<Link
						href="/erp/products/new"
						className="rounded-lg border border-slate-800 bg-slate-900/60 p-6 hover:border-slate-700 hover:bg-slate-900"
					>
						<h3 className="font-semibold text-white">New Product</h3>
						<p className="mt-1 text-sm text-slate-400">Add a product to your catalog</p>
					</Link>
					<div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6 opacity-50">
						<h3 className="font-semibold text-white">New Sales Order</h3>
						<p className="mt-1 text-sm text-slate-400">Create a new sales order</p>
					</div>
					<div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6 opacity-50">
						<h3 className="font-semibold text-white">New Manufacturing Order</h3>
						<p className="mt-1 text-sm text-slate-400">Start production planning</p>
					</div>
				</div>
			</div>

			{/* Recent Activity */}
			<div className="space-y-4">
				<h2 className="text-xl font-semibold text-white">Recent Activity</h2>
				<div className="rounded-lg border border-slate-800 bg-slate-900/60 p-8 text-center">
					<p className="text-slate-400">No recent activity</p>
				</div>
			</div>
		</div>
	);
}
