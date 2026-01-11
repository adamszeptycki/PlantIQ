import type { Context } from "@starter/core-web/src/trpc/context";
import {
	createProduct as createProductMutation,
	deleteProduct as deleteProductMutation,
	updateProduct as updateProductMutation,
} from "@starter/core/src/sql/queries/products/mutations";
import {
	countProducts as countProductsQuery,
	getProductById as getProductByIdQuery,
	listProducts as listProductsQuery,
} from "@starter/core/src/sql/queries/products/queries";
import { TRPCError } from "@trpc/server";
import type { CreateProductArgs, ListProductsArgs, UpdateProductArgs } from "./schema";

export async function createProduct(
	ctx: Context,
	input: CreateProductArgs,
) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	const userId = ctx.session?.user?.id;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const product = await createProductMutation(
		{
			...input,
			organizationId,
		},
		userId,
	);

	return product;
}

export async function updateProduct(
	ctx: Context,
	input: UpdateProductArgs & { id: string },
) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	const userId = ctx.session?.user?.id;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const { id, ...updateData } = input;
	const product = await updateProductMutation(id, organizationId, updateData, userId);

	if (!product) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Product not found",
		});
	}

	return product;
}

export async function deleteProduct(
	ctx: Context,
	input: { id: string },
) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	const userId = ctx.session?.user?.id;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const product = await deleteProductMutation(input.id, organizationId, userId);

	if (!product) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Product not found",
		});
	}

	return { success: true, product };
}

export async function listProducts(
	ctx: Context,
	input: ListProductsArgs,
) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const [products, total] = await Promise.all([
		listProductsQuery({ ...input, organizationId }),
		countProductsQuery(organizationId),
	]);

	return {
		products,
		total,
		hasMore: input.offset + input.limit < total,
	};
}

export async function getProduct(
	ctx: Context,
	input: { id: string },
) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const product = await getProductByIdQuery(input.id, organizationId);

	if (!product) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Product not found",
		});
	}

	return product;
}
