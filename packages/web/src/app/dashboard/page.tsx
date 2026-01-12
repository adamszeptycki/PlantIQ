"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type SalesMetrics = {
	totalOrders: number;
	confirmedOrders: number;
	totalRevenue: string;
	activeQuotes: number;
	totalCustomers: number;
};

type InventoryMetrics = {
	totalProducts: number;
	lowStockCount: number;
	totalStockValue: string;
};

type ProductionMetrics = {
	totalMOs: number;
	inProgressMOs: number;
	confirmedMOs: number;
	completedMOs: number;
};

type FinancialMetrics = {
	accountsReceivable: string;
	accountsPayable: string;
	openPurchaseOrders: number;
};

export default function ErpDashboardPage() {
	const [salesMetrics, setSalesMetrics] = useState<SalesMetrics | null>(null);
	const [inventoryMetrics, setInventoryMetrics] = useState<InventoryMetrics | null>(null);
	const [productionMetrics, setProductionMetrics] = useState<ProductionMetrics | null>(null);
	const [financialMetrics, setFinancialMetrics] = useState<FinancialMetrics | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadDashboardData();
	}, []);

	async function loadDashboardData() {
		setLoading(true);
		try {
			// Load all metrics in parallel
			const [sales, inventory, production, financial] = await Promise.all([
				fetch("/api/trpc/dashboard.getSalesMetrics", {
					credentials: "include",
				}).then((res) => res.json()),
				fetch("/api/trpc/dashboard.getInventoryMetrics", {
					credentials: "include",
				}).then((res) => res.json()),
				fetch("/api/trpc/dashboard.getProductionMetrics", {
					credentials: "include",
				}).then((res) => res.json()),
				fetch("/api/trpc/dashboard.getFinancialMetrics", {
					credentials: "include",
				}).then((res) => res.json()),
			]);

			setSalesMetrics(sales.result.data);
			setInventoryMetrics(inventory.result.data);
			setProductionMetrics(production.result.data);
			setFinancialMetrics(financial.result.data);
		} catch (error) {
			console.error("Failed to load dashboard data:", error);
		} finally {
			setLoading(false);
		}
	}

	if (loading) {
		return (
			<div className="space-y-6">
				<div>
					<h1 className="text-3xl font-bold text-white">ERP Dashboard</h1>
					<p className="mt-1 text-sm text-slate-400">Welcome to PlantIQ ERP System</p>
				</div>
				<div className="text-slate-400 text-center py-12">Loading...</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold text-white">ERP Dashboard</h1>
				<p className="mt-1 text-sm text-slate-400">Welcome to PlantIQ ERP System</p>
			</div>

			{/* Sales Metrics */}
			<div className="space-y-4">
				<h2 className="text-xl font-semibold text-white">Sales</h2>
				<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
					<Link
						href="/dashboard/sales/orders"
						className="rounded-lg border border-slate-800 bg-slate-900/60 p-6 hover:border-slate-700 hover:bg-slate-900 transition-colors"
					>
						<p className="text-sm font-medium text-slate-400">Total Orders</p>
						<p className="mt-2 text-3xl font-bold text-white">
							{salesMetrics?.totalOrders || 0}
						</p>
					</Link>

					<div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
						<p className="text-sm font-medium text-slate-400">Confirmed Orders</p>
						<p className="mt-2 text-3xl font-bold text-blue-400">
							{salesMetrics?.confirmedOrders || 0}
						</p>
					</div>

					<div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
						<p className="text-sm font-medium text-slate-400">Total Revenue</p>
						<p className="mt-2 text-3xl font-bold text-green-400">
							${Number.parseFloat(salesMetrics?.totalRevenue || "0").toFixed(2)}
						</p>
						<p className="text-xs text-slate-500 mt-1">Invoiced orders</p>
					</div>

					<Link
						href="/dashboard/sales/quotes"
						className="rounded-lg border border-slate-800 bg-slate-900/60 p-6 hover:border-slate-700 hover:bg-slate-900 transition-colors"
					>
						<p className="text-sm font-medium text-slate-400">Active Quotes</p>
						<p className="mt-2 text-3xl font-bold text-yellow-400">
							{salesMetrics?.activeQuotes || 0}
						</p>
					</Link>

					<Link
						href="/dashboard/sales/customers"
						className="rounded-lg border border-slate-800 bg-slate-900/60 p-6 hover:border-slate-700 hover:bg-slate-900 transition-colors"
					>
						<p className="text-sm font-medium text-slate-400">Total Customers</p>
						<p className="mt-2 text-3xl font-bold text-white">
							{salesMetrics?.totalCustomers || 0}
						</p>
					</Link>
				</div>
			</div>

			{/* Inventory Metrics */}
			<div className="space-y-4">
				<h2 className="text-xl font-semibold text-white">Inventory</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Link
						href="/dashboard/products"
						className="rounded-lg border border-slate-800 bg-slate-900/60 p-6 hover:border-slate-700 hover:bg-slate-900 transition-colors"
					>
						<p className="text-sm font-medium text-slate-400">Total Products</p>
						<p className="mt-2 text-3xl font-bold text-white">
							{inventoryMetrics?.totalProducts || 0}
						</p>
					</Link>

					<Link
						href="/dashboard/inventory"
						className="rounded-lg border border-slate-800 bg-slate-900/60 p-6 hover:border-slate-700 hover:bg-slate-900 transition-colors"
					>
						<p className="text-sm font-medium text-slate-400">Low Stock Items</p>
						<p className="mt-2 text-3xl font-bold text-red-400">
							{inventoryMetrics?.lowStockCount || 0}
						</p>
						<p className="text-xs text-slate-500 mt-1">Below reorder point</p>
					</Link>

					<div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
						<p className="text-sm font-medium text-slate-400">Total Stock Value</p>
						<p className="mt-2 text-3xl font-bold text-green-400">
							${Number.parseFloat(inventoryMetrics?.totalStockValue || "0").toFixed(2)}
						</p>
						<p className="text-xs text-slate-500 mt-1">At cost price</p>
					</div>
				</div>
			</div>

			{/* Production Metrics */}
			<div className="space-y-4">
				<h2 className="text-xl font-semibold text-white">Production</h2>
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<Link
						href="/dashboard/manufacturing/orders"
						className="rounded-lg border border-slate-800 bg-slate-900/60 p-6 hover:border-slate-700 hover:bg-slate-900 transition-colors"
					>
						<p className="text-sm font-medium text-slate-400">Manufacturing Orders</p>
						<p className="mt-2 text-3xl font-bold text-white">
							{productionMetrics?.totalMOs || 0}
						</p>
					</Link>

					<div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
						<p className="text-sm font-medium text-slate-400">In Progress</p>
						<p className="mt-2 text-3xl font-bold text-blue-400">
							{productionMetrics?.inProgressMOs || 0}
						</p>
					</div>

					<div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
						<p className="text-sm font-medium text-slate-400">Confirmed</p>
						<p className="mt-2 text-3xl font-bold text-yellow-400">
							{productionMetrics?.confirmedMOs || 0}
						</p>
					</div>

					<div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
						<p className="text-sm font-medium text-slate-400">Completed</p>
						<p className="mt-2 text-3xl font-bold text-green-400">
							{productionMetrics?.completedMOs || 0}
						</p>
					</div>
				</div>
			</div>

			{/* Financial Metrics */}
			<div className="space-y-4">
				<h2 className="text-xl font-semibold text-white">Financial</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Link
						href="/dashboard/accounting/invoices"
						className="rounded-lg border border-slate-800 bg-slate-900/60 p-6 hover:border-slate-700 hover:bg-slate-900 transition-colors"
					>
						<p className="text-sm font-medium text-slate-400">Accounts Receivable</p>
						<p className="mt-2 text-3xl font-bold text-green-400">
							${Number.parseFloat(financialMetrics?.accountsReceivable || "0").toFixed(2)}
						</p>
						<p className="text-xs text-slate-500 mt-1">Customer invoices outstanding</p>
					</Link>

					<Link
						href="/dashboard/accounting/invoices"
						className="rounded-lg border border-slate-800 bg-slate-900/60 p-6 hover:border-slate-700 hover:bg-slate-900 transition-colors"
					>
						<p className="text-sm font-medium text-slate-400">Accounts Payable</p>
						<p className="mt-2 text-3xl font-bold text-red-400">
							${Number.parseFloat(financialMetrics?.accountsPayable || "0").toFixed(2)}
						</p>
						<p className="text-xs text-slate-500 mt-1">Vendor bills outstanding</p>
					</Link>

					<Link
						href="/dashboard/purchasing/orders"
						className="rounded-lg border border-slate-800 bg-slate-900/60 p-6 hover:border-slate-700 hover:bg-slate-900 transition-colors"
					>
						<p className="text-sm font-medium text-slate-400">Open Purchase Orders</p>
						<p className="mt-2 text-3xl font-bold text-yellow-400">
							{financialMetrics?.openPurchaseOrders || 0}
						</p>
					</Link>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="space-y-4">
				<h2 className="text-xl font-semibold text-white">Quick Actions</h2>
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<Link
						href="/dashboard/sales/orders/new"
						className="rounded-lg bg-blue-600 hover:bg-blue-700 p-6 transition-colors text-center"
					>
						<p className="text-white font-medium">New Sales Order</p>
					</Link>

					<Link
						href="/dashboard/manufacturing/orders/new"
						className="rounded-lg bg-blue-600 hover:bg-blue-700 p-6 transition-colors text-center"
					>
						<p className="text-white font-medium">New Manufacturing Order</p>
					</Link>

					<Link
						href="/dashboard/purchasing/orders/new"
						className="rounded-lg bg-blue-600 hover:bg-blue-700 p-6 transition-colors text-center"
					>
						<p className="text-white font-medium">New Purchase Order</p>
					</Link>

					<Link
						href="/dashboard/purchasing/suggestions"
						className="rounded-lg bg-orange-600 hover:bg-orange-700 p-6 transition-colors text-center"
					>
						<p className="text-white font-medium">Purchase Suggestions</p>
					</Link>
				</div>
			</div>
		</div>
	);
}
