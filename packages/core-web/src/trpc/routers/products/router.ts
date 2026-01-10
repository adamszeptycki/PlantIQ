import {
	protectedProcedureWithOrganization,
	createTRPCRouter,
} from "@starter/core-web/src/trpc/trpc";
import { z } from "zod";
import * as productFunctions from "./functions";
import { CreateProductSchema, ListProductsSchema, UpdateProductSchema } from "./schema";

export const productsRouter = createTRPCRouter({
	create: protectedProcedureWithOrganization
		.input(CreateProductSchema)
		.mutation(async ({ ctx, input }) => {
			return productFunctions.createProduct(ctx, input);
		}),

	update: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
			}).merge(UpdateProductSchema),
		)
		.mutation(async ({ ctx, input }) => {
			return productFunctions.updateProduct(ctx, input);
		}),

	delete: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return productFunctions.deleteProduct(ctx, input);
		}),

	list: protectedProcedureWithOrganization
		.input(ListProductsSchema)
		.query(async ({ ctx, input }) => {
			return productFunctions.listProducts(ctx, input);
		}),

	get: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.query(async ({ ctx, input }) => {
			return productFunctions.getProduct(ctx, input);
		}),
});
