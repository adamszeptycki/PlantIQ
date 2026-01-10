import { defaultFields } from "@starter/core/src/sql/utils";
import { boolean, date, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { stockMoveTypeEnum } from "./enums";
import { organizations } from "./auth";
import { products } from "./products";
import { users } from "./auth";

// Locations
export const locations: any = pgTable("locations", {
	...defaultFields,
	organizationId: uuid("organization_id")
		.notNull()
		.references(() => organizations.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	code: text("code").notNull(),
	locationType: text("location_type").default("internal").notNull(), // internal, customer, supplier, transit
	parentLocationId: uuid("parent_location_id"),
	isActive: boolean("is_active").default(true),
});

export const LocationSchema = createSelectSchema(locations);
export const InsertLocationSchema = createInsertSchema(locations).omit({
	id: true,
});
export type Location = typeof locations.$inferSelect;
export type InsertLocation = typeof locations.$inferInsert;

// Stock (current inventory levels)
export const stock = pgTable("stock", {
	...defaultFields,
	organizationId: uuid("organization_id")
		.notNull()
		.references(() => organizations.id, { onDelete: "cascade" }),
	productId: uuid("product_id")
		.notNull()
		.references(() => products.id, { onDelete: "cascade" }),
	locationId: uuid("location_id")
		.notNull()
		.references(() => locations.id, { onDelete: "cascade" }),
	lotNumber: text("lot_number"),
	quantity: numeric("quantity", { precision: 10, scale: 2 }).default("0").notNull(),
	reservedQuantity: numeric("reserved_quantity", { precision: 10, scale: 2 }).default("0"),
});

export const StockSchema = createSelectSchema(stock);
export const InsertStockSchema = createInsertSchema(stock).omit({
	id: true,
});
export type Stock = typeof stock.$inferSelect;
export type InsertStock = typeof stock.$inferInsert;

// Stock Moves (transactions)
export const stockMoves = pgTable("stock_moves", {
	...defaultFields,
	organizationId: uuid("organization_id")
		.notNull()
		.references(() => organizations.id, { onDelete: "cascade" }),
	productId: uuid("product_id")
		.notNull()
		.references(() => products.id, { onDelete: "cascade" }),
	moveType: stockMoveTypeEnum("move_type").notNull(),
	fromLocationId: uuid("from_location_id").references(() => locations.id, { onDelete: "set null" }),
	toLocationId: uuid("to_location_id").references(() => locations.id, { onDelete: "set null" }),
	quantity: numeric("quantity", { precision: 10, scale: 2 }).notNull(),
	lotNumber: text("lot_number"),
	referenceType: text("reference_type"), // mo, so, po, adjustment
	referenceId: uuid("reference_id"),
	notes: text("notes"),
	completedAt: timestamp("completed_at"),
	completedBy: uuid("completed_by").references(() => users.id, { onDelete: "set null" }),
});

export const StockMoveSchema = createSelectSchema(stockMoves);
export const InsertStockMoveSchema = createInsertSchema(stockMoves).omit({
	id: true,
});
export type StockMove = typeof stockMoves.$inferSelect;
export type InsertStockMove = typeof stockMoves.$inferInsert;

// Batch/Lot tracking
export const lots = pgTable("lots", {
	...defaultFields,
	organizationId: uuid("organization_id")
		.notNull()
		.references(() => organizations.id, { onDelete: "cascade" }),
	productId: uuid("product_id")
		.notNull()
		.references(() => products.id, { onDelete: "cascade" }),
	lotNumber: text("lot_number").notNull().unique(),
	manufacturingDate: date("manufacturing_date"),
	expirationDate: date("expiration_date"),
	notes: text("notes"),
});

export const LotSchema = createSelectSchema(lots);
export const InsertLotSchema = createInsertSchema(lots).omit({
	id: true,
});
export type Lot = typeof lots.$inferSelect;
export type InsertLot = typeof lots.$inferInsert;
