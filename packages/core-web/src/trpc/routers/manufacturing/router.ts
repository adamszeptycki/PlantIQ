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
	CreateWorkOrderSchema,
	CreateTimeEntrySchema,
	ListBomsSchema,
	ListManufacturingOrdersSchema,
	ListWorkOrdersSchema,
	UpdateBomLineItemSchema,
	UpdateBomSchema,
	UpdateManufacturingOrderSchema,
	UpdateWorkOrderSchema,
	UpdateTimeEntrySchema,
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

	// Work Orders
	createWorkOrder: protectedProcedureWithOrganization
		.input(CreateWorkOrderSchema)
		.mutation(async ({ ctx, input }) => {
			return manufacturingFunctions.createWorkOrder(ctx, input);
		}),

	updateWorkOrder: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
			}).merge(UpdateWorkOrderSchema),
		)
		.mutation(async ({ ctx, input }) => {
			return manufacturingFunctions.updateWorkOrder(ctx, input);
		}),

	deleteWorkOrder: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return manufacturingFunctions.deleteWorkOrder(ctx, input);
		}),

	listWorkOrders: protectedProcedureWithOrganization
		.input(ListWorkOrdersSchema)
		.query(async ({ ctx, input }) => {
			return manufacturingFunctions.listWorkOrders(ctx, input);
		}),

	getWorkOrder: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.query(async ({ ctx, input }) => {
			return manufacturingFunctions.getWorkOrder(ctx, input);
		}),

	updateWorkOrderStatus: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
				status: z.enum(["pending", "in_progress", "completed", "cancelled"]),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return manufacturingFunctions.updateWorkOrderStatus(ctx, input);
		}),

	// Time Entries
	createTimeEntry: protectedProcedureWithOrganization
		.input(CreateTimeEntrySchema)
		.mutation(async ({ ctx, input }) => {
			return manufacturingFunctions.createTimeEntry(ctx, input);
		}),

	updateTimeEntry: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
			}).merge(UpdateTimeEntrySchema),
		)
		.mutation(async ({ ctx, input }) => {
			return manufacturingFunctions.updateTimeEntry(ctx, input);
		}),

	deleteTimeEntry: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return manufacturingFunctions.deleteTimeEntry(ctx, input);
		}),

	getWorkOrderTimeEntries: protectedProcedureWithOrganization
		.input(
			z.object({
				workOrderId: z.string().uuid(),
			}),
		)
		.query(async ({ ctx, input }) => {
			return manufacturingFunctions.getWorkOrderTimeEntries(ctx, input);
		}),
});
