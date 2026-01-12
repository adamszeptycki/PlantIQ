import type { Context } from "@plantiq/core-web/src/trpc/context";
import {
	createVendor as createVendorMutation,
	updateVendor as updateVendorMutation,
	deleteVendor as deleteVendorMutation,
	addProductVendor as addProductVendorMutation,
	updateProductVendor as updateProductVendorMutation,
	deleteProductVendor as deleteProductVendorMutation,
	createPurchaseOrder as createPurchaseOrderMutation,
	updatePurchaseOrder as updatePurchaseOrderMutation,
	deletePurchaseOrder as deletePurchaseOrderMutation,
	updatePurchaseOrderStatus as updatePurchaseOrderStatusMutation,
	addPurchaseOrderLineItem as addPurchaseOrderLineItemMutation,
	updatePurchaseOrderLineItem as updatePurchaseOrderLineItemMutation,
	deletePurchaseOrderLineItem as deletePurchaseOrderLineItemMutation,
} from "@plantiq/core/src/sql/queries/purchasing/mutations";
import {
	listVendors as listVendorsQuery,
	getVendorById as getVendorByIdQuery,
	countVendors as countVendorsQuery,
	getProductVendors as getProductVendorsQuery,
	getVendorProducts as getVendorProductsQuery,
	listPurchaseOrders as listPurchaseOrdersQuery,
	getPurchaseOrderById as getPurchaseOrderByIdQuery,
	countPurchaseOrders as countPurchaseOrdersQuery,
	getPurchaseOrderLineItems as getPurchaseOrderLineItemsQuery,
	getPurchaseSuggestions as getPurchaseSuggestionsQuery,
} from "@plantiq/core/src/sql/queries/purchasing/queries";
import { TRPCError } from "@trpc/server";
import type {
	CreateVendorArgs,
	UpdateVendorArgs,
	ListVendorsArgs,
	CreateProductVendorArgs,
	UpdateProductVendorArgs,
	CreatePurchaseOrderArgs,
	UpdatePurchaseOrderArgs,
	ListPurchaseOrdersArgs,
	CreatePurchaseOrderLineItemArgs,
	UpdatePurchaseOrderLineItemArgs,
} from "./schema";

// Vendors
export async function createVendor(ctx: Context, input: CreateVendorArgs) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const vendor = await createVendorMutation({
		...input,
		organizationId,
	});

	return vendor;
}

export async function updateVendor(
	ctx: Context,
	input: UpdateVendorArgs & { id: string },
) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const { id, ...updateData } = input;
	const vendor = await updateVendorMutation(id, organizationId, updateData);

	if (!vendor) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Vendor not found",
		});
	}

	return vendor;
}

export async function deleteVendor(ctx: Context, input: { id: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const vendor = await deleteVendorMutation(input.id, organizationId);

	if (!vendor) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Vendor not found",
		});
	}

	return { success: true, vendor };
}

export async function listVendors(ctx: Context, input: ListVendorsArgs) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const [vendors, total] = await Promise.all([
		listVendorsQuery({ ...input, organizationId }),
		countVendorsQuery(organizationId),
	]);

	return {
		vendors,
		total,
		hasMore: input.offset + input.limit < total,
	};
}

export async function getVendor(ctx: Context, input: { id: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const vendor = await getVendorByIdQuery(input.id, organizationId);

	if (!vendor) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Vendor not found",
		});
	}

	return vendor;
}

// Product Vendors
export async function addProductVendor(ctx: Context, input: CreateProductVendorArgs) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const productVendor = await addProductVendorMutation({
		...input,
		organizationId,
	});

	return productVendor;
}

export async function updateProductVendor(
	ctx: Context,
	input: UpdateProductVendorArgs & { id: string },
) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const { id, ...updateData } = input;
	const productVendor = await updateProductVendorMutation(id, organizationId, updateData);

	if (!productVendor) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Product vendor not found",
		});
	}

	return productVendor;
}

export async function deleteProductVendor(ctx: Context, input: { id: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const productVendor = await deleteProductVendorMutation(input.id, organizationId);

	if (!productVendor) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Product vendor not found",
		});
	}

	return { success: true, productVendor };
}

export async function getProductVendors(ctx: Context, input: { productId: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const productVendors = await getProductVendorsQuery(input.productId, organizationId);

	return productVendors;
}

export async function getVendorProducts(ctx: Context, input: { vendorId: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const vendorProducts = await getVendorProductsQuery(input.vendorId, organizationId);

	return vendorProducts;
}

// Purchase Orders
export async function createPurchaseOrder(ctx: Context, input: CreatePurchaseOrderArgs) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const po = await createPurchaseOrderMutation({
		...input,
		organizationId,
		subtotal: "0",
		total: "0",
		receivedDate: null,
	});

	return po;
}

export async function updatePurchaseOrder(
	ctx: Context,
	input: UpdatePurchaseOrderArgs & { id: string },
) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const { id, ...updateData } = input;
	const po = await updatePurchaseOrderMutation(id, organizationId, updateData);

	if (!po) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Purchase order not found",
		});
	}

	return po;
}

export async function deletePurchaseOrder(ctx: Context, input: { id: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const po = await deletePurchaseOrderMutation(input.id, organizationId);

	if (!po) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Purchase order not found",
		});
	}

	return { success: true, po };
}

export async function listPurchaseOrders(ctx: Context, input: ListPurchaseOrdersArgs) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const [purchaseOrders, total] = await Promise.all([
		listPurchaseOrdersQuery({ ...input, organizationId }),
		countPurchaseOrdersQuery(organizationId),
	]);

	return {
		purchaseOrders,
		total,
		hasMore: input.offset + input.limit < total,
	};
}

export async function getPurchaseOrder(ctx: Context, input: { id: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const po = await getPurchaseOrderByIdQuery(input.id, organizationId);

	if (!po) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Purchase order not found",
		});
	}

	return po;
}

export async function updatePurchaseOrderStatus(
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

	const po = await updatePurchaseOrderStatusMutation(
		input.id,
		organizationId,
		input.status,
	);

	if (!po) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Purchase order not found",
		});
	}

	return po;
}

// Purchase Order Line Items
export async function addPurchaseOrderLineItem(
	ctx: Context,
	input: CreatePurchaseOrderLineItemArgs,
) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const lineItem = await addPurchaseOrderLineItemMutation({
		...input,
		organizationId,
		quantityReceived: "0",
	});

	return lineItem;
}

export async function updatePurchaseOrderLineItem(
	ctx: Context,
	input: UpdatePurchaseOrderLineItemArgs & { id: string },
) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const { id, ...updateData } = input;
	const lineItem = await updatePurchaseOrderLineItemMutation(id, organizationId, updateData);

	if (!lineItem) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Purchase order line item not found",
		});
	}

	return lineItem;
}

export async function deletePurchaseOrderLineItem(ctx: Context, input: { id: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const lineItem = await deletePurchaseOrderLineItemMutation(input.id, organizationId);

	if (!lineItem) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Purchase order line item not found",
		});
	}

	return { success: true, lineItem };
}

export async function getPurchaseOrderLineItems(ctx: Context, input: { purchaseOrderId: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const lineItems = await getPurchaseOrderLineItemsQuery(input.purchaseOrderId, organizationId);

	return lineItems;
}

// Purchase Suggestions
export async function getPurchaseSuggestions(ctx: Context) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const suggestions = await getPurchaseSuggestionsQuery(organizationId);

	return suggestions;
}
