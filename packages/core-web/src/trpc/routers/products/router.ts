import {
	plannerProcedure,
	createTRPCRouter,
} from "@plantiq/core-web/src/trpc/trpc";
import { z } from "zod";
import * as productFunctions from "./functions";
import { CreateProductSchema, ListProductsSchema, UpdateProductSchema } from "./schema";

export const productsRouter = createTRPCRouter({
	create: plannerProcedure
		.input(CreateProductSchema)
		.mutation(async ({ ctx, input }) => {
			return productFunctions.createProduct(ctx, input);
		}),

	update: plannerProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}).merge(UpdateProductSchema),
		)
		.mutation(async ({ ctx, input }) => {
			return productFunctions.updateProduct(ctx, input);
		}),

	delete: plannerProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return productFunctions.deleteProduct(ctx, input);
		}),

	list: plannerProcedure
		.input(ListProductsSchema)
		.query(async ({ ctx, input }) => {
			return productFunctions.listProducts(ctx, input);
		}),

	get: plannerProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.query(async ({ ctx, input }) => {
			return productFunctions.getProduct(ctx, input);
		}),
});
