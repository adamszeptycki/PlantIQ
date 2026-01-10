import { z } from "zod";

export const CreateLocationSchema = z.object({
	name: z.string().min(1, "Name is required"),
	code: z.string().min(1, "Code is required"),
	locationType: z.enum(["internal", "customer", "supplier", "transit"]).default("internal"),
	parentLocationId: z.string().uuid().nullable().optional(),
	isActive: z.boolean().default(true),
});

export const UpdateLocationSchema = CreateLocationSchema.partial();

export const CreateStockMoveSchema = z.object({
	productId: z.string().uuid(),
	moveType: z.enum(["in", "out", "internal", "adjustment", "production"]),
	fromLocationId: z.string().uuid().nullable().optional(),
	toLocationId: z.string().uuid().nullable().optional(),
	quantity: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid quantity format"),
	lotNumber: z.string().nullable().optional(),
	referenceType: z.string().nullable().optional(),
	referenceId: z.string().uuid().nullable().optional(),
	notes: z.string().nullable().optional(),
});

export const AdjustStockSchema = z.object({
	productId: z.string().uuid(),
	locationId: z.string().uuid(),
	newQuantity: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid quantity format"),
	notes: z.string().nullable().optional(),
	lotNumber: z.string().nullable().optional(),
});

export const ListStockMovesSchema = z.object({
	productId: z.string().uuid().nullable().optional(),
	locationId: z.string().uuid().nullable().optional(),
	limit: z.number().int().min(1).max(100).default(50),
	offset: z.number().int().min(0).default(0),
});

export type CreateLocationArgs = z.infer<typeof CreateLocationSchema>;
export type UpdateLocationArgs = z.infer<typeof UpdateLocationSchema>;
export type CreateStockMoveArgs = z.infer<typeof CreateStockMoveSchema>;
export type AdjustStockArgs = z.infer<typeof AdjustStockSchema>;
export type ListStockMovesArgs = z.infer<typeof ListStockMovesSchema>;
