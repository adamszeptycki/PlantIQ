import { getDb } from "@starter/core/src/sql";
import {
	salesOrders,
	quotes,
	customers,
	manufacturingOrders,
	products,
	stock,
	invoices,
	purchaseOrders,
} from "@starter/core/src/sql/schema";
import { and, between, count, eq, gte, lte, sql } from "drizzle-orm";

// Sales Metrics
export const getSalesMetrics = async (organizationId: string) => {
	const db = getDb();

	// Get counts for different statuses
	const [totalOrders] = await db
		.select({ count: count() })
		.from(salesOrders)
		.where(eq(salesOrders.organizationId, organizationId));

	const [confirmedOrders] = await db
		.select({ count: count() })
		.from(salesOrders)
		.where(
			and(
				eq(salesOrders.organizationId, organizationId),
				eq(salesOrders.status, "confirmed"),
			),
		);

	const [totalRevenue] = await db
		.select({
			revenue: sql<string>`COALESCE(SUM(${salesOrders.total}), 0)`,
		})
		.from(salesOrders)
		.where(
			and(
				eq(salesOrders.organizationId, organizationId),
				eq(salesOrders.status, "invoiced"),
			),
		);

	const [activeQuotes] = await db
		.select({ count: count() })
		.from(quotes)
		.where(
			and(eq(quotes.organizationId, organizationId), eq(quotes.status, "sent")),
		);

	const [totalCustomers] = await db
		.select({ count: count() })
		.from(customers)
		.where(eq(customers.organizationId, organizationId));

	return {
		totalOrders: totalOrders?.count || 0,
		confirmedOrders: confirmedOrders?.count || 0,
		totalRevenue: totalRevenue?.revenue || "0",
		activeQuotes: activeQuotes?.count || 0,
		totalCustomers: totalCustomers?.count || 0,
	};
};

// Inventory Metrics
export const getInventoryMetrics = async (organizationId: string) => {
	const db = getDb();

	const [totalProducts] = await db
		.select({ count: count() })
		.from(products)
		.where(eq(products.organizationId, organizationId));

	// Products below reorder point
	const lowStockProducts = await db
		.select({
			productId: products.id,
			currentStock: sql<string>`COALESCE(SUM(${stock.quantity}), 0)`,
			reorderPoint: products.reorderPoint,
		})
		.from(products)
		.leftJoin(
			stock,
			and(
				eq(stock.productId, products.id),
				eq(stock.organizationId, organizationId),
			),
		)
		.where(eq(products.organizationId, organizationId))
		.groupBy(products.id, products.reorderPoint)
		.having(sql`COALESCE(SUM(${stock.quantity}), 0) < ${products.reorderPoint}`);

	const [totalStockValue] = await db
		.select({
			value: sql<string>`COALESCE(SUM(${stock.quantity} * ${products.cost}), 0)`,
		})
		.from(stock)
		.innerJoin(products, eq(products.id, stock.productId))
		.where(eq(stock.organizationId, organizationId));

	return {
		totalProducts: totalProducts?.count || 0,
		lowStockCount: lowStockProducts.length,
		totalStockValue: totalStockValue?.value || "0",
	};
};

// Production Metrics
export const getProductionMetrics = async (organizationId: string) => {
	const db = getDb();

	const [totalMOs] = await db
		.select({ count: count() })
		.from(manufacturingOrders)
		.where(eq(manufacturingOrders.organizationId, organizationId));

	const [inProgressMOs] = await db
		.select({ count: count() })
		.from(manufacturingOrders)
		.where(
			and(
				eq(manufacturingOrders.organizationId, organizationId),
				eq(manufacturingOrders.status, "in_progress"),
			),
		);

	const [confirmedMOs] = await db
		.select({ count: count() })
		.from(manufacturingOrders)
		.where(
			and(
				eq(manufacturingOrders.organizationId, organizationId),
				eq(manufacturingOrders.status, "confirmed"),
			),
		);

	const [completedMOs] = await db
		.select({ count: count() })
		.from(manufacturingOrders)
		.where(
			and(
				eq(manufacturingOrders.organizationId, organizationId),
				eq(manufacturingOrders.status, "done"),
			),
		);

	return {
		totalMOs: totalMOs?.count || 0,
		inProgressMOs: inProgressMOs?.count || 0,
		confirmedMOs: confirmedMOs?.count || 0,
		completedMOs: completedMOs?.count || 0,
	};
};

// Financial Metrics
export const getFinancialMetrics = async (organizationId: string) => {
	const db = getDb();

	// Accounts Receivable (customer invoices not fully paid)
	const [ar] = await db
		.select({
			total: sql<string>`COALESCE(SUM(${invoices.total} - ${invoices.amountPaid}), 0)`,
		})
		.from(invoices)
		.where(
			and(
				eq(invoices.organizationId, organizationId),
				eq(invoices.invoiceType, "customer"),
				sql`${invoices.status} != 'paid'`,
			),
		);

	// Accounts Payable (vendor bills not fully paid)
	const [ap] = await db
		.select({
			total: sql<string>`COALESCE(SUM(${invoices.total} - ${invoices.amountPaid}), 0)`,
		})
		.from(invoices)
		.where(
			and(
				eq(invoices.organizationId, organizationId),
				eq(invoices.invoiceType, "vendor"),
				sql`${invoices.status} != 'paid'`,
			),
		);

	const [openPOs] = await db
		.select({ count: count() })
		.from(purchaseOrders)
		.where(
			and(
				eq(purchaseOrders.organizationId, organizationId),
				sql`${purchaseOrders.status} NOT IN ('received', 'cancelled')`,
			),
		);

	return {
		accountsReceivable: ar?.total || "0",
		accountsPayable: ap?.total || "0",
		openPurchaseOrders: openPOs?.count || 0,
	};
};

// Reports with Date Range Filtering

type DateRange = {
	startDate?: string;
	endDate?: string;
};

export const getSalesReport = async (
	organizationId: string,
	dateRange?: DateRange,
) => {
	const db = getDb();

	const whereConditions = [eq(salesOrders.organizationId, organizationId)];
	if (dateRange?.startDate) {
		whereConditions.push(gte(salesOrders.orderDate, dateRange.startDate));
	}
	if (dateRange?.endDate) {
		whereConditions.push(lte(salesOrders.orderDate, dateRange.endDate));
	}

	// Orders by status
	const ordersByStatus = await db
		.select({
			status: salesOrders.status,
			count: count(),
			totalValue: sql<string>`COALESCE(SUM(${salesOrders.total}), 0)`,
		})
		.from(salesOrders)
		.where(and(...whereConditions))
		.groupBy(salesOrders.status);

	// Top customers by order value
	const topCustomers = await db
		.select({
			customerId: customers.id,
			customerName: customers.name,
			orderCount: count(),
			totalValue: sql<string>`COALESCE(SUM(${salesOrders.total}), 0)`,
		})
		.from(salesOrders)
		.innerJoin(customers, eq(customers.id, salesOrders.customerId))
		.where(and(...whereConditions))
		.groupBy(customers.id, customers.name)
		.orderBy(sql`SUM(${salesOrders.total}) DESC`)
		.limit(10);

	return {
		ordersByStatus,
		topCustomers,
	};
};

export const getInventoryReport = async (
	organizationId: string,
	dateRange?: DateRange,
) => {
	const db = getDb();

	// Products with stock levels
	const productStockLevels = await db
		.select({
			productId: products.id,
			productSku: products.sku,
			productName: products.name,
			currentStock: sql<string>`COALESCE(SUM(${stock.quantity}), 0)`,
			reorderPoint: products.reorderPoint,
			stockValue: sql<string>`COALESCE(SUM(${stock.quantity} * ${products.cost}), 0)`,
		})
		.from(products)
		.leftJoin(
			stock,
			and(
				eq(stock.productId, products.id),
				eq(stock.organizationId, organizationId),
			),
		)
		.where(eq(products.organizationId, organizationId))
		.groupBy(products.id, products.sku, products.name, products.reorderPoint)
		.orderBy(sql`COALESCE(SUM(${stock.quantity}), 0) ASC`);

	return {
		productStockLevels,
	};
};

export const getProductionReport = async (
	organizationId: string,
	dateRange?: DateRange,
) => {
	const db = getDb();

	const whereConditions = [eq(manufacturingOrders.organizationId, organizationId)];
	if (dateRange?.startDate) {
		whereConditions.push(gte(manufacturingOrders.scheduledStartDate, dateRange.startDate));
	}
	if (dateRange?.endDate) {
		whereConditions.push(lte(manufacturingOrders.scheduledStartDate, dateRange.endDate));
	}

	// MOs by status
	const mosByStatus = await db
		.select({
			status: manufacturingOrders.status,
			count: count(),
			totalQuantity: sql<string>`COALESCE(SUM(${manufacturingOrders.quantityToProduce}), 0)`,
		})
		.from(manufacturingOrders)
		.where(and(...whereConditions))
		.groupBy(manufacturingOrders.status);

	// MOs by product
	const mosByProduct = await db
		.select({
			productId: products.id,
			productSku: products.sku,
			productName: products.name,
			orderCount: count(),
			totalQuantity: sql<string>`COALESCE(SUM(${manufacturingOrders.quantityToProduce}), 0)`,
		})
		.from(manufacturingOrders)
		.innerJoin(products, eq(products.id, manufacturingOrders.productId))
		.where(and(...whereConditions))
		.groupBy(products.id, products.sku, products.name)
		.orderBy(sql`COUNT(*) DESC`)
		.limit(10);

	return {
		mosByStatus,
		mosByProduct,
	};
};

export const getFinancialReport = async (
	organizationId: string,
	dateRange?: DateRange,
) => {
	const db = getDb();

	const whereConditions = [eq(invoices.organizationId, organizationId)];
	if (dateRange?.startDate) {
		whereConditions.push(gte(invoices.invoiceDate, dateRange.startDate));
	}
	if (dateRange?.endDate) {
		whereConditions.push(lte(invoices.invoiceDate, dateRange.endDate));
	}

	// Revenue (customer invoices)
	const [revenue] = await db
		.select({
			totalInvoiced: sql<string>`COALESCE(SUM(${invoices.total}), 0)`,
			totalPaid: sql<string>`COALESCE(SUM(${invoices.amountPaid}), 0)`,
			totalOutstanding: sql<string>`COALESCE(SUM(${invoices.total} - ${invoices.amountPaid}), 0)`,
		})
		.from(invoices)
		.where(
			and(...whereConditions, eq(invoices.invoiceType, "customer")),
		);

	// Expenses (vendor bills)
	const [expenses] = await db
		.select({
			totalBilled: sql<string>`COALESCE(SUM(${invoices.total}), 0)`,
			totalPaid: sql<string>`COALESCE(SUM(${invoices.amountPaid}), 0)`,
			totalOutstanding: sql<string>`COALESCE(SUM(${invoices.total} - ${invoices.amountPaid}), 0)`,
		})
		.from(invoices)
		.where(
			and(...whereConditions, eq(invoices.invoiceType, "vendor")),
		);

	// Invoices by status
	const invoicesByStatus = await db
		.select({
			invoiceType: invoices.invoiceType,
			status: invoices.status,
			count: count(),
			totalAmount: sql<string>`COALESCE(SUM(${invoices.total}), 0)`,
		})
		.from(invoices)
		.where(and(...whereConditions))
		.groupBy(invoices.invoiceType, invoices.status);

	return {
		revenue: revenue || {
			totalInvoiced: "0",
			totalPaid: "0",
			totalOutstanding: "0",
		},
		expenses: expenses || {
			totalBilled: "0",
			totalPaid: "0",
			totalOutstanding: "0",
		},
		invoicesByStatus,
	};
};
