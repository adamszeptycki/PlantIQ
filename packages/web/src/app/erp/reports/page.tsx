"use client";

import { useEffect, useState } from "react";

type OrdersByStatus = {
	status: string;
	count: number;
	totalValue: string;
};

type TopCustomer = {
	customerId: string;
	customerName: string;
	orderCount: number;
	totalValue: string;
};

type ProductStockLevel = {
	productId: string;
	productSku: string;
	productName: string;
	currentStock: string;
	reorderPoint: string | null;
	stockValue: string;
};

type MOsByStatus = {
	status: string;
	count: number;
	totalQuantity: string;
};

type MOsByProduct = {
	productId: string;
	productSku: string;
	productName: string;
	orderCount: number;
	totalQuantity: string;
};

type Revenue = {
	totalInvoiced: string;
	totalPaid: string;
	totalOutstanding: string;
};

type Expenses = {
	totalBilled: string;
	totalPaid: string;
	totalOutstanding: string;
};

type InvoicesByStatus = {
	invoiceType: string;
	status: string;
	count: number;
	totalAmount: string;
};

export default function ReportsPage() {
	const [activeReport, setActiveReport] = useState<
		"sales" | "inventory" | "production" | "financial"
	>("sales");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [loading, setLoading] = useState(false);

	// Sales Report Data
	const [salesOrdersByStatus, setSalesOrdersByStatus] = useState<OrdersByStatus[]>([]);
	const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);

	// Inventory Report Data
	const [productStockLevels, setProductStockLevels] = useState<ProductStockLevel[]>([]);

	// Production Report Data
	const [mosByStatus, setMosByStatus] = useState<MOsByStatus[]>([]);
	const [mosByProduct, setMosByProduct] = useState<MOsByProduct[]>([]);

	// Financial Report Data
	const [revenue, setRevenue] = useState<Revenue | null>(null);
	const [expenses, setExpenses] = useState<Expenses | null>(null);
	const [invoicesByStatus, setInvoicesByStatus] = useState<InvoicesByStatus[]>([]);

	useEffect(() => {
		loadReport();
	}, [activeReport, startDate, endDate]);

	async function loadReport() {
		setLoading(true);
		try {
			const dateRange = {
				startDate: startDate || undefined,
				endDate: endDate || undefined,
			};
			const params = startDate || endDate ? { dateRange } : {};

			switch (activeReport) {
				case "sales": {
					const res = await fetch(
						`/api/trpc/dashboard.getSalesReport?input=${encodeURIComponent(JSON.stringify(params))}`,
						{ credentials: "include" },
					);
					const data = await res.json();
					setSalesOrdersByStatus(data.result.data.ordersByStatus || []);
					setTopCustomers(data.result.data.topCustomers || []);
					break;
				}
				case "inventory": {
					const res = await fetch(
						`/api/trpc/dashboard.getInventoryReport?input=${encodeURIComponent(JSON.stringify(params))}`,
						{ credentials: "include" },
					);
					const data = await res.json();
					setProductStockLevels(data.result.data.productStockLevels || []);
					break;
				}
				case "production": {
					const res = await fetch(
						`/api/trpc/dashboard.getProductionReport?input=${encodeURIComponent(JSON.stringify(params))}`,
						{ credentials: "include" },
					);
					const data = await res.json();
					setMosByStatus(data.result.data.mosByStatus || []);
					setMosByProduct(data.result.data.mosByProduct || []);
					break;
				}
				case "financial": {
					const res = await fetch(
						`/api/trpc/dashboard.getFinancialReport?input=${encodeURIComponent(JSON.stringify(params))}`,
						{ credentials: "include" },
					);
					const data = await res.json();
					setRevenue(data.result.data.revenue);
					setExpenses(data.result.data.expenses);
					setInvoicesByStatus(data.result.data.invoicesByStatus || []);
					break;
				}
			}
		} catch (error) {
			console.error("Failed to load report:", error);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen bg-slate-900 p-6">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-2xl font-bold text-white mb-6">Reports</h1>

				{/* Report Tabs */}
				<div className="bg-slate-800 rounded-lg p-4 mb-6">
					<div className="flex gap-4">
						<button
							type="button"
							onClick={() => setActiveReport("sales")}
							className={`px-4 py-2 rounded-lg transition-colors ${
								activeReport === "sales"
									? "bg-blue-600 text-white"
									: "bg-slate-700 text-slate-300 hover:bg-slate-600"
							}`}
						>
							Sales
						</button>
						<button
							type="button"
							onClick={() => setActiveReport("inventory")}
							className={`px-4 py-2 rounded-lg transition-colors ${
								activeReport === "inventory"
									? "bg-blue-600 text-white"
									: "bg-slate-700 text-slate-300 hover:bg-slate-600"
							}`}
						>
							Inventory
						</button>
						<button
							type="button"
							onClick={() => setActiveReport("production")}
							className={`px-4 py-2 rounded-lg transition-colors ${
								activeReport === "production"
									? "bg-blue-600 text-white"
									: "bg-slate-700 text-slate-300 hover:bg-slate-600"
							}`}
						>
							Production
						</button>
						<button
							type="button"
							onClick={() => setActiveReport("financial")}
							className={`px-4 py-2 rounded-lg transition-colors ${
								activeReport === "financial"
									? "bg-blue-600 text-white"
									: "bg-slate-700 text-slate-300 hover:bg-slate-600"
							}`}
						>
							Financial
						</button>
					</div>
				</div>

				{/* Date Range Filter */}
				<div className="bg-slate-800 rounded-lg p-4 mb-6">
					<div className="flex gap-4 items-center">
						<label className="text-slate-300 text-sm">
							Start Date:
							<input
								type="date"
								value={startDate}
								onChange={(e) => setStartDate(e.target.value)}
								className="ml-2 px-3 py-2 bg-slate-700 text-white rounded-lg"
							/>
						</label>
						<label className="text-slate-300 text-sm">
							End Date:
							<input
								type="date"
								value={endDate}
								onChange={(e) => setEndDate(e.target.value)}
								className="ml-2 px-3 py-2 bg-slate-700 text-white rounded-lg"
							/>
						</label>
						<button
							type="button"
							onClick={() => {
								setStartDate("");
								setEndDate("");
							}}
							className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600"
						>
							Clear
						</button>
					</div>
				</div>

				{/* Report Content */}
				{loading ? (
					<div className="text-slate-400 text-center py-12">Loading...</div>
				) : (
					<div>
						{activeReport === "sales" && (
							<div className="space-y-6">
								<div className="bg-slate-800 rounded-lg p-6">
									<h2 className="text-xl font-bold text-white mb-4">Orders by Status</h2>
									<table className="w-full">
										<thead className="bg-slate-700">
											<tr>
												<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
													Status
												</th>
												<th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase">
													Count
												</th>
												<th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase">
													Total Value
												</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-slate-700">
											{salesOrdersByStatus.map((row) => (
												<tr key={row.status}>
													<td className="px-6 py-4 text-sm text-white">{row.status}</td>
													<td className="px-6 py-4 text-sm text-right text-slate-300">
														{row.count}
													</td>
													<td className="px-6 py-4 text-sm text-right font-mono text-slate-300">
														${Number.parseFloat(row.totalValue).toFixed(2)}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>

								<div className="bg-slate-800 rounded-lg p-6">
									<h2 className="text-xl font-bold text-white mb-4">Top 10 Customers</h2>
									<table className="w-full">
										<thead className="bg-slate-700">
											<tr>
												<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
													Customer
												</th>
												<th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase">
													Orders
												</th>
												<th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase">
													Total Value
												</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-slate-700">
											{topCustomers.map((row) => (
												<tr key={row.customerId}>
													<td className="px-6 py-4 text-sm text-white">
														{row.customerName}
													</td>
													<td className="px-6 py-4 text-sm text-right text-slate-300">
														{row.orderCount}
													</td>
													<td className="px-6 py-4 text-sm text-right font-mono text-slate-300">
														${Number.parseFloat(row.totalValue).toFixed(2)}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						)}

						{activeReport === "inventory" && (
							<div className="bg-slate-800 rounded-lg p-6">
								<h2 className="text-xl font-bold text-white mb-4">Product Stock Levels</h2>
								<div className="overflow-x-auto">
									<table className="w-full">
										<thead className="bg-slate-700">
											<tr>
												<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
													SKU
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
													Product
												</th>
												<th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase">
													Current Stock
												</th>
												<th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase">
													Reorder Point
												</th>
												<th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase">
													Stock Value
												</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-slate-700">
											{productStockLevels.map((row) => {
												const currentStock = Number.parseFloat(row.currentStock);
												const reorderPoint = row.reorderPoint
													? Number.parseFloat(row.reorderPoint)
													: null;
												const isLowStock =
													reorderPoint !== null && currentStock < reorderPoint;

												return (
													<tr key={row.productId}>
														<td className="px-6 py-4 text-sm font-mono text-slate-300">
															{row.productSku}
														</td>
														<td className="px-6 py-4 text-sm text-white">
															{row.productName}
														</td>
														<td
															className={`px-6 py-4 text-sm text-right font-mono ${isLowStock ? "text-red-400 font-bold" : "text-slate-300"}`}
														>
															{currentStock.toFixed(2)}
														</td>
														<td className="px-6 py-4 text-sm text-right font-mono text-slate-300">
															{reorderPoint !== null ? reorderPoint.toFixed(2) : "—"}
														</td>
														<td className="px-6 py-4 text-sm text-right font-mono text-slate-300">
															${Number.parseFloat(row.stockValue).toFixed(2)}
														</td>
													</tr>
												);
											})}
										</tbody>
									</table>
								</div>
							</div>
						)}

						{activeReport === "production" && (
							<div className="space-y-6">
								<div className="bg-slate-800 rounded-lg p-6">
									<h2 className="text-xl font-bold text-white mb-4">
										Manufacturing Orders by Status
									</h2>
									<table className="w-full">
										<thead className="bg-slate-700">
											<tr>
												<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
													Status
												</th>
												<th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase">
													Count
												</th>
												<th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase">
													Total Quantity
												</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-slate-700">
											{mosByStatus.map((row) => (
												<tr key={row.status}>
													<td className="px-6 py-4 text-sm text-white">{row.status}</td>
													<td className="px-6 py-4 text-sm text-right text-slate-300">
														{row.count}
													</td>
													<td className="px-6 py-4 text-sm text-right font-mono text-slate-300">
														{Number.parseFloat(row.totalQuantity).toFixed(2)}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>

								<div className="bg-slate-800 rounded-lg p-6">
									<h2 className="text-xl font-bold text-white mb-4">Top 10 Products</h2>
									<table className="w-full">
										<thead className="bg-slate-700">
											<tr>
												<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
													SKU
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
													Product
												</th>
												<th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase">
													Orders
												</th>
												<th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase">
													Total Quantity
												</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-slate-700">
											{mosByProduct.map((row) => (
												<tr key={row.productId}>
													<td className="px-6 py-4 text-sm font-mono text-slate-300">
														{row.productSku}
													</td>
													<td className="px-6 py-4 text-sm text-white">
														{row.productName}
													</td>
													<td className="px-6 py-4 text-sm text-right text-slate-300">
														{row.orderCount}
													</td>
													<td className="px-6 py-4 text-sm text-right font-mono text-slate-300">
														{Number.parseFloat(row.totalQuantity).toFixed(2)}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						)}

						{activeReport === "financial" && (
							<div className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="bg-slate-800 rounded-lg p-6">
										<h2 className="text-xl font-bold text-white mb-4">Revenue Summary</h2>
										<div className="space-y-3">
											<div className="flex justify-between">
												<span className="text-slate-400">Total Invoiced:</span>
												<span className="text-white font-mono">
													${Number.parseFloat(revenue?.totalInvoiced || "0").toFixed(2)}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-slate-400">Total Paid:</span>
												<span className="text-green-400 font-mono">
													${Number.parseFloat(revenue?.totalPaid || "0").toFixed(2)}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-slate-400">Total Outstanding:</span>
												<span className="text-yellow-400 font-mono">
													${Number.parseFloat(revenue?.totalOutstanding || "0").toFixed(2)}
												</span>
											</div>
										</div>
									</div>

									<div className="bg-slate-800 rounded-lg p-6">
										<h2 className="text-xl font-bold text-white mb-4">Expenses Summary</h2>
										<div className="space-y-3">
											<div className="flex justify-between">
												<span className="text-slate-400">Total Billed:</span>
												<span className="text-white font-mono">
													${Number.parseFloat(expenses?.totalBilled || "0").toFixed(2)}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-slate-400">Total Paid:</span>
												<span className="text-red-400 font-mono">
													${Number.parseFloat(expenses?.totalPaid || "0").toFixed(2)}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-slate-400">Total Outstanding:</span>
												<span className="text-yellow-400 font-mono">
													${Number.parseFloat(expenses?.totalOutstanding || "0").toFixed(2)}
												</span>
											</div>
										</div>
									</div>
								</div>

								<div className="bg-slate-800 rounded-lg p-6">
									<h2 className="text-xl font-bold text-white mb-4">Invoices by Status</h2>
									<table className="w-full">
										<thead className="bg-slate-700">
											<tr>
												<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
													Type
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
													Status
												</th>
												<th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase">
													Count
												</th>
												<th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase">
													Total Amount
												</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-slate-700">
											{invoicesByStatus.map((row, index) => (
												<tr key={`${row.invoiceType}-${row.status}-${index}`}>
													<td className="px-6 py-4 text-sm text-white">
														{row.invoiceType}
													</td>
													<td className="px-6 py-4 text-sm text-white">{row.status}</td>
													<td className="px-6 py-4 text-sm text-right text-slate-300">
														{row.count}
													</td>
													<td className="px-6 py-4 text-sm text-right font-mono text-slate-300">
														${Number.parseFloat(row.totalAmount).toFixed(2)}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
