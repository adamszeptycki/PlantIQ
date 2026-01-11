import {
	protectedProcedureWithOrganization,
	createTRPCRouter,
} from "@starter/core-web/src/trpc/trpc";
import { z } from "zod";
import * as manufacturingFunctions from "./functions";
import {
	CreateBomLineItemSchema,
	CreateBomSchema,
	CreateManufacturingOrderSchema,
	ListBomsSchema,
	ListManufacturingOrdersSchema,
	UpdateBomLineItemSchema,
	UpdateBomSchema,
	UpdateManufacturingOrderSchema,
} from "./schema";

export const manufacturingRouter = createTRPCRouter({
	// BOMs
	createBom: protectedProcedureWithOrganization
		.input(CreateBomSchema)
		.mutation(async ({ ctx, input }) => {
			return manufacturingFunctions.createBom(ctx, input);
		}),

	updateBom: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
			}).merge(UpdateBomSchema),
		)
		.mutation(async ({ ctx, input }) => {
			return manufacturingFunctions.updateBom(ctx, input);
		}),

	deleteBom: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return manufacturingFunctions.deleteBom(ctx, input);
		}),

	listBoms: protectedProcedureWithOrganization
		.input(ListBomsSchema)
		.query(async ({ ctx, input }) => {
			return manufacturingFunctions.listBoms(ctx, input);
		}),

	getBom: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.query(async ({ ctx, input }) => {
			return manufacturingFunctions.getBom(ctx, input);
		}),

	getBomLineItems: protectedProcedureWithOrganization
		.input(
			z.object({
				bomId: z.string().uuid(),
			}),
		)
		.query(async ({ ctx, input }) => {
			return manufacturingFunctions.getBomLineItems(ctx, input);
		}),

	addBomLineItem: protectedProcedureWithOrganization
		.input(CreateBomLineItemSchema)
		.mutation(async ({ ctx, input }) => {
			return manufacturingFunctions.addBomLineItem(ctx, input);
		}),

	updateBomLineItem: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
			}).merge(UpdateBomLineItemSchema),
		)
		.mutation(async ({ ctx, input }) => {
			return manufacturingFunctions.updateBomLineItem(ctx, input);
		}),

	deleteBomLineItem: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return manufacturingFunctions.deleteBomLineItem(ctx, input);
		}),

	// Manufacturing Orders
	createManufacturingOrder: protectedProcedureWithOrganization
		.input(CreateManufacturingOrderSchema)
		.mutation(async ({ ctx, input }) => {
			return manufacturingFunctions.createManufacturingOrder(ctx, input);
		}),

	updateManufacturingOrder: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
			}).merge(UpdateManufacturingOrderSchema),
		)
		.mutation(async ({ ctx, input }) => {
			return manufacturingFunctions.updateManufacturingOrder(ctx, input);
		}),

	deleteManufacturingOrder: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return manufacturingFunctions.deleteManufacturingOrder(ctx, input);
		}),

	listManufacturingOrders: protectedProcedureWithOrganization
		.input(ListManufacturingOrdersSchema)
		.query(async ({ ctx, input }) => {
			return manufacturingFunctions.listManufacturingOrders(ctx, input);
		}),

	getManufacturingOrder: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.query(async ({ ctx, input }) => {
			return manufacturingFunctions.getManufacturingOrder(ctx, input);
		}),

	updateManufacturingOrderStatus: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
				status: z.enum(["draft", "confirmed", "in_progress", "done", "cancelled"]),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return manufacturingFunctions.updateManufacturingOrderStatus(ctx, input);
		}),
});
