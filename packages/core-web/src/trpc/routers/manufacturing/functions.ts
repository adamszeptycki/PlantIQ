import type { Context } from "@starter/core-web/src/trpc/context";
import {
	addBomLineItem as addBomLineItemMutation,
	createBom as createBomMutation,
	createManufacturingOrder as createManufacturingOrderMutation,
	createWorkOrder as createWorkOrderMutation,
	createTimeEntry as createTimeEntryMutation,
	deleteBom as deleteBomMutation,
	deleteBomLineItem as deleteBomLineItemMutation,
	deleteManufacturingOrder as deleteManufacturingOrderMutation,
	deleteWorkOrder as deleteWorkOrderMutation,
	deleteTimeEntry as deleteTimeEntryMutation,
	updateBom as updateBomMutation,
	updateBomLineItem as updateBomLineItemMutation,
	updateManufacturingOrder as updateManufacturingOrderMutation,
	updateManufacturingOrderStatus as updateManufacturingOrderStatusMutation,
	updateWorkOrder as updateWorkOrderMutation,
	updateWorkOrderStatus as updateWorkOrderStatusMutation,
	updateTimeEntry as updateTimeEntryMutation,
} from "@starter/core/src/sql/queries/manufacturing/mutations";
import {
	countBoms as countBomsQuery,
	countManufacturingOrders as countManufacturingOrdersQuery,
	countWorkOrders as countWorkOrdersQuery,
	getBomById as getBomByIdQuery,
	getBomLineItems as getBomLineItemsQuery,
	getManufacturingOrderById as getManufacturingOrderByIdQuery,
	getWorkOrderById as getWorkOrderByIdQuery,
	getTimeEntriesByWorkOrder as getTimeEntriesByWorkOrderQuery,
	listBoms as listBomsQuery,
	listManufacturingOrders as listManufacturingOrdersQuery,
	listWorkOrders as listWorkOrdersQuery,
} from "@starter/core/src/sql/queries/manufacturing/queries";
import { TRPCError } from "@trpc/server";
import type {
	CreateBomArgs,
	CreateBomLineItemArgs,
	CreateManufacturingOrderArgs,
	CreateWorkOrderArgs,
	CreateTimeEntryArgs,
	ListBomsArgs,
	ListManufacturingOrdersArgs,
	ListWorkOrdersArgs,
	UpdateBomArgs,
	UpdateBomLineItemArgs,
	UpdateManufacturingOrderArgs,
	UpdateWorkOrderArgs,
	UpdateTimeEntryArgs,
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

// Work Orders
export async function createWorkOrder(ctx: Context, input: CreateWorkOrderArgs) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const wo = await createWorkOrderMutation({
		...input,
		organizationId,
		estimatedDuration: input.estimatedDuration || null,
		actualDuration: null,
		startedAt: null,
		completedAt: null,
	});

	return wo;
}

export async function updateWorkOrder(
	ctx: Context,
	input: UpdateWorkOrderArgs & { id: string },
) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const { id, ...updateData } = input;
	const wo = await updateWorkOrderMutation(id, organizationId, updateData);

	if (!wo) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Work order not found",
		});
	}

	return wo;
}

export async function deleteWorkOrder(ctx: Context, input: { id: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const wo = await deleteWorkOrderMutation(input.id, organizationId);

	if (!wo) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Work order not found",
		});
	}

	return { success: true, wo };
}

export async function listWorkOrders(ctx: Context, input: ListWorkOrdersArgs) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const [workOrders, total] = await Promise.all([
		listWorkOrdersQuery({ ...input, organizationId }),
		countWorkOrdersQuery(organizationId),
	]);

	return {
		workOrders,
		total,
		hasMore: input.offset + input.limit < total,
	};
}

export async function getWorkOrder(ctx: Context, input: { id: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const wo = await getWorkOrderByIdQuery(input.id, organizationId);

	if (!wo) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Work order not found",
		});
	}

	return wo;
}

export async function updateWorkOrderStatus(
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

	const wo = await updateWorkOrderStatusMutation(
		input.id,
		organizationId,
		input.status,
	);

	if (!wo) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Work order not found",
		});
	}

	return wo;
}

// Time Entries
export async function createTimeEntry(ctx: Context, input: CreateTimeEntryArgs) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	const userId = ctx.session?.session?.userId;
	if (!organizationId || !userId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization or user",
		});
	}

	const entry = await createTimeEntryMutation({
		...input,
		organizationId,
		userId,
		endTime: input.endTime ? new Date(input.endTime) : null,
		startTime: new Date(input.startTime),
	});

	return entry;
}

export async function updateTimeEntry(
	ctx: Context,
	input: UpdateTimeEntryArgs & { id: string },
) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const { id, ...updateData } = input;

	// Convert date strings to Date objects if present
	const processedData: any = { ...updateData };
	if (updateData.startTime) {
		processedData.startTime = new Date(updateData.startTime);
	}
	if (updateData.endTime !== undefined) {
		processedData.endTime = updateData.endTime ? new Date(updateData.endTime) : null;
	}

	const entry = await updateTimeEntryMutation(id, organizationId, processedData);

	if (!entry) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Time entry not found",
		});
	}

	return entry;
}

export async function deleteTimeEntry(ctx: Context, input: { id: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const entry = await deleteTimeEntryMutation(input.id, organizationId);

	if (!entry) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Time entry not found",
		});
	}

	return { success: true, entry };
}

export async function getWorkOrderTimeEntries(ctx: Context, input: { workOrderId: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const entries = await getTimeEntriesByWorkOrderQuery(input.workOrderId, organizationId);

	return entries;
}
