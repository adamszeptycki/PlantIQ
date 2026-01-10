import {
	protectedProcedureWithOrganization,
	createTRPCRouter,
} from "@starter/core-web/src/trpc/trpc";
import { z } from "zod";
import * as inventoryFunctions from "./functions";
import {
	AdjustStockSchema,
	CreateLocationSchema,
	CreateStockMoveSchema,
	ListStockMovesSchema,
	UpdateLocationSchema,
} from "./schema";

export const inventoryRouter = createTRPCRouter({
	// Locations
	createLocation: protectedProcedureWithOrganization
		.input(CreateLocationSchema)
		.mutation(async ({ ctx, input }) => {
			return inventoryFunctions.createLocation(ctx, input);
		}),

	updateLocation: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
			}).merge(UpdateLocationSchema),
		)
		.mutation(async ({ ctx, input }) => {
			return inventoryFunctions.updateLocation(ctx, input);
		}),

	listLocations: protectedProcedureWithOrganization.query(async ({ ctx }) => {
		return inventoryFunctions.listLocations(ctx);
	}),

	getLocation: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.query(async ({ ctx, input }) => {
			return inventoryFunctions.getLocation(ctx, input);
		}),

	// Stock
	listStock: protectedProcedureWithOrganization.query(async ({ ctx }) => {
		return inventoryFunctions.listStock(ctx);
	}),

	getStockByProduct: protectedProcedureWithOrganization
		.input(
			z.object({
				productId: z.string().uuid(),
			}),
		)
		.query(async ({ ctx, input }) => {
			return inventoryFunctions.getStockByProduct(ctx, input);
		}),

	// Stock Moves
	createStockMove: protectedProcedureWithOrganization
		.input(CreateStockMoveSchema)
		.mutation(async ({ ctx, input }) => {
			return inventoryFunctions.createStockMove(ctx, input);
		}),

	adjustStock: protectedProcedureWithOrganization
		.input(AdjustStockSchema)
		.mutation(async ({ ctx, input }) => {
			return inventoryFunctions.adjustStock(ctx, input);
		}),

	listStockMoves: protectedProcedureWithOrganization
		.input(ListStockMovesSchema)
		.query(async ({ ctx, input }) => {
			return inventoryFunctions.listStockMoves(ctx, input);
		}),
});
