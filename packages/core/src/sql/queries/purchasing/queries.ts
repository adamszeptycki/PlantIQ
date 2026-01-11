import { getDb } from "@starter/core/src/sql";
import {
	vendors,
	productVendors,
	purchaseOrders,
	purchaseOrderLineItems,
	type Vendor,
	type ProductVendor,
	type PurchaseOrder,
	type PurchaseOrderLineItem,
} from "@starter/core/src/sql/schema";
import { and, desc, eq, ilike } from "drizzle-orm";

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
