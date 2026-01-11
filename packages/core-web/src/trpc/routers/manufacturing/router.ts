import {
	supervisorProcedure,
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
	createBom: supervisorProcedure
		.input(CreateBomSchema)
		.mutation(async ({ ctx, input }) => {
			return manufacturingFunctions.createBom(ctx, input);
		}),

	updateBom: supervisorProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}).merge(UpdateBomSchema),
		)
		.mutation(async ({ ctx, input }) => {
			return manufacturingFunctions.updateBom(ctx, input);
		}),

	deleteBom: supervisorProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return manufacturingFunctions.deleteBom(ctx, input);
		}),

	listBoms: supervisorProcedure
		.input(ListBomsSchema)
		.query(async ({ ctx, input }) => {
			return manufacturingFunctions.listBoms(ctx, input);
		}),

	getBom: supervisorProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.query(async ({ ctx, input }) => {
			return manufacturingFunctions.getBom(ctx, input);
		}),

	getBomLineItems: supervisorProcedure
		.input(
			z.object({
				bomId: z.string().uuid(),
			}),
		)
		.query(async ({ ctx, input }) => {
			return manufacturingFunctions.getBomLineItems(ctx, input);
		}),

	addBomLineItem: supervisorProcedure
		.input(CreateBomLineItemSchema)
		.mutation(async ({ ctx, input }) => {
			return manufacturingFunctions.addBomLineItem(ctx, input);
		}),

	updateBomLineItem: supervisorProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}).merge(UpdateBomLineItemSchema),
		)
		.mutation(async ({ ctx, input }) => {
			return manufacturingFunctions.updateBomLineItem(ctx, input);
		}),

	deleteBomLineItem: supervisorProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return manufacturingFunctions.deleteBomLineItem(ctx, input);
		}),

	// Manufacturing Orders
	createManufacturingOrder: supervisorProcedure
		.input(CreateManufacturingOrderSchema)
		.mutation(async ({ ctx, input }) => {
			return manufacturingFunctions.createManufacturingOrder(ctx, input);
		}),

	updateManufacturingOrder: supervisorProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}).merge(UpdateManufacturingOrderSchema),
		)
		.mutation(async ({ ctx, input }) => {
			return manufacturingFunctions.updateManufacturingOrder(ctx, input);
		}),

	deleteManufacturingOrder: supervisorProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return manufacturingFunctions.deleteManufacturingOrder(ctx, input);
		}),

	listManufacturingOrders: supervisorProcedure
		.input(ListManufacturingOrdersSchema)
		.query(async ({ ctx, input }) => {
			return manufacturingFunctions.listManufacturingOrders(ctx, input);
		}),

	getManufacturingOrder: supervisorProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.query(async ({ ctx, input }) => {
			return manufacturingFunctions.getManufacturingOrder(ctx, input);
		}),

	updateManufacturingOrderStatus: supervisorProcedure
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
	createWorkOrder: supervisorProcedure
		.input(CreateWorkOrderSchema)
		.mutation(async ({ ctx, input }) => {
			return manufacturingFunctions.createWorkOrder(ctx, input);
		}),

	updateWorkOrder: supervisorProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}).merge(UpdateWorkOrderSchema),
		)
		.mutation(async ({ ctx, input }) => {
			return manufacturingFunctions.updateWorkOrder(ctx, input);
		}),

	deleteWorkOrder: supervisorProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return manufacturingFunctions.deleteWorkOrder(ctx, input);
		}),

	listWorkOrders: supervisorProcedure
		.input(ListWorkOrdersSchema)
		.query(async ({ ctx, input }) => {
			return manufacturingFunctions.listWorkOrders(ctx, input);
		}),

	getWorkOrder: supervisorProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.query(async ({ ctx, input }) => {
			return manufacturingFunctions.getWorkOrder(ctx, input);
		}),

	updateWorkOrderStatus: supervisorProcedure
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
	createTimeEntry: supervisorProcedure
		.input(CreateTimeEntrySchema)
		.mutation(async ({ ctx, input }) => {
			return manufacturingFunctions.createTimeEntry(ctx, input);
		}),

	updateTimeEntry: supervisorProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}).merge(UpdateTimeEntrySchema),
		)
		.mutation(async ({ ctx, input }) => {
			return manufacturingFunctions.updateTimeEntry(ctx, input);
		}),

	deleteTimeEntry: supervisorProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return manufacturingFunctions.deleteTimeEntry(ctx, input);
		}),

	getWorkOrderTimeEntries: supervisorProcedure
		.input(
			z.object({
				workOrderId: z.string().uuid(),
			}),
		)
		.query(async ({ ctx, input }) => {
			return manufacturingFunctions.getWorkOrderTimeEntries(ctx, input);
		}),
});
