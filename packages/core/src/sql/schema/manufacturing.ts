import { defaultFields } from "@plantiq/core/src/sql/utils";
import { boolean, date, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { bomTypeEnum, moStatusEnum, workOrderStatusEnum } from "./enums";
import { organizations } from "./auth";
import { products } from "./products";
import { users } from "./auth";

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

// Manufacturing Orders (MO)
export const manufacturingOrders = pgTable("manufacturing_orders", {
	...defaultFields,
	organizationId: uuid("organization_id")
		.notNull()
		.references(() => organizations.id, { onDelete: "cascade" }),
	productId: uuid("product_id")
		.notNull()
		.references(() => products.id, { onDelete: "cascade" }),
	bomId: uuid("bom_id").references(() => boms.id, { onDelete: "set null" }),
	moNumber: text("mo_number").notNull(),
	status: moStatusEnum("status").default("draft").notNull(),
	quantityToProduce: numeric("quantity_to_produce", { precision: 10, scale: 2 }).notNull(),
	quantityProduced: numeric("quantity_produced", { precision: 10, scale: 2 }).default("0").notNull(),
	scheduledStartDate: date("scheduled_start_date"),
	scheduledEndDate: date("scheduled_end_date"),
	actualStartDate: date("actual_start_date"),
	actualEndDate: date("actual_end_date"),
	responsiblePerson: uuid("responsible_person").references(() => users.id, { onDelete: "set null" }),
	notes: text("notes"),
});

export const ManufacturingOrderSchema = createSelectSchema(manufacturingOrders);
export const InsertManufacturingOrderSchema = createInsertSchema(manufacturingOrders).omit({
	id: true,
});
export type ManufacturingOrder = typeof manufacturingOrders.$inferSelect;
export type InsertManufacturingOrder = typeof manufacturingOrders.$inferInsert;

// Work Orders (Operations within a Manufacturing Order)
export const workOrders = pgTable("work_orders", {
	...defaultFields,
	organizationId: uuid("organization_id")
		.notNull()
		.references(() => organizations.id, { onDelete: "cascade" }),
	manufacturingOrderId: uuid("manufacturing_order_id")
		.notNull()
		.references(() => manufacturingOrders.id, { onDelete: "cascade" }),
	woNumber: text("wo_number").notNull(),
	name: text("name").notNull(),
	description: text("description"),
	status: workOrderStatusEnum("status").default("pending").notNull(),
	assignedTo: uuid("assigned_to").references(() => users.id, { onDelete: "set null" }),
	sequence: numeric("sequence", { precision: 5, scale: 0 }).default("0"),
	estimatedDuration: numeric("estimated_duration", { precision: 8, scale: 2 }),
	actualDuration: numeric("actual_duration", { precision: 8, scale: 2 }),
	startedAt: timestamp("started_at"),
	completedAt: timestamp("completed_at"),
	notes: text("notes"),
});

export const WorkOrderSchema = createSelectSchema(workOrders);
export const InsertWorkOrderSchema = createInsertSchema(workOrders).omit({
	id: true,
});
export type WorkOrder = typeof workOrders.$inferSelect;
export type InsertWorkOrder = typeof workOrders.$inferInsert;

// Time Entries (Labor tracking)
export const timeEntries = pgTable("time_entries", {
	...defaultFields,
	organizationId: uuid("organization_id")
		.notNull()
		.references(() => organizations.id, { onDelete: "cascade" }),
	workOrderId: uuid("work_order_id")
		.notNull()
		.references(() => workOrders.id, { onDelete: "cascade" }),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	startTime: timestamp("start_time").notNull(),
	endTime: timestamp("end_time"),
	duration: numeric("duration", { precision: 8, scale: 2 }),
	notes: text("notes"),
});

export const TimeEntrySchema = createSelectSchema(timeEntries);
export const InsertTimeEntrySchema = createInsertSchema(timeEntries).omit({
	id: true,
});
export type TimeEntry = typeof timeEntries.$inferSelect;
export type InsertTimeEntry = typeof timeEntries.$inferInsert;
