import { getDb } from "@starter/core/src/sql";
import {
	vendors,
	productVendors,
	purchaseOrders,
	purchaseOrderLineItems,
	type Vendor,
	type ProductVendor,
	type InsertVendor,
	type InsertProductVendor,
	type InsertPurchaseOrder,
	type InsertPurchaseOrderLineItem,
	type PurchaseOrder,
	type PurchaseOrderLineItem,
} from "@starter/core/src/sql/schema";
import { and, eq, sql } from "drizzle-orm";

// Vendors
export const createVendor = async (data: InsertVendor): Promise<Vendor> => {
	const db = getDb();
	const [newVendor] = await db.insert(vendors).values(data).returning();
	if (!newVendor) {
		throw new Error("Failed to create vendor");
	}
	return newVendor;
};

export const updateVendor = async (
	id: string,
	organizationId: string,
	data: Partial<InsertVendor>,
): Promise<Vendor | null> => {
	const db = getDb();
	const [updatedVendor] = await db
		.update(vendors)
		.set({ ...data, updatedAt: new Date() })
		.where(and(eq(vendors.id, id), eq(vendors.organizationId, organizationId)))
		.returning();
	return updatedVendor || null;
};

export const deleteVendor = async (
	id: string,
	organizationId: string,
): Promise<Vendor | null> => {
	const db = getDb();
	const [deletedVendor] = await db
		.delete(vendors)
		.where(and(eq(vendors.id, id), eq(vendors.organizationId, organizationId)))
		.returning();
	return deletedVendor || null;
};

// Product Vendors
export const addProductVendor = async (
	data: InsertProductVendor,
): Promise<ProductVendor> => {
	const db = getDb();
	const [newPV] = await db.insert(productVendors).values(data).returning();
	if (!newPV) {
		throw new Error("Failed to add product vendor");
	}
	return newPV;
};

export const updateProductVendor = async (
	id: string,
	organizationId: string,
	data: Partial<InsertProductVendor>,
): Promise<ProductVendor | null> => {
	const db = getDb();
	const [updatedPV] = await db
		.update(productVendors)
		.set({ ...data, updatedAt: new Date() })
		.where(
			and(
				eq(productVendors.id, id),
				eq(productVendors.organizationId, organizationId),
			),
		)
		.returning();
	return updatedPV || null;
};

export const deleteProductVendor = async (
	id: string,
	organizationId: string,
): Promise<ProductVendor | null> => {
	const db = getDb();
	const [deletedPV] = await db
		.delete(productVendors)
		.where(
			and(
				eq(productVendors.id, id),
				eq(productVendors.organizationId, organizationId),
			),
		)
		.returning();
	return deletedPV || null;
};

// Purchase Orders
export const createPurchaseOrder = async (
	data: InsertPurchaseOrder,
): Promise<PurchaseOrder> => {
	const db = getDb();
	const [newPO] = await db.insert(purchaseOrders).values(data).returning();
	if (!newPO) {
		throw new Error("Failed to create purchase order");
	}
	return newPO;
};

export const updatePurchaseOrder = async (
	id: string,
	organizationId: string,
	data: Partial<InsertPurchaseOrder>,
): Promise<PurchaseOrder | null> => {
	const db = getDb();
	const [updatedPO] = await db
		.update(purchaseOrders)
		.set({ ...data, updatedAt: new Date() })
		.where(
			and(
				eq(purchaseOrders.id, id),
				eq(purchaseOrders.organizationId, organizationId),
			),
		)
		.returning();
	return updatedPO || null;
};

export const deletePurchaseOrder = async (
	id: string,
	organizationId: string,
): Promise<PurchaseOrder | null> => {
	const db = getDb();
	const [deletedPO] = await db
		.delete(purchaseOrders)
		.where(
			and(
				eq(purchaseOrders.id, id),
				eq(purchaseOrders.organizationId, organizationId),
			),
		)
		.returning();
	return deletedPO || null;
};

// Purchase Order Line Items
export const addPurchaseOrderLineItem = async (
	data: InsertPurchaseOrderLineItem,
): Promise<PurchaseOrderLineItem> => {
	const db = getDb();
	const [newLineItem] = await db.insert(purchaseOrderLineItems).values(data).returning();
	if (!newLineItem) {
		throw new Error("Failed to add purchase order line item");
	}

	// Recalculate PO totals
	await recalculatePurchaseOrderTotals(data.purchaseOrderId, data.organizationId);

	return newLineItem;
};

export const updatePurchaseOrderLineItem = async (
	id: string,
	organizationId: string,
	data: Partial<InsertPurchaseOrderLineItem>,
): Promise<PurchaseOrderLineItem | null> => {
	const db = getDb();
	const [updatedLineItem] = await db
		.update(purchaseOrderLineItems)
		.set({ ...data, updatedAt: new Date() })
		.where(
			and(
				eq(purchaseOrderLineItems.id, id),
				eq(purchaseOrderLineItems.organizationId, organizationId),
			),
		)
		.returning();

	if (updatedLineItem) {
		// Recalculate PO totals
		await recalculatePurchaseOrderTotals(updatedLineItem.purchaseOrderId, organizationId);
	}

	return updatedLineItem || null;
};

export const deletePurchaseOrderLineItem = async (
	id: string,
	organizationId: string,
): Promise<PurchaseOrderLineItem | null> => {
	const db = getDb();
	const [deletedLineItem] = await db
		.delete(purchaseOrderLineItems)
		.where(
			and(
				eq(purchaseOrderLineItems.id, id),
				eq(purchaseOrderLineItems.organizationId, organizationId),
			),
		)
		.returning();

	if (deletedLineItem) {
		// Recalculate PO totals
		await recalculatePurchaseOrderTotals(deletedLineItem.purchaseOrderId, organizationId);
	}

	return deletedLineItem || null;
};

// Helper function to recalculate purchase order totals
const recalculatePurchaseOrderTotals = async (
	purchaseOrderId: string,
	organizationId: string,
): Promise<void> => {
	const db = getDb();

	// Sum all line items
	const [result] = await db
		.select({
			subtotal: sql<string>`COALESCE(SUM(${purchaseOrderLineItems.lineTotal}), 0)`,
		})
		.from(purchaseOrderLineItems)
		.where(
			and(
				eq(purchaseOrderLineItems.purchaseOrderId, purchaseOrderId),
				eq(purchaseOrderLineItems.organizationId, organizationId),
			),
		);

	const subtotal = result?.subtotal || "0";

	// Get current tax and shipping
	const [po] = await db
		.select()
		.from(purchaseOrders)
		.where(
			and(
				eq(purchaseOrders.id, purchaseOrderId),
				eq(purchaseOrders.organizationId, organizationId),
			),
		);

	if (po) {
		const taxAmount = po.taxAmount || "0";
		const shippingCost = po.shippingCost || "0";
		const total = (
			Number.parseFloat(subtotal) +
			Number.parseFloat(taxAmount) +
			Number.parseFloat(shippingCost)
		).toFixed(2);

		await db
			.update(purchaseOrders)
			.set({ subtotal, total, updatedAt: new Date() })
			.where(
				and(
					eq(purchaseOrders.id, purchaseOrderId),
					eq(purchaseOrders.organizationId, organizationId),
				),
			);
	}
};

export const updatePurchaseOrderStatus = async (
	id: string,
	organizationId: string,
	status: string,
): Promise<PurchaseOrder | null> => {
	return updatePurchaseOrder(id, organizationId, { status: status as any });
};
