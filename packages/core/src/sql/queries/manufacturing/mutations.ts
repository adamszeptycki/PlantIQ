import { getDb } from "@starter/core/src/sql";
import {
	boms,
	bomLineItems,
	manufacturingOrders,
	type Bom,
	type BomLineItem,
	type InsertBom,
	type InsertBomLineItem,
	type InsertManufacturingOrder,
	type ManufacturingOrder,
} from "@starter/core/src/sql/schema";
import { and, eq } from "drizzle-orm";

// BOMs
export const createBom = async (data: InsertBom): Promise<Bom> => {
	const db = getDb();
	const [newBom] = await db.insert(boms).values(data).returning();
	if (!newBom) {
		throw new Error("Failed to create BOM");
	}
	return newBom;
};

export const updateBom = async (
	id: string,
	organizationId: string,
	data: Partial<InsertBom>,
): Promise<Bom | null> => {
	const db = getDb();
	const [updatedBom] = await db
		.update(boms)
		.set({ ...data, updatedAt: new Date() })
		.where(and(eq(boms.id, id), eq(boms.organizationId, organizationId)))
		.returning();
	return updatedBom || null;
};

export const deleteBom = async (
	id: string,
	organizationId: string,
): Promise<Bom | null> => {
	const db = getDb();
	const [deletedBom] = await db
		.delete(boms)
		.where(and(eq(boms.id, id), eq(boms.organizationId, organizationId)))
		.returning();
	return deletedBom || null;
};

// BOM Line Items
export const addBomLineItem = async (
	data: InsertBomLineItem,
): Promise<BomLineItem> => {
	const db = getDb();
	const [newLineItem] = await db.insert(bomLineItems).values(data).returning();
	if (!newLineItem) {
		throw new Error("Failed to add BOM line item");
	}
	return newLineItem;
};

export const updateBomLineItem = async (
	id: string,
	organizationId: string,
	data: Partial<InsertBomLineItem>,
): Promise<BomLineItem | null> => {
	const db = getDb();
	const [updatedLineItem] = await db
		.update(bomLineItems)
		.set({ ...data, updatedAt: new Date() })
		.where(
			and(
				eq(bomLineItems.id, id),
				eq(bomLineItems.organizationId, organizationId),
			),
		)
		.returning();
	return updatedLineItem || null;
};

export const deleteBomLineItem = async (
	id: string,
	organizationId: string,
): Promise<BomLineItem | null> => {
	const db = getDb();
	const [deletedLineItem] = await db
		.delete(bomLineItems)
		.where(
			and(
				eq(bomLineItems.id, id),
				eq(bomLineItems.organizationId, organizationId),
			),
		)
		.returning();
	return deletedLineItem || null;
};

// Manufacturing Orders
export const createManufacturingOrder = async (
	data: InsertManufacturingOrder,
): Promise<ManufacturingOrder> => {
	const db = getDb();
	const [newMO] = await db.insert(manufacturingOrders).values(data).returning();
	if (!newMO) {
		throw new Error("Failed to create manufacturing order");
	}
	return newMO;
};

export const updateManufacturingOrder = async (
	id: string,
	organizationId: string,
	data: Partial<InsertManufacturingOrder>,
): Promise<ManufacturingOrder | null> => {
	const db = getDb();
	const [updatedMO] = await db
		.update(manufacturingOrders)
		.set({ ...data, updatedAt: new Date() })
		.where(
			and(
				eq(manufacturingOrders.id, id),
				eq(manufacturingOrders.organizationId, organizationId),
			),
		)
		.returning();
	return updatedMO || null;
};

export const deleteManufacturingOrder = async (
	id: string,
	organizationId: string,
): Promise<ManufacturingOrder | null> => {
	const db = getDb();
	const [deletedMO] = await db
		.delete(manufacturingOrders)
		.where(
			and(
				eq(manufacturingOrders.id, id),
				eq(manufacturingOrders.organizationId, organizationId),
			),
		)
		.returning();
	return deletedMO || null;
};

export const updateManufacturingOrderStatus = async (
	id: string,
	organizationId: string,
	status: string,
): Promise<ManufacturingOrder | null> => {
	return updateManufacturingOrder(id, organizationId, { status: status as any });
};
