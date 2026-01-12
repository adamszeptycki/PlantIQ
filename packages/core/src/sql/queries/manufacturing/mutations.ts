import { getDb } from "@plantiq/core/src/sql";
import {
	boms,
	bomLineItems,
	manufacturingOrders,
	workOrders,
	timeEntries,
	type Bom,
	type BomLineItem,
	type InsertBom,
	type InsertBomLineItem,
	type InsertManufacturingOrder,
	type InsertWorkOrder,
	type InsertTimeEntry,
	type ManufacturingOrder,
	type WorkOrder,
	type TimeEntry,
} from "@plantiq/core/src/sql/schema";
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

// Work Orders
export const createWorkOrder = async (data: InsertWorkOrder): Promise<WorkOrder> => {
	const db = getDb();
	const [newWO] = await db.insert(workOrders).values(data).returning();
	if (!newWO) {
		throw new Error("Failed to create work order");
	}
	return newWO;
};

export const updateWorkOrder = async (
	id: string,
	organizationId: string,
	data: Partial<InsertWorkOrder>,
): Promise<WorkOrder | null> => {
	const db = getDb();
	const [updatedWO] = await db
		.update(workOrders)
		.set({ ...data, updatedAt: new Date() })
		.where(
			and(
				eq(workOrders.id, id),
				eq(workOrders.organizationId, organizationId),
			),
		)
		.returning();
	return updatedWO || null;
};

export const deleteWorkOrder = async (
	id: string,
	organizationId: string,
): Promise<WorkOrder | null> => {
	const db = getDb();
	const [deletedWO] = await db
		.delete(workOrders)
		.where(
			and(
				eq(workOrders.id, id),
				eq(workOrders.organizationId, organizationId),
			),
		)
		.returning();
	return deletedWO || null;
};

export const updateWorkOrderStatus = async (
	id: string,
	organizationId: string,
	status: string,
): Promise<WorkOrder | null> => {
	return updateWorkOrder(id, organizationId, { status: status as any });
};

// Time Entries
export const createTimeEntry = async (data: InsertTimeEntry): Promise<TimeEntry> => {
	const db = getDb();
	const [newEntry] = await db.insert(timeEntries).values(data).returning();
	if (!newEntry) {
		throw new Error("Failed to create time entry");
	}
	return newEntry;
};

export const updateTimeEntry = async (
	id: string,
	organizationId: string,
	data: Partial<InsertTimeEntry>,
): Promise<TimeEntry | null> => {
	const db = getDb();
	const [updatedEntry] = await db
		.update(timeEntries)
		.set({ ...data, updatedAt: new Date() })
		.where(
			and(
				eq(timeEntries.id, id),
				eq(timeEntries.organizationId, organizationId),
			),
		)
		.returning();
	return updatedEntry || null;
};

export const deleteTimeEntry = async (
	id: string,
	organizationId: string,
): Promise<TimeEntry | null> => {
	const db = getDb();
	const [deletedEntry] = await db
		.delete(timeEntries)
		.where(
			and(
				eq(timeEntries.id, id),
				eq(timeEntries.organizationId, organizationId),
			),
		)
		.returning();
	return deletedEntry || null;
};
