import { defaultFields } from "@starter/core/src/sql/utils";
import { boolean, date, numeric, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { poStatusEnum } from "./enums";
import { organizations } from "./auth";
import { products } from "./products";

// Vendors
export const vendors = pgTable("vendors", {
	...defaultFields,
	organizationId: uuid("organization_id")
		.notNull()
		.references(() => organizations.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	code: text("code"),
	email: text("email"),
	phone: text("phone"),
	website: text("website"),
	contactPerson: text("contact_person"),
	address: text("address"),
	city: text("city"),
	state: text("state"),
	zipCode: text("zip_code"),
	country: text("country"),
	taxId: text("tax_id"),
	paymentTerms: text("payment_terms"),
	notes: text("notes"),
	isActive: boolean("is_active").default(true),
});

export const VendorSchema = createSelectSchema(vendors);
export const InsertVendorSchema = createInsertSchema(vendors).omit({
	id: true,
});
export type Vendor = typeof vendors.$inferSelect;
export type InsertVendor = typeof vendors.$inferInsert;

// Product Vendors (linking products to vendors with pricing)
export const productVendors = pgTable("product_vendors", {
	...defaultFields,
	organizationId: uuid("organization_id")
		.notNull()
		.references(() => organizations.id, { onDelete: "cascade" }),
	productId: uuid("product_id")
		.notNull()
		.references(() => products.id, { onDelete: "cascade" }),
	vendorId: uuid("vendor_id")
		.notNull()
		.references(() => vendors.id, { onDelete: "cascade" }),
	vendorSku: text("vendor_sku"),
	price: numeric("price", { precision: 12, scale: 2 }).notNull(),
	currency: text("currency").default("USD"),
	leadTime: numeric("lead_time", { precision: 5, scale: 0 }),
	minimumOrderQuantity: numeric("minimum_order_quantity", { precision: 10, scale: 2 }),
	isPreferred: boolean("is_preferred").default(false),
	notes: text("notes"),
});

export const ProductVendorSchema = createSelectSchema(productVendors);
export const InsertProductVendorSchema = createInsertSchema(productVendors).omit({
	id: true,
});
export type ProductVendor = typeof productVendors.$inferSelect;
export type InsertProductVendor = typeof productVendors.$inferInsert;

// Purchase Orders
export const purchaseOrders = pgTable("purchase_orders", {
	...defaultFields,
	organizationId: uuid("organization_id")
		.notNull()
		.references(() => organizations.id, { onDelete: "cascade" }),
	vendorId: uuid("vendor_id")
		.notNull()
		.references(() => vendors.id, { onDelete: "cascade" }),
	poNumber: text("po_number").notNull(),
	status: poStatusEnum("status").default("draft").notNull(),
	orderDate: date("order_date").notNull(),
	expectedDate: date("expected_date"),
	receivedDate: date("received_date"),
	subtotal: numeric("subtotal", { precision: 12, scale: 2 }).default("0").notNull(),
	taxAmount: numeric("tax_amount", { precision: 12, scale: 2 }).default("0").notNull(),
	shippingCost: numeric("shipping_cost", { precision: 12, scale: 2 }).default("0").notNull(),
	total: numeric("total", { precision: 12, scale: 2 }).default("0").notNull(),
	paymentTerms: text("payment_terms"),
	deliveryAddress: text("delivery_address"),
	notes: text("notes"),
});

export const PurchaseOrderSchema = createSelectSchema(purchaseOrders);
export const InsertPurchaseOrderSchema = createInsertSchema(purchaseOrders).omit({
	id: true,
});
export type PurchaseOrder = typeof purchaseOrders.$inferSelect;
export type InsertPurchaseOrder = typeof purchaseOrders.$inferInsert;

// Purchase Order Line Items
export const purchaseOrderLineItems = pgTable("purchase_order_line_items", {
	...defaultFields,
	organizationId: uuid("organization_id")
		.notNull()
		.references(() => organizations.id, { onDelete: "cascade" }),
	purchaseOrderId: uuid("purchase_order_id")
		.notNull()
		.references(() => purchaseOrders.id, { onDelete: "cascade" }),
	productId: uuid("product_id")
		.notNull()
		.references(() => products.id, { onDelete: "cascade" }),
	quantity: numeric("quantity", { precision: 10, scale: 2 }).notNull(),
	unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
	discount: numeric("discount", { precision: 5, scale: 2 }).default("0"),
	lineTotal: numeric("line_total", { precision: 12, scale: 2 }).notNull(),
	quantityReceived: numeric("quantity_received", { precision: 10, scale: 2 }).default("0"),
	notes: text("notes"),
});

export const PurchaseOrderLineItemSchema = createSelectSchema(purchaseOrderLineItems);
export const InsertPurchaseOrderLineItemSchema = createInsertSchema(purchaseOrderLineItems).omit({
	id: true,
});
export type PurchaseOrderLineItem = typeof purchaseOrderLineItems.$inferSelect;
export type InsertPurchaseOrderLineItem = typeof purchaseOrderLineItems.$inferInsert;
