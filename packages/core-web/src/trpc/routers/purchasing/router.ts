import {
	protectedProcedureWithOrganization,
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
	createVendor: protectedProcedureWithOrganization
		.input(CreateVendorSchema)
		.mutation(async ({ ctx, input }) => {
			return purchasingFunctions.createVendor(ctx, input);
		}),

	updateVendor: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
			}).merge(UpdateVendorSchema),
		)
		.mutation(async ({ ctx, input }) => {
			return purchasingFunctions.updateVendor(ctx, input);
		}),

	deleteVendor: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return purchasingFunctions.deleteVendor(ctx, input);
		}),

	listVendors: protectedProcedureWithOrganization
		.input(ListVendorsSchema)
		.query(async ({ ctx, input }) => {
			return purchasingFunctions.listVendors(ctx, input);
		}),

	getVendor: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.query(async ({ ctx, input }) => {
			return purchasingFunctions.getVendor(ctx, input);
		}),

	// Product Vendors
	addProductVendor: protectedProcedureWithOrganization
		.input(CreateProductVendorSchema)
		.mutation(async ({ ctx, input }) => {
			return purchasingFunctions.addProductVendor(ctx, input);
		}),

	updateProductVendor: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
			}).merge(UpdateProductVendorSchema),
		)
		.mutation(async ({ ctx, input }) => {
			return purchasingFunctions.updateProductVendor(ctx, input);
		}),

	deleteProductVendor: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return purchasingFunctions.deleteProductVendor(ctx, input);
		}),

	getProductVendors: protectedProcedureWithOrganization
		.input(
			z.object({
				productId: z.string().uuid(),
			}),
		)
		.query(async ({ ctx, input }) => {
			return purchasingFunctions.getProductVendors(ctx, input);
		}),

	getVendorProducts: protectedProcedureWithOrganization
		.input(
			z.object({
				vendorId: z.string().uuid(),
			}),
		)
		.query(async ({ ctx, input }) => {
			return purchasingFunctions.getVendorProducts(ctx, input);
		}),

	// Purchase Orders
	createPurchaseOrder: protectedProcedureWithOrganization
		.input(CreatePurchaseOrderSchema)
		.mutation(async ({ ctx, input }) => {
			return purchasingFunctions.createPurchaseOrder(ctx, input);
		}),

	updatePurchaseOrder: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
			}).merge(UpdatePurchaseOrderSchema),
		)
		.mutation(async ({ ctx, input }) => {
			return purchasingFunctions.updatePurchaseOrder(ctx, input);
		}),

	deletePurchaseOrder: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return purchasingFunctions.deletePurchaseOrder(ctx, input);
		}),

	listPurchaseOrders: protectedProcedureWithOrganization
		.input(ListPurchaseOrdersSchema)
		.query(async ({ ctx, input }) => {
			return purchasingFunctions.listPurchaseOrders(ctx, input);
		}),

	getPurchaseOrder: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.query(async ({ ctx, input }) => {
			return purchasingFunctions.getPurchaseOrder(ctx, input);
		}),

	updatePurchaseOrderStatus: protectedProcedureWithOrganization
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
	addPurchaseOrderLineItem: protectedProcedureWithOrganization
		.input(CreatePurchaseOrderLineItemSchema)
		.mutation(async ({ ctx, input }) => {
			return purchasingFunctions.addPurchaseOrderLineItem(ctx, input);
		}),

	updatePurchaseOrderLineItem: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
			}).merge(UpdatePurchaseOrderLineItemSchema),
		)
		.mutation(async ({ ctx, input }) => {
			return purchasingFunctions.updatePurchaseOrderLineItem(ctx, input);
		}),

	deletePurchaseOrderLineItem: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return purchasingFunctions.deletePurchaseOrderLineItem(ctx, input);
		}),

	getPurchaseOrderLineItems: protectedProcedureWithOrganization
		.input(
			z.object({
				purchaseOrderId: z.string().uuid(),
			}),
		)
		.query(async ({ ctx, input }) => {
			return purchasingFunctions.getPurchaseOrderLineItems(ctx, input);
		}),
});
