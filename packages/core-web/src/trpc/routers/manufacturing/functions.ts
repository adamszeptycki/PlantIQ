import type { Context } from "@starter/core-web/src/trpc/context";
import {
	addBomLineItem as addBomLineItemMutation,
	createBom as createBomMutation,
	deleteBom as deleteBomMutation,
	deleteBomLineItem as deleteBomLineItemMutation,
	updateBom as updateBomMutation,
	updateBomLineItem as updateBomLineItemMutation,
} from "@starter/core/src/sql/queries/manufacturing/mutations";
import {
	countBoms as countBomsQuery,
	getBomById as getBomByIdQuery,
	getBomLineItems as getBomLineItemsQuery,
	listBoms as listBomsQuery,
} from "@starter/core/src/sql/queries/manufacturing/queries";
import { TRPCError } from "@trpc/server";
import type {
	CreateBomArgs,
	CreateBomLineItemArgs,
	ListBomsArgs,
	UpdateBomArgs,
	UpdateBomLineItemArgs,
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
