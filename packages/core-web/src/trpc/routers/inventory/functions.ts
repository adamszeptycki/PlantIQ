import type { Context } from "@plantiq/core-web/src/trpc/context";
import {
	adjustStock as adjustStockMutation,
	createLocation as createLocationMutation,
	createStockMove as createStockMoveMutation,
	updateLocation as updateLocationMutation,
} from "@plantiq/core/src/sql/queries/inventory/mutations";
import {
	getLocationById as getLocationByIdQuery,
	getStockByProduct as getStockByProductQuery,
	listLocations as listLocationsQuery,
	listStock as listStockQuery,
	listStockMoves as listStockMovesQuery,
} from "@plantiq/core/src/sql/queries/inventory/queries";
import { TRPCError } from "@trpc/server";
import type {
	AdjustStockArgs,
	CreateLocationArgs,
	CreateStockMoveArgs,
	ListStockMovesArgs,
	UpdateLocationArgs,
} from "./schema";

// Locations
export async function createLocation(ctx: Context, input: CreateLocationArgs) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const location = await createLocationMutation({
		...input,
		organizationId,
	});

	return location;
}

export async function updateLocation(
	ctx: Context,
	input: UpdateLocationArgs & { id: string },
) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const { id, ...updateData } = input;
	const location = await updateLocationMutation(id, organizationId, updateData);

	if (!location) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Location not found",
		});
	}

	return location;
}

export async function listLocations(ctx: Context) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const locations = await listLocationsQuery(organizationId);
	return locations;
}

export async function getLocation(ctx: Context, input: { id: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const location = await getLocationByIdQuery(input.id, organizationId);

	if (!location) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Location not found",
		});
	}

	return location;
}

// Stock
export async function listStock(ctx: Context) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const stock = await listStockQuery(organizationId);
	return stock;
}

export async function getStockByProduct(ctx: Context, input: { productId: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const stock = await getStockByProductQuery(input.productId, organizationId);
	return stock;
}

// Stock Moves
export async function createStockMove(ctx: Context, input: CreateStockMoveArgs) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const userId = ctx.session?.user?.id;

	const stockMove = await createStockMoveMutation({
		...input,
		organizationId,
		completedAt: new Date(),
		completedBy: userId,
	});

	return stockMove;
}

export async function adjustStock(ctx: Context, input: AdjustStockArgs) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const userId = ctx.session?.user?.id;

	const stockMove = await adjustStockMutation(
		organizationId,
		input.productId,
		input.locationId,
		input.newQuantity,
		input.notes ?? undefined,
		input.lotNumber ?? undefined,
		userId,
	);

	return stockMove;
}

export async function listStockMoves(ctx: Context, input: ListStockMovesArgs) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const moves = await listStockMovesQuery({
		...input,
		organizationId,
	});

	return moves;
}
