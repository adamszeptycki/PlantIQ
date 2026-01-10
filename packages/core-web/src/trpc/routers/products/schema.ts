import { z } from "zod";

export const CreateProductSchema = z.object({
	sku: z.string().min(1, "SKU is required"),
	name: z.string().min(1, "Name is required"),
	description: z.string().nullable().optional(),
	productType: z.enum(["storable", "consumable", "service"]).default("storable"),
	uom: z.string().default("unit"),
	listPrice: z.string().nullable().optional(),
	cost: z.string().nullable().optional(),
	canBeSold: z.boolean().default(true),
	canBePurchased: z.boolean().default(true),
	canBeManufactured: z.boolean().default(false),
	leadTime: z.number().int().default(0),
	reorderPoint: z.string().nullable().optional(),
	reorderQuantity: z.string().nullable().optional(),
	image: z.string().nullable().optional(),
	isActive: z.boolean().default(true),
});

export const UpdateProductSchema = CreateProductSchema.partial();

export const ListProductsSchema = z.object({
	search: z.string().nullable().optional(),
	productType: z.string().nullable().optional(),
	limit: z.number().int().min(1).max(100).default(50),
	offset: z.number().int().min(0).default(0),
});

export type CreateProductArgs = z.infer<typeof CreateProductSchema>;
export type UpdateProductArgs = z.infer<typeof UpdateProductSchema>;
export type ListProductsArgs = z.infer<typeof ListProductsSchema>;
