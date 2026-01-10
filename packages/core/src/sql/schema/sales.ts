import { defaultFields } from "@starter/core/src/sql/utils";
import { numeric, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { leadStatusEnum } from "./enums";
import { organizations } from "./auth";
import { users } from "./auth";

// Customers
export const customers = pgTable("customers", {
	...defaultFields,
	organizationId: uuid("organization_id")
		.notNull()
		.references(() => organizations.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	email: text("email"),
	phone: text("phone"),
	address: text("address"),
	city: text("city"),
	state: text("state"),
	zipCode: text("zip_code"),
	country: text("country"),
	taxId: text("tax_id"),
	creditLimit: numeric("credit_limit", { precision: 12, scale: 2 }),
	notes: text("notes"),
});

export const CustomerSchema = createSelectSchema(customers);
export const InsertCustomerSchema = createInsertSchema(customers).omit({
	id: true,
});
export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = typeof customers.$inferInsert;

// Leads (CRM)
export const leads = pgTable("leads", {
	...defaultFields,
	organizationId: uuid("organization_id")
		.notNull()
		.references(() => organizations.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	company: text("company"),
	email: text("email"),
	phone: text("phone"),
	status: leadStatusEnum("status").default("new").notNull(),
	assignedTo: uuid("assigned_to").references(() => users.id, { onDelete: "set null" }),
	estimatedValue: numeric("estimated_value", { precision: 12, scale: 2 }),
	notes: text("notes"),
});

export const LeadSchema = createSelectSchema(leads);
export const InsertLeadSchema = createInsertSchema(leads).omit({
	id: true,
});
export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;
