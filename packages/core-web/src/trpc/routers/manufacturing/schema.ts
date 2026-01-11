import { z } from "zod";

// BOMs
export const CreateBomSchema = z.object({
	productId: z.string().uuid(),
	bomType: z.enum(["manufacturing", "kit", "phantom"]).default("manufacturing"),
	quantity: z.string().default("1"),
	isActive: z.boolean().default(true),
	notes: z.string().nullable().optional(),
});

export const UpdateBomSchema = CreateBomSchema.partial();

export const ListBomsSchema = z.object({
	productId: z.string().uuid().nullable().optional(),
	limit: z.number().int().min(1).max(100).default(50),
	offset: z.number().int().min(0).default(0),
});

export const CreateBomLineItemSchema = z.object({
	bomId: z.string().uuid(),
	componentId: z.string().uuid(),
	quantity: z.string().min(1, "Quantity is required"),
	scrapPercent: z.string().default("0"),
	notes: z.string().nullable().optional(),
});

export const UpdateBomLineItemSchema = CreateBomLineItemSchema.partial();

export type CreateBomArgs = z.infer<typeof CreateBomSchema>;
export type UpdateBomArgs = z.infer<typeof UpdateBomSchema>;
export type ListBomsArgs = z.infer<typeof ListBomsSchema>;
export type CreateBomLineItemArgs = z.infer<typeof CreateBomLineItemSchema>;
export type UpdateBomLineItemArgs = z.infer<typeof UpdateBomLineItemSchema>;

// Manufacturing Orders
export const CreateManufacturingOrderSchema = z.object({
	productId: z.string().uuid(),
	bomId: z.string().uuid().nullable().optional(),
	moNumber: z.string().min(1, "MO number is required"),
	status: z.enum(["draft", "confirmed", "in_progress", "done", "cancelled"]).default("draft"),
	quantityToProduce: z.string().min(1, "Quantity is required"),
	scheduledStartDate: z.string().nullable().optional(),
	scheduledEndDate: z.string().nullable().optional(),
	actualStartDate: z.string().nullable().optional(),
	actualEndDate: z.string().nullable().optional(),
	responsiblePerson: z.string().uuid().nullable().optional(),
	notes: z.string().nullable().optional(),
});

export const UpdateManufacturingOrderSchema = CreateManufacturingOrderSchema.partial();

export const ListManufacturingOrdersSchema = z.object({
	productId: z.string().uuid().nullable().optional(),
	status: z.string().nullable().optional(),
	limit: z.number().int().min(1).max(100).default(50),
	offset: z.number().int().min(0).default(0),
});

export type CreateManufacturingOrderArgs = z.infer<typeof CreateManufacturingOrderSchema>;
export type UpdateManufacturingOrderArgs = z.infer<typeof UpdateManufacturingOrderSchema>;
export type ListManufacturingOrdersArgs = z.infer<typeof ListManufacturingOrdersSchema>;
