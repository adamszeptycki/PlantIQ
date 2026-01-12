import { defaultFields } from "@plantiq/core/src/sql/utils";
import { boolean, integer, numeric, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { productTypeEnum } from "./enums";
import { organizations } from "./auth";

// Products
export const products = pgTable("products", {
	...defaultFields,
	organizationId: uuid("organization_id")
		.notNull()
		.references(() => organizations.id, { onDelete: "cascade" }),
	sku: text("sku").notNull(),
	name: text("name").notNull(),
	description: text("description"),
	productType: productTypeEnum("product_type").default("storable").notNull(),
	uom: text("uom").default("unit").notNull(), // Unit of Measure
	listPrice: numeric("list_price", { precision: 12, scale: 2 }),
	cost: numeric("cost", { precision: 12, scale: 2 }),
	canBeSold: boolean("can_be_sold").default(true),
	canBePurchased: boolean("can_be_purchased").default(true),
	canBeManufactured: boolean("can_be_manufactured").default(false),
	leadTime: integer("lead_time").default(0), // days
	reorderPoint: numeric("reorder_point", { precision: 10, scale: 2 }),
	reorderQuantity: numeric("reorder_quantity", { precision: 10, scale: 2 }),
	image: text("image"),
	isActive: boolean("is_active").default(true),
});

export const ProductSchema = createSelectSchema(products);
export const InsertProductSchema = createInsertSchema(products).omit({
	id: true,
});
export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
