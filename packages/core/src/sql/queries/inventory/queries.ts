import { getDb } from "@starter/core/src/sql";
import { locations, stock, stockMoves, type Location, type Stock, type StockMove } from "@starter/core/src/sql/schema";
import { and, desc, eq, sql } from "drizzle-orm";

// Locations
export const listLocations = async (organizationId: string): Promise<Location[]> => {
	const db = getDb();
	const results = await db
		.select()
		.from(locations)
		.where(eq(locations.organizationId, organizationId))
		.orderBy(desc(locations.createdAt));
	return results;
};

export const getLocationById = async (
	id: string,
	organizationId: string,
): Promise<Location | null> => {
	const db = getDb();
	const [location] = await db
		.select()
		.from(locations)
		.where(and(eq(locations.id, id), eq(locations.organizationId, organizationId)));
	return location || null;
};

// Stock
type StockWithProduct = Stock & {
	product: {
		id: string;
		sku: string;
		name: string;
		uom: string;
	};
	location: {
		id: string;
		name: string;
		code: string;
	};
};

export const listStock = async (organizationId: string): Promise<any[]> => {
	const db = getDb();

	// Join stock with products and locations for display
	const results = await db
		.select({
			id: stock.id,
			productId: stock.productId,
			locationId: stock.locationId,
			quantity: stock.quantity,
			reservedQuantity: stock.reservedQuantity,
			lotNumber: stock.lotNumber,
			productSku: sql`products.sku`,
			productName: sql`products.name`,
			productUom: sql`products.uom`,
			locationName: sql`locations.name`,
			locationCode: sql`locations.code`,
		})
		.from(stock)
		.innerJoin(sql`products`, sql`products.id = stock.product_id`)
		.innerJoin(sql`locations`, sql`locations.id = stock.location_id`)
		.where(eq(stock.organizationId, organizationId));

	return results;
};

export const getStockByProduct = async (
	productId: string,
	organizationId: string,
): Promise<Stock[]> => {
	const db = getDb();
	const results = await db
		.select()
		.from(stock)
		.where(and(eq(stock.productId, productId), eq(stock.organizationId, organizationId)));
	return results;
};

export const getStockByLocation = async (
	locationId: string,
	organizationId: string,
): Promise<Stock[]> => {
	const db = getDb();
	const results = await db
		.select()
		.from(stock)
		.where(and(eq(stock.locationId, locationId), eq(stock.organizationId, organizationId)));
	return results;
};

export const getStockByProductAndLocation = async (
	productId: string,
	locationId: string,
	organizationId: string,
	lotNumber?: string | null,
): Promise<Stock | null> => {
	const db = getDb();
	const conditions = [
		eq(stock.productId, productId),
		eq(stock.locationId, locationId),
		eq(stock.organizationId, organizationId),
	];

	if (lotNumber) {
		conditions.push(eq(stock.lotNumber, lotNumber));
	}

	const [result] = await db
		.select()
		.from(stock)
		.where(and(...conditions));

	return result || null;
};

// Stock Moves
type ListStockMovesArgs = {
	organizationId: string;
	productId?: string | null;
	locationId?: string | null;
	limit?: number;
	offset?: number;
};

export const listStockMoves = async ({
	organizationId,
	productId,
	locationId,
	limit = 50,
	offset = 0,
}: ListStockMovesArgs): Promise<StockMove[]> => {
	const db = getDb();

	const conditions = [eq(stockMoves.organizationId, organizationId)];

	if (productId) {
		conditions.push(eq(stockMoves.productId, productId));
	}

	if (locationId) {
		conditions.push(
			sql`(${stockMoves.fromLocationId} = ${locationId} OR ${stockMoves.toLocationId} = ${locationId})`,
		);
	}

	const results = await db
		.select()
		.from(stockMoves)
		.where(and(...conditions))
		.orderBy(desc(stockMoves.createdAt))
		.limit(limit)
		.offset(offset);

	return results;
};

export const getStockMoveById = async (
	id: string,
	organizationId: string,
): Promise<StockMove | null> => {
	const db = getDb();
	const [move] = await db
		.select()
		.from(stockMoves)
		.where(and(eq(stockMoves.id, id), eq(stockMoves.organizationId, organizationId)));
	return move || null;
};
