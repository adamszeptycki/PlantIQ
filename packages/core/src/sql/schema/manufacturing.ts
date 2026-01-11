import { defaultFields } from "@starter/core/src/sql/utils";
import { boolean, numeric, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { bomTypeEnum } from "./enums";
import { organizations } from "./auth";
import { products } from "./products";

// Bills of Materials (BOM)
export const boms = pgTable("boms", {
	...defaultFields,
	organizationId: uuid("organization_id")
		.notNull()
		.references(() => organizations.id, { onDelete: "cascade" }),
	productId: uuid("product_id")
		.notNull()
		.references(() => products.id, { onDelete: "cascade" }),
	bomType: bomTypeEnum("bom_type").default("manufacturing").notNull(),
	quantity: numeric("quantity", { precision: 10, scale: 2 }).default("1").notNull(),
	isActive: boolean("is_active").default(true),
	notes: text("notes"),
});

export const BomSchema = createSelectSchema(boms);
export const InsertBomSchema = createInsertSchema(boms).omit({
	id: true,
});
export type Bom = typeof boms.$inferSelect;
export type InsertBom = typeof boms.$inferInsert;

// BOM Line Items (Components)
export const bomLineItems = pgTable("bom_line_items", {
	...defaultFields,
	organizationId: uuid("organization_id")
		.notNull()
		.references(() => organizations.id, { onDelete: "cascade" }),
	bomId: uuid("bom_id")
		.notNull()
		.references(() => boms.id, { onDelete: "cascade" }),
	componentId: uuid("component_id")
		.notNull()
		.references(() => products.id, { onDelete: "cascade" }),
	quantity: numeric("quantity", { precision: 10, scale: 2 }).notNull(),
	scrapPercent: numeric("scrap_percent", { precision: 5, scale: 2 }).default("0"),
	notes: text("notes"),
});

export const BomLineItemSchema = createSelectSchema(bomLineItems);
export const InsertBomLineItemSchema = createInsertSchema(bomLineItems).omit({
	id: true,
});
export type BomLineItem = typeof bomLineItems.$inferSelect;
export type InsertBomLineItem = typeof bomLineItems.$inferInsert;
