import { z } from "zod";

// Vendors
export const CreateVendorSchema = z.object({
	name: z.string().min(1, "Name is required"),
	code: z.string().nullable().optional(),
	email: z.string().email().nullable().optional(),
	phone: z.string().nullable().optional(),
	website: z.string().url().nullable().optional(),
	contactPerson: z.string().nullable().optional(),
	address: z.string().nullable().optional(),
	city: z.string().nullable().optional(),
	state: z.string().nullable().optional(),
	zipCode: z.string().nullable().optional(),
	country: z.string().nullable().optional(),
	taxId: z.string().nullable().optional(),
	paymentTerms: z.string().nullable().optional(),
	notes: z.string().nullable().optional(),
	isActive: z.boolean().default(true),
});

export const UpdateVendorSchema = CreateVendorSchema.partial();

export const ListVendorsSchema = z.object({
	search: z.string().nullable().optional(),
	isActive: z.boolean().nullable().optional(),
	limit: z.number().int().min(1).max(100).default(50),
	offset: z.number().int().min(0).default(0),
});

export type CreateVendorArgs = z.infer<typeof CreateVendorSchema>;
export type UpdateVendorArgs = z.infer<typeof UpdateVendorSchema>;
export type ListVendorsArgs = z.infer<typeof ListVendorsSchema>;

// Product Vendors
export const CreateProductVendorSchema = z.object({
	productId: z.string().uuid(),
	vendorId: z.string().uuid(),
	vendorSku: z.string().nullable().optional(),
	price: z.string().min(1, "Price is required"),
	currency: z.string().default("USD"),
	leadTime: z.string().nullable().optional(),
	minimumOrderQuantity: z.string().nullable().optional(),
	isPreferred: z.boolean().default(false),
	notes: z.string().nullable().optional(),
});

export const UpdateProductVendorSchema = CreateProductVendorSchema.partial();

export type CreateProductVendorArgs = z.infer<typeof CreateProductVendorSchema>;
export type UpdateProductVendorArgs = z.infer<typeof UpdateProductVendorSchema>;

// Purchase Orders
export const CreatePurchaseOrderSchema = z.object({
	vendorId: z.string().uuid(),
	poNumber: z.string().min(1, "PO number is required"),
	status: z.enum(["draft", "sent", "confirmed", "received", "cancelled"]).default("draft"),
	orderDate: z.string().min(1, "Order date is required"),
	expectedDate: z.string().nullable().optional(),
	paymentTerms: z.string().nullable().optional(),
	deliveryAddress: z.string().nullable().optional(),
	taxAmount: z.string().default("0"),
	shippingCost: z.string().default("0"),
	notes: z.string().nullable().optional(),
});

export const UpdatePurchaseOrderSchema = CreatePurchaseOrderSchema.partial();

export const ListPurchaseOrdersSchema = z.object({
	vendorId: z.string().uuid().nullable().optional(),
	status: z.string().nullable().optional(),
	search: z.string().nullable().optional(),
	limit: z.number().int().min(1).max(100).default(50),
	offset: z.number().int().min(0).default(0),
});

export type CreatePurchaseOrderArgs = z.infer<typeof CreatePurchaseOrderSchema>;
export type UpdatePurchaseOrderArgs = z.infer<typeof UpdatePurchaseOrderSchema>;
export type ListPurchaseOrdersArgs = z.infer<typeof ListPurchaseOrdersSchema>;

// Purchase Order Line Items
export const CreatePurchaseOrderLineItemSchema = z.object({
	purchaseOrderId: z.string().uuid(),
	productId: z.string().uuid(),
	quantity: z.string().min(1, "Quantity is required"),
	unitPrice: z.string().min(1, "Unit price is required"),
	discount: z.string().default("0"),
	lineTotal: z.string().min(1, "Line total is required"),
	notes: z.string().nullable().optional(),
});

export const UpdatePurchaseOrderLineItemSchema = CreatePurchaseOrderLineItemSchema.partial();

export type CreatePurchaseOrderLineItemArgs = z.infer<typeof CreatePurchaseOrderLineItemSchema>;
export type UpdatePurchaseOrderLineItemArgs = z.infer<typeof UpdatePurchaseOrderLineItemSchema>;
