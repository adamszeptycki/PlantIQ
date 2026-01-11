import { getDb } from "@starter/core/src/sql";
import {
	vendors,
	productVendors,
	purchaseOrders,
	purchaseOrderLineItems,
	products,
	stock,
	manufacturingOrders,
	bomLineItems,
	type Vendor,
	type ProductVendor,
	type PurchaseOrder,
	type PurchaseOrderLineItem,
} from "@starter/core/src/sql/schema";
import { and, desc, eq, ilike, lt, sql } from "drizzle-orm";

// Vendors
type ListVendorsArgs = {
	organizationId: string;
	search?: string | null;
	isActive?: boolean | null;
	limit?: number;
	offset?: number;
};

export const listVendors = async ({
	organizationId,
	search,
	isActive,
	limit = 50,
	offset = 0,
}: ListVendorsArgs): Promise<Vendor[]> => {
	const db = getDb();

	const conditions = [eq(vendors.organizationId, organizationId)];

	if (search && search.length > 0) {
		conditions.push(ilike(vendors.name, `%${search}%`));
	}

	if (isActive !== null && isActive !== undefined) {
		conditions.push(eq(vendors.isActive, isActive));
	}

	const results = await db
		.select()
		.from(vendors)
		.where(and(...conditions))
		.orderBy(desc(vendors.createdAt))
		.limit(limit)
		.offset(offset);

	return results;
};

export const getVendorById = async (
	id: string,
	organizationId: string,
): Promise<Vendor | null> => {
	const db = getDb();
	const [vendor] = await db
		.select()
		.from(vendors)
		.where(and(eq(vendors.id, id), eq(vendors.organizationId, organizationId)));
	return vendor || null;
};

export const countVendors = async (organizationId: string): Promise<number> => {
	const db = getDb();
	const [result] = await db
		.select({ count: vendors.id })
		.from(vendors)
		.where(eq(vendors.organizationId, organizationId));
	return Number(result?.count) || 0;
};

// Product Vendors
export const getProductVendors = async (
	productId: string,
	organizationId: string,
): Promise<ProductVendor[]> => {
	const db = getDb();
	const results = await db
		.select()
		.from(productVendors)
		.where(
			and(
				eq(productVendors.productId, productId),
				eq(productVendors.organizationId, organizationId),
			),
		)
		.orderBy(desc(productVendors.isPreferred));
	return results;
};

export const getVendorProducts = async (
	vendorId: string,
	organizationId: string,
): Promise<ProductVendor[]> => {
	const db = getDb();
	const results = await db
		.select()
		.from(productVendors)
		.where(
			and(
				eq(productVendors.vendorId, vendorId),
				eq(productVendors.organizationId, organizationId),
			),
		);
	return results;
};

// Purchase Orders
type ListPurchaseOrdersArgs = {
	organizationId: string;
	vendorId?: string | null;
	status?: string | null;
	search?: string | null;
	limit?: number;
	offset?: number;
};

export const listPurchaseOrders = async ({
	organizationId,
	vendorId,
	status,
	search,
	limit = 50,
	offset = 0,
}: ListPurchaseOrdersArgs): Promise<PurchaseOrder[]> => {
	const db = getDb();

	const conditions = [eq(purchaseOrders.organizationId, organizationId)];

	if (vendorId) {
		conditions.push(eq(purchaseOrders.vendorId, vendorId));
	}

	if (status) {
		conditions.push(eq(purchaseOrders.status, status as any));
	}

	if (search && search.length > 0) {
		conditions.push(ilike(purchaseOrders.poNumber, `%${search}%`));
	}

	const results = await db
		.select()
		.from(purchaseOrders)
		.where(and(...conditions))
		.orderBy(desc(purchaseOrders.createdAt))
		.limit(limit)
		.offset(offset);

	return results;
};

export const getPurchaseOrderById = async (
	id: string,
	organizationId: string,
): Promise<PurchaseOrder | null> => {
	const db = getDb();
	const [po] = await db
		.select()
		.from(purchaseOrders)
		.where(
			and(
				eq(purchaseOrders.id, id),
				eq(purchaseOrders.organizationId, organizationId),
			),
		);
	return po || null;
};

export const countPurchaseOrders = async (organizationId: string): Promise<number> => {
	const db = getDb();
	const [result] = await db
		.select({ count: purchaseOrders.id })
		.from(purchaseOrders)
		.where(eq(purchaseOrders.organizationId, organizationId));
	return Number(result?.count) || 0;
};

export const getPurchaseOrderLineItems = async (
	purchaseOrderId: string,
	organizationId: string,
): Promise<PurchaseOrderLineItem[]> => {
	const db = getDb();
	const results = await db
		.select()
		.from(purchaseOrderLineItems)
		.where(
			and(
				eq(purchaseOrderLineItems.purchaseOrderId, purchaseOrderId),
				eq(purchaseOrderLineItems.organizationId, organizationId),
			),
		);
	return results;
};

// Purchase Suggestions
type PurchaseSuggestion = {
	productId: string;
	productName: string;
	productSku: string;
	currentStock: string;
	reorderPoint: string;
	quantityNeeded: string;
	reason: string;
};

export const getPurchaseSuggestions = async (
	organizationId: string,
): Promise<PurchaseSuggestion[]> => {
	const db = getDb();
	const suggestions: PurchaseSuggestion[] = [];

	// 1. Products below reorder point
	const lowStockProducts = await db
		.select({
			productId: products.id,
			productName: products.name,
			productSku: products.sku,
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
		.groupBy(products.id, products.name, products.sku, products.reorderPoint)
		.having(sql`COALESCE(SUM(${stock.quantity}), 0) < ${products.reorderPoint}`);

	for (const product of lowStockProducts) {
		const currentStock = Number.parseFloat(product.currentStock || "0");
		const reorderPoint = Number.parseFloat(product.reorderPoint || "0");
		const quantityNeeded = Math.max(reorderPoint - currentStock, 0);

		if (quantityNeeded > 0) {
			suggestions.push({
				productId: product.productId,
				productName: product.productName,
				productSku: product.productSku,
				currentStock: product.currentStock,
				reorderPoint: product.reorderPoint || "0",
				quantityNeeded: quantityNeeded.toString(),
				reason: "Below reorder point",
			});
		}
	}

	// 2. Component requirements from confirmed MOs
	const confirmedMOs = await db
		.select({
			moId: manufacturingOrders.id,
			bomId: manufacturingOrders.bomId,
			quantityToProduce: manufacturingOrders.quantityToProduce,
		})
		.from(manufacturingOrders)
		.where(
			and(
				eq(manufacturingOrders.organizationId, organizationId),
				eq(manufacturingOrders.status, "confirmed"),
			),
		);

	for (const mo of confirmedMOs) {
		if (!mo.bomId) continue;

		// Get BOM line items (components)
		const components = await db
			.select({
				componentId: bomLineItems.componentId,
				quantity: bomLineItems.quantity,
			})
			.from(bomLineItems)
			.where(
				and(
					eq(bomLineItems.bomId, mo.bomId),
					eq(bomLineItems.organizationId, organizationId),
				),
			);

		for (const component of components) {
			const requiredQty =
				Number.parseFloat(component.quantity) *
				Number.parseFloat(mo.quantityToProduce);

			// Check current stock
			const [stockResult] = await db
				.select({
					currentStock: sql<string>`COALESCE(SUM(${stock.quantity}), 0)`,
				})
				.from(stock)
				.where(
					and(
						eq(stock.productId, component.componentId),
						eq(stock.organizationId, organizationId),
					),
				);

			const currentStock = Number.parseFloat(stockResult?.currentStock || "0");

			if (currentStock < requiredQty) {
				const shortage = requiredQty - currentStock;

				// Get product details
				const [product] = await db
					.select({
						name: products.name,
						sku: products.sku,
					})
					.from(products)
					.where(eq(products.id, component.componentId));

				if (product) {
					// Check if already suggested
					const existing = suggestions.find(
						(s) => s.productId === component.componentId,
					);
					if (existing) {
						// Add to existing suggestion
						existing.quantityNeeded = (
							Number.parseFloat(existing.quantityNeeded) + shortage
						).toString();
						existing.reason += ", MO requirement";
					} else {
						suggestions.push({
							productId: component.componentId,
							productName: product.name,
							productSku: product.sku,
							currentStock: stockResult?.currentStock || "0",
							reorderPoint: "0",
							quantityNeeded: shortage.toString(),
							reason: "MO requirement",
						});
					}
				}
			}
		}
	}

	return suggestions;
};
