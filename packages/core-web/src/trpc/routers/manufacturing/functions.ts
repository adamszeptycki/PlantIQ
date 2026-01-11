import type { Context } from "@starter/core-web/src/trpc/context";
import {
	addBomLineItem as addBomLineItemMutation,
	createBom as createBomMutation,
	createManufacturingOrder as createManufacturingOrderMutation,
	deleteBom as deleteBomMutation,
	deleteBomLineItem as deleteBomLineItemMutation,
	deleteManufacturingOrder as deleteManufacturingOrderMutation,
	updateBom as updateBomMutation,
	updateBomLineItem as updateBomLineItemMutation,
	updateManufacturingOrder as updateManufacturingOrderMutation,
	updateManufacturingOrderStatus as updateManufacturingOrderStatusMutation,
} from "@starter/core/src/sql/queries/manufacturing/mutations";
import {
	countBoms as countBomsQuery,
	countManufacturingOrders as countManufacturingOrdersQuery,
	getBomById as getBomByIdQuery,
	getBomLineItems as getBomLineItemsQuery,
	getManufacturingOrderById as getManufacturingOrderByIdQuery,
	listBoms as listBomsQuery,
	listManufacturingOrders as listManufacturingOrdersQuery,
} from "@starter/core/src/sql/queries/manufacturing/queries";
import { TRPCError } from "@trpc/server";
import type {
	CreateBomArgs,
	CreateBomLineItemArgs,
	CreateManufacturingOrderArgs,
	ListBomsArgs,
	ListManufacturingOrdersArgs,
	UpdateBomArgs,
	UpdateBomLineItemArgs,
	UpdateManufacturingOrderArgs,
} from "./schema";

// BOMs
export async function createBom(ctx: Context, input: CreateBomArgs) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const bom = await createBomMutation({
		...input,
		organizationId,
	});

	return bom;
}

export async function updateBom(ctx: Context, input: UpdateBomArgs & { id: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const { id, ...updateData } = input;
	const bom = await updateBomMutation(id, organizationId, updateData);

	if (!bom) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "BOM not found",
		});
	}

	return bom;
}

export async function deleteBom(ctx: Context, input: { id: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const bom = await deleteBomMutation(input.id, organizationId);

	if (!bom) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "BOM not found",
		});
	}

	return { success: true, bom };
}

export async function listBoms(ctx: Context, input: ListBomsArgs) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const [boms, total] = await Promise.all([
		listBomsQuery({ ...input, organizationId }),
		countBomsQuery(organizationId),
	]);

	return {
		boms,
		total,
		hasMore: input.offset + input.limit < total,
	};
}

export async function getBom(ctx: Context, input: { id: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const bom = await getBomByIdQuery(input.id, organizationId);

	if (!bom) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "BOM not found",
		});
	}

	return bom;
}

export async function getBomLineItems(ctx: Context, input: { bomId: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const lineItems = await getBomLineItemsQuery(input.bomId, organizationId);

	return lineItems;
}

export async function addBomLineItem(ctx: Context, input: CreateBomLineItemArgs) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const lineItem = await addBomLineItemMutation({
		...input,
		organizationId,
	});

	return lineItem;
}

export async function updateBomLineItem(
	ctx: Context,
	input: UpdateBomLineItemArgs & { id: string },
) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const { id, ...updateData } = input;
	const lineItem = await updateBomLineItemMutation(id, organizationId, updateData);

	if (!lineItem) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "BOM line item not found",
		});
	}

	return lineItem;
}

export async function deleteBomLineItem(ctx: Context, input: { id: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const lineItem = await deleteBomLineItemMutation(input.id, organizationId);

	if (!lineItem) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "BOM line item not found",
		});
	}

	return { success: true, lineItem };
}

// Manufacturing Orders
export async function createManufacturingOrder(
	ctx: Context,
	input: CreateManufacturingOrderArgs,
) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const mo = await createManufacturingOrderMutation({
		...input,
		organizationId,
		quantityProduced: "0",
	});

	return mo;
}

export async function updateManufacturingOrder(
	ctx: Context,
	input: UpdateManufacturingOrderArgs & { id: string },
) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const { id, ...updateData } = input;
	const mo = await updateManufacturingOrderMutation(id, organizationId, updateData);

	if (!mo) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Manufacturing order not found",
		});
	}

	return mo;
}

export async function deleteManufacturingOrder(ctx: Context, input: { id: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const mo = await deleteManufacturingOrderMutation(input.id, organizationId);

	if (!mo) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Manufacturing order not found",
		});
	}

	return { success: true, mo };
}

export async function listManufacturingOrders(
	ctx: Context,
	input: ListManufacturingOrdersArgs,
) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const [mos, total] = await Promise.all([
		listManufacturingOrdersQuery({ ...input, organizationId }),
		countManufacturingOrdersQuery(organizationId),
	]);

	return {
		manufacturingOrders: mos,
		total,
		hasMore: input.offset + input.limit < total,
	};
}

export async function getManufacturingOrder(ctx: Context, input: { id: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const mo = await getManufacturingOrderByIdQuery(input.id, organizationId);

	if (!mo) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Manufacturing order not found",
		});
	}

	return mo;
}

export async function updateManufacturingOrderStatus(
	ctx: Context,
	input: { id: string; status: string },
) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const mo = await updateManufacturingOrderStatusMutation(
		input.id,
		organizationId,
		input.status,
	);

	if (!mo) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Manufacturing order not found",
		});
	}

	return mo;
}
