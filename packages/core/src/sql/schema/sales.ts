import { defaultFields } from "@starter/core/src/sql/utils";
import { date, integer, numeric, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { leadStatusEnum, quoteStatusEnum } from "./enums";
import { organizations } from "./auth";
import { users } from "./auth";
import { products } from "./products";

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

// Quotes
export const quotes = pgTable("quotes", {
	...defaultFields,
	organizationId: uuid("organization_id")
		.notNull()
		.references(() => organizations.id, { onDelete: "cascade" }),
	customerId: uuid("customer_id")
		.notNull()
		.references(() => customers.id, { onDelete: "cascade" }),
	quoteNumber: text("quote_number").notNull(),
	status: quoteStatusEnum("status").default("draft").notNull(),
	validUntil: date("valid_until"),
	subtotal: numeric("subtotal", { precision: 12, scale: 2 }).default("0").notNull(),
	taxAmount: numeric("tax_amount", { precision: 12, scale: 2 }).default("0"),
	total: numeric("total", { precision: 12, scale: 2 }).default("0").notNull(),
	terms: text("terms"),
	notes: text("notes"),
});

export const QuoteSchema = createSelectSchema(quotes);
export const InsertQuoteSchema = createInsertSchema(quotes).omit({
	id: true,
});
export type Quote = typeof quotes.$inferSelect;
export type InsertQuote = typeof quotes.$inferInsert;

// Quote Line Items
export const quoteLineItems = pgTable("quote_line_items", {
	...defaultFields,
	organizationId: uuid("organization_id")
		.notNull()
		.references(() => organizations.id, { onDelete: "cascade" }),
	quoteId: uuid("quote_id")
		.notNull()
		.references(() => quotes.id, { onDelete: "cascade" }),
	productId: uuid("product_id")
		.notNull()
		.references(() => products.id, { onDelete: "cascade" }),
	quantity: numeric("quantity", { precision: 10, scale: 2 }).notNull(),
	unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
	discount: numeric("discount", { precision: 5, scale: 2 }).default("0"),
	lineTotal: numeric("line_total", { precision: 12, scale: 2 }).notNull(),
	notes: text("notes"),
});

export const QuoteLineItemSchema = createSelectSchema(quoteLineItems);
export const InsertQuoteLineItemSchema = createInsertSchema(quoteLineItems).omit({
	id: true,
});
export type QuoteLineItem = typeof quoteLineItems.$inferSelect;
export type InsertQuoteLineItem = typeof quoteLineItems.$inferInsert;
