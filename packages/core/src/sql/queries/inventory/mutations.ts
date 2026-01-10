import { getDb } from "@starter/core/src/sql";
import {
	locations,
	stock,
	stockMoves,
	type InsertLocation,
	type InsertStockMove,
	type Location,
	type Stock,
	type StockMove,
} from "@starter/core/src/sql/schema";
import { and, eq, sql } from "drizzle-orm";

// Locations
export const createLocation = async (data: InsertLocation): Promise<Location> => {
	const db = getDb();
	const result = await db.insert(locations).values(data).returning();
	const newLocation = (result as Location[])[0];
	if (!newLocation) {
		throw new Error("Failed to create location");
	}
	return newLocation;
};

export const updateLocation = async (
	id: string,
	organizationId: string,
	data: Partial<InsertLocation>,
): Promise<Location | null> => {
	const db = getDb();
	const [updatedLocation] = await db
		.update(locations)
		.set({ ...data, updatedAt: new Date() })
		.where(and(eq(locations.id, id), eq(locations.organizationId, organizationId)))
		.returning();
	return updatedLocation || null;
};

// Stock Moves & Stock Updates
export const createStockMove = async (data: InsertStockMove): Promise<StockMove> => {
	const db = getDb();

	// Create the stock move
	const [newMove] = await db.insert(stockMoves).values(data).returning();
	if (!newMove) {
		throw new Error("Failed to create stock move");
	}

	// Update stock levels based on move type
	await updateStockFromMove(newMove);

	return newMove;
};

async function updateStockFromMove(move: StockMove) {
	const db = getDb();

	// Handle different move types
	switch (move.moveType) {
		case "in": {
			// Increase stock at toLocation
			if (move.toLocationId) {
				await upsertStock(
					move.organizationId,
					move.productId,
					move.toLocationId,
					move.quantity,
					move.lotNumber,
				);
			}
			break;
		}
		case "out": {
			// Decrease stock at fromLocation
			if (move.fromLocationId) {
				await upsertStock(
					move.organizationId,
					move.productId,
					move.fromLocationId,
					sql`-${move.quantity}`,
					move.lotNumber,
				);
			}
			break;
		}
		case "internal": {
			// Decrease at fromLocation, increase at toLocation
			if (move.fromLocationId) {
				await upsertStock(
					move.organizationId,
					move.productId,
					move.fromLocationId,
					sql`-${move.quantity}`,
					move.lotNumber,
				);
			}
			if (move.toLocationId) {
				await upsertStock(
					move.organizationId,
					move.productId,
					move.toLocationId,
					move.quantity,
					move.lotNumber,
				);
			}
			break;
		}
		case "adjustment": {
			// Direct adjustment to toLocation
			if (move.toLocationId) {
				await setStock(
					move.organizationId,
					move.productId,
					move.toLocationId,
					move.quantity,
					move.lotNumber,
				);
			}
			break;
		}
		case "production": {
			// Handle production moves (consume from fromLocation, produce to toLocation)
			if (move.fromLocationId) {
				await upsertStock(
					move.organizationId,
					move.productId,
					move.fromLocationId,
					sql`-${move.quantity}`,
					move.lotNumber,
				);
			}
			if (move.toLocationId) {
				await upsertStock(
					move.organizationId,
					move.productId,
					move.toLocationId,
					move.quantity,
					move.lotNumber,
				);
			}
			break;
		}
	}
}

async function upsertStock(
	organizationId: string,
	productId: string,
	locationId: string,
	quantityChange: any, // can be number or sql expression
	lotNumber?: string | null,
) {
	const db = getDb();

	// Check if stock record exists
	const conditions = [
		eq(stock.organizationId, organizationId),
		eq(stock.productId, productId),
		eq(stock.locationId, locationId),
	];

	if (lotNumber) {
		conditions.push(eq(stock.lotNumber, lotNumber));
	} else {
		conditions.push(sql`${stock.lotNumber} IS NULL`);
	}

	const [existing] = await db
		.select()
		.from(stock)
		.where(and(...conditions));

	if (existing) {
		// Update existing stock
		await db
			.update(stock)
			.set({
				quantity: sql`${stock.quantity} + ${quantityChange}`,
				updatedAt: new Date(),
			})
			.where(eq(stock.id, existing.id));
	} else {
		// Create new stock record
		await db.insert(stock).values({
			organizationId,
			productId,
			locationId,
			quantity: typeof quantityChange === "number" ? quantityChange.toString() : "0",
			lotNumber,
		});
	}
}

async function setStock(
	organizationId: string,
	productId: string,
	locationId: string,
	quantity: string,
	lotNumber?: string | null,
) {
	const db = getDb();

	const conditions = [
		eq(stock.organizationId, organizationId),
		eq(stock.productId, productId),
		eq(stock.locationId, locationId),
	];

	if (lotNumber) {
		conditions.push(eq(stock.lotNumber, lotNumber));
	} else {
		conditions.push(sql`${stock.lotNumber} IS NULL`);
	}

	const [existing] = await db
		.select()
		.from(stock)
		.where(and(...conditions));

	if (existing) {
		await db
			.update(stock)
			.set({
				quantity,
				updatedAt: new Date(),
			})
			.where(eq(stock.id, existing.id));
	} else {
		await db.insert(stock).values({
			organizationId,
			productId,
			locationId,
			quantity,
			lotNumber,
		});
	}
}

// Convenience function for stock adjustments
export const adjustStock = async (
	organizationId: string,
	productId: string,
	locationId: string,
	newQuantity: string,
	notes?: string,
	lotNumber?: string | null,
	userId?: string,
): Promise<StockMove> => {
	const data: InsertStockMove = {
		organizationId,
		productId,
		moveType: "adjustment",
		toLocationId: locationId,
		quantity: newQuantity,
		lotNumber,
		notes,
		referenceType: "adjustment",
		completedAt: new Date(),
		completedBy: userId,
	};

	return createStockMove(data);
};

// Reserve and unreserve stock
export const reserveStock = async (
	organizationId: string,
	productId: string,
	locationId: string,
	quantity: string,
	lotNumber?: string | null,
): Promise<void> => {
	const db = getDb();

	const conditions = [
		eq(stock.organizationId, organizationId),
		eq(stock.productId, productId),
		eq(stock.locationId, locationId),
	];

	if (lotNumber) {
		conditions.push(eq(stock.lotNumber, lotNumber));
	} else {
		conditions.push(sql`${stock.lotNumber} IS NULL`);
	}

	await db
		.update(stock)
		.set({
			reservedQuantity: sql`${stock.reservedQuantity} + ${quantity}`,
			updatedAt: new Date(),
		})
		.where(and(...conditions));
};

export const unreserveStock = async (
	organizationId: string,
	productId: string,
	locationId: string,
	quantity: string,
	lotNumber?: string | null,
): Promise<void> => {
	const db = getDb();

	const conditions = [
		eq(stock.organizationId, organizationId),
		eq(stock.productId, productId),
		eq(stock.locationId, locationId),
	];

	if (lotNumber) {
		conditions.push(eq(stock.lotNumber, lotNumber));
	} else {
		conditions.push(sql`${stock.lotNumber} IS NULL`);
	}

	await db
		.update(stock)
		.set({
			reservedQuantity: sql`${stock.reservedQuantity} - ${quantity}`,
			updatedAt: new Date(),
		})
		.where(and(...conditions));
};
