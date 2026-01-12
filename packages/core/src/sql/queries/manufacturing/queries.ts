import { getDb } from "@plantiq/core/src/sql";
import {
	boms,
	bomLineItems,
	manufacturingOrders,
	workOrders,
	timeEntries,
	type Bom,
	type BomLineItem,
	type ManufacturingOrder,
	type WorkOrder,
	type TimeEntry,
} from "@plantiq/core/src/sql/schema";
import { and, desc, eq } from "drizzle-orm";

// BOMs
type ListBomsArgs = {
	organizationId: string;
	productId?: string | null;
	limit?: number;
	offset?: number;
};

export const listBoms = async ({
	organizationId,
	productId,
	limit = 50,
	offset = 0,
}: ListBomsArgs): Promise<Bom[]> => {
	const db = getDb();

	const conditions = [eq(boms.organizationId, organizationId)];

	if (productId) {
		conditions.push(eq(boms.productId, productId));
	}

	const results = await db
		.select()
		.from(boms)
		.where(and(...conditions))
		.orderBy(desc(boms.createdAt))
		.limit(limit)
		.offset(offset);

	return results;
};

export const getBomById = async (
	id: string,
	organizationId: string,
): Promise<Bom | null> => {
	const db = getDb();
	const [bom] = await db
		.select()
		.from(boms)
		.where(and(eq(boms.id, id), eq(boms.organizationId, organizationId)));
	return bom || null;
};

export const countBoms = async (organizationId: string): Promise<number> => {
	const db = getDb();
	const [result] = await db
		.select({ count: boms.id })
		.from(boms)
		.where(eq(boms.organizationId, organizationId));
	return Number(result?.count) || 0;
};

export const getBomLineItems = async (
	bomId: string,
	organizationId: string,
): Promise<BomLineItem[]> => {
	const db = getDb();
	const results = await db
		.select()
		.from(bomLineItems)
		.where(
			and(
				eq(bomLineItems.bomId, bomId),
				eq(bomLineItems.organizationId, organizationId),
			),
		);
	return results;
};

// Manufacturing Orders
type ListManufacturingOrdersArgs = {
	organizationId: string;
	productId?: string | null;
	status?: string | null;
	limit?: number;
	offset?: number;
};

export const listManufacturingOrders = async ({
	organizationId,
	productId,
	status,
	limit = 50,
	offset = 0,
}: ListManufacturingOrdersArgs): Promise<ManufacturingOrder[]> => {
	const db = getDb();

	const conditions = [eq(manufacturingOrders.organizationId, organizationId)];

	if (productId) {
		conditions.push(eq(manufacturingOrders.productId, productId));
	}

	if (status) {
		conditions.push(eq(manufacturingOrders.status, status as any));
	}

	const results = await db
		.select()
		.from(manufacturingOrders)
		.where(and(...conditions))
		.orderBy(desc(manufacturingOrders.createdAt))
		.limit(limit)
		.offset(offset);

	return results;
};

export const getManufacturingOrderById = async (
	id: string,
	organizationId: string,
): Promise<ManufacturingOrder | null> => {
	const db = getDb();
	const [mo] = await db
		.select()
		.from(manufacturingOrders)
		.where(
			and(
				eq(manufacturingOrders.id, id),
				eq(manufacturingOrders.organizationId, organizationId),
			),
		);
	return mo || null;
};

export const countManufacturingOrders = async (organizationId: string): Promise<number> => {
	const db = getDb();
	const [result] = await db
		.select({ count: manufacturingOrders.id })
		.from(manufacturingOrders)
		.where(eq(manufacturingOrders.organizationId, organizationId));
	return Number(result?.count) || 0;
};

// Work Orders
type ListWorkOrdersArgs = {
	organizationId: string;
	manufacturingOrderId?: string | null;
	status?: string | null;
	assignedTo?: string | null;
	limit?: number;
	offset?: number;
};

export const listWorkOrders = async ({
	organizationId,
	manufacturingOrderId,
	status,
	assignedTo,
	limit = 50,
	offset = 0,
}: ListWorkOrdersArgs): Promise<WorkOrder[]> => {
	const db = getDb();

	const conditions = [eq(workOrders.organizationId, organizationId)];

	if (manufacturingOrderId) {
		conditions.push(eq(workOrders.manufacturingOrderId, manufacturingOrderId));
	}

	if (status) {
		conditions.push(eq(workOrders.status, status as any));
	}

	if (assignedTo) {
		conditions.push(eq(workOrders.assignedTo, assignedTo));
	}

	const results = await db
		.select()
		.from(workOrders)
		.where(and(...conditions))
		.orderBy(workOrders.sequence, desc(workOrders.createdAt))
		.limit(limit)
		.offset(offset);

	return results;
};

export const getWorkOrderById = async (
	id: string,
	organizationId: string,
): Promise<WorkOrder | null> => {
	const db = getDb();
	const [wo] = await db
		.select()
		.from(workOrders)
		.where(
			and(
				eq(workOrders.id, id),
				eq(workOrders.organizationId, organizationId),
			),
		);
	return wo || null;
};

export const countWorkOrders = async (organizationId: string): Promise<number> => {
	const db = getDb();
	const [result] = await db
		.select({ count: workOrders.id })
		.from(workOrders)
		.where(eq(workOrders.organizationId, organizationId));
	return Number(result?.count) || 0;
};

// Time Entries
export const getTimeEntriesByWorkOrder = async (
	workOrderId: string,
	organizationId: string,
): Promise<TimeEntry[]> => {
	const db = getDb();
	const results = await db
		.select()
		.from(timeEntries)
		.where(
			and(
				eq(timeEntries.workOrderId, workOrderId),
				eq(timeEntries.organizationId, organizationId),
			),
		)
		.orderBy(desc(timeEntries.startTime));
	return results;
};
