import { getDb } from "@starter/core/src/sql";
import {
	boms,
	bomLineItems,
	type Bom,
	type BomLineItem,
} from "@starter/core/src/sql/schema";
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
