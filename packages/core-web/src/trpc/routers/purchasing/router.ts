import {
	buyerProcedure,
	createTRPCRouter,
} from "@starter/core-web/src/trpc/trpc";
import { z } from "zod";
import * as purchasingFunctions from "./functions";
import {
	CreateVendorSchema,
	UpdateVendorSchema,
	ListVendorsSchema,
	CreateProductVendorSchema,
	UpdateProductVendorSchema,
	CreatePurchaseOrderSchema,
	UpdatePurchaseOrderSchema,
	ListPurchaseOrdersSchema,
	CreatePurchaseOrderLineItemSchema,
	UpdatePurchaseOrderLineItemSchema,
} from "./schema";

export const purchasingRouter = createTRPCRouter({
	// Vendors
	createVendor: buyerProcedure
		.input(CreateVendorSchema)
		.mutation(async ({ ctx, input }) => {
			return purchasingFunctions.createVendor(ctx, input);
		}),

	updateVendor: buyerProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}).merge(UpdateVendorSchema),
		)
		.mutation(async ({ ctx, input }) => {
			return purchasingFunctions.updateVendor(ctx, input);
		}),

	deleteVendor: buyerProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return purchasingFunctions.deleteVendor(ctx, input);
		}),

	listVendors: buyerProcedure
		.input(ListVendorsSchema)
		.query(async ({ ctx, input }) => {
			return purchasingFunctions.listVendors(ctx, input);
		}),

	getVendor: buyerProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.query(async ({ ctx, input }) => {
			return purchasingFunctions.getVendor(ctx, input);
		}),

	// Product Vendors
	addProductVendor: buyerProcedure
		.input(CreateProductVendorSchema)
		.mutation(async ({ ctx, input }) => {
			return purchasingFunctions.addProductVendor(ctx, input);
		}),

	updateProductVendor: buyerProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}).merge(UpdateProductVendorSchema),
		)
		.mutation(async ({ ctx, input }) => {
			return purchasingFunctions.updateProductVendor(ctx, input);
		}),

	deleteProductVendor: buyerProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return purchasingFunctions.deleteProductVendor(ctx, input);
		}),

	getProductVendors: buyerProcedure
		.input(
			z.object({
				productId: z.string().uuid(),
			}),
		)
		.query(async ({ ctx, input }) => {
			return purchasingFunctions.getProductVendors(ctx, input);
		}),

	getVendorProducts: buyerProcedure
		.input(
			z.object({
				vendorId: z.string().uuid(),
			}),
		)
		.query(async ({ ctx, input }) => {
			return purchasingFunctions.getVendorProducts(ctx, input);
		}),

	// Purchase Orders
	createPurchaseOrder: buyerProcedure
		.input(CreatePurchaseOrderSchema)
		.mutation(async ({ ctx, input }) => {
			return purchasingFunctions.createPurchaseOrder(ctx, input);
		}),

	updatePurchaseOrder: buyerProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}).merge(UpdatePurchaseOrderSchema),
		)
		.mutation(async ({ ctx, input }) => {
			return purchasingFunctions.updatePurchaseOrder(ctx, input);
		}),

	deletePurchaseOrder: buyerProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return purchasingFunctions.deletePurchaseOrder(ctx, input);
		}),

	listPurchaseOrders: buyerProcedure
		.input(ListPurchaseOrdersSchema)
		.query(async ({ ctx, input }) => {
			return purchasingFunctions.listPurchaseOrders(ctx, input);
		}),

	getPurchaseOrder: buyerProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.query(async ({ ctx, input }) => {
			return purchasingFunctions.getPurchaseOrder(ctx, input);
		}),

	updatePurchaseOrderStatus: buyerProcedure
		.input(
			z.object({
				id: z.string().uuid(),
				status: z.enum(["draft", "sent", "confirmed", "received", "cancelled"]),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return purchasingFunctions.updatePurchaseOrderStatus(ctx, input);
		}),

	// Purchase Order Line Items
	addPurchaseOrderLineItem: buyerProcedure
		.input(CreatePurchaseOrderLineItemSchema)
		.mutation(async ({ ctx, input }) => {
			return purchasingFunctions.addPurchaseOrderLineItem(ctx, input);
		}),

	updatePurchaseOrderLineItem: buyerProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}).merge(UpdatePurchaseOrderLineItemSchema),
		)
		.mutation(async ({ ctx, input }) => {
			return purchasingFunctions.updatePurchaseOrderLineItem(ctx, input);
		}),

	deletePurchaseOrderLineItem: buyerProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return purchasingFunctions.deletePurchaseOrderLineItem(ctx, input);
		}),

	getPurchaseOrderLineItems: buyerProcedure
		.input(
			z.object({
				purchaseOrderId: z.string().uuid(),
			}),
		)
		.query(async ({ ctx, input }) => {
			return purchasingFunctions.getPurchaseOrderLineItems(ctx, input);
		}),

	// Purchase Suggestions
	getPurchaseSuggestions: buyerProcedure
		.query(async ({ ctx }) => {
			return purchasingFunctions.getPurchaseSuggestions(ctx);
		}),
});
