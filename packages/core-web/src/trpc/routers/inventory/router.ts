import {
	plannerProcedure,
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
	createLocation: plannerProcedure
		.input(CreateLocationSchema)
		.mutation(async ({ ctx, input }) => {
			return inventoryFunctions.createLocation(ctx, input);
		}),

	updateLocation: plannerProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}).merge(UpdateLocationSchema),
		)
		.mutation(async ({ ctx, input }) => {
			return inventoryFunctions.updateLocation(ctx, input);
		}),

	listLocations: plannerProcedure.query(async ({ ctx }) => {
		return inventoryFunctions.listLocations(ctx);
	}),

	getLocation: plannerProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.query(async ({ ctx, input }) => {
			return inventoryFunctions.getLocation(ctx, input);
		}),

	// Stock
	listStock: plannerProcedure.query(async ({ ctx }) => {
		return inventoryFunctions.listStock(ctx);
	}),

	getStockByProduct: plannerProcedure
		.input(
			z.object({
				productId: z.string().uuid(),
			}),
		)
		.query(async ({ ctx, input }) => {
			return inventoryFunctions.getStockByProduct(ctx, input);
		}),

	// Stock Moves
	createStockMove: plannerProcedure
		.input(CreateStockMoveSchema)
		.mutation(async ({ ctx, input }) => {
			return inventoryFunctions.createStockMove(ctx, input);
		}),

	adjustStock: plannerProcedure
		.input(AdjustStockSchema)
		.mutation(async ({ ctx, input }) => {
			return inventoryFunctions.adjustStock(ctx, input);
		}),

	listStockMoves: plannerProcedure
		.input(ListStockMovesSchema)
		.query(async ({ ctx, input }) => {
			return inventoryFunctions.listStockMoves(ctx, input);
		}),
});
