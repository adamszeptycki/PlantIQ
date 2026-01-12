import { defaultFields } from "@plantiq/core/src/sql/utils";
import { boolean, date, numeric, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { accountTypeEnum, journalTypeEnum, invoiceStatusEnum } from "./enums";
import { organizations } from "./auth";
import { customers } from "./sales";
import { vendors } from "./purchasing";
import { salesOrders } from "./sales";
import { purchaseOrders } from "./purchasing";

// Chart of Accounts
export const chartOfAccounts = pgTable("chart_of_accounts", {
	...defaultFields,
	organizationId: uuid("organization_id")
		.notNull()
		.references(() => organizations.id, { onDelete: "cascade" }),
	code: text("code").notNull(),
	name: text("name").notNull(),
	accountType: accountTypeEnum("account_type").notNull(),
	parentId: uuid("parent_id"),
	currency: text("currency").default("USD"),
	balance: numeric("balance", { precision: 15, scale: 2 }).default("0").notNull(),
	isActive: boolean("is_active").default(true),
	description: text("description"),
});

export const AccountSchema = createSelectSchema(chartOfAccounts);
export const InsertAccountSchema = createInsertSchema(chartOfAccounts).omit({
	id: true,
});
export type Account = typeof chartOfAccounts.$inferSelect;
export type InsertAccount = typeof chartOfAccounts.$inferInsert;

// Journals
export const journals = pgTable("journals", {
	...defaultFields,
	organizationId: uuid("organization_id")
		.notNull()
		.references(() => organizations.id, { onDelete: "cascade" }),
	code: text("code").notNull(),
	name: text("name").notNull(),
	journalType: journalTypeEnum("journal_type").notNull(),
	description: text("description"),
});

export const JournalSchema = createSelectSchema(journals);
export const InsertJournalSchema = createInsertSchema(journals).omit({
	id: true,
});
export type Journal = typeof journals.$inferSelect;
export type InsertJournal = typeof journals.$inferInsert;

// Journal Entries
export const journalEntries = pgTable("journal_entries", {
	...defaultFields,
	organizationId: uuid("organization_id")
		.notNull()
		.references(() => organizations.id, { onDelete: "cascade" }),
	journalId: uuid("journal_id")
		.notNull()
		.references(() => journals.id, { onDelete: "cascade" }),
	entryNumber: text("entry_number").notNull(),
	entryDate: date("entry_date").notNull(),
	reference: text("reference"),
	notes: text("notes"),
	isPosted: boolean("is_posted").default(false),
	postedAt: date("posted_at"),
});

export const JournalEntrySchema = createSelectSchema(journalEntries);
export const InsertJournalEntrySchema = createInsertSchema(journalEntries).omit({
	id: true,
});
export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = typeof journalEntries.$inferInsert;

// Journal Entry Lines
export const journalEntryLines = pgTable("journal_entry_lines", {
	...defaultFields,
	organizationId: uuid("organization_id")
		.notNull()
		.references(() => organizations.id, { onDelete: "cascade" }),
	journalEntryId: uuid("journal_entry_id")
		.notNull()
		.references(() => journalEntries.id, { onDelete: "cascade" }),
	accountId: uuid("account_id")
		.notNull()
		.references(() => chartOfAccounts.id, { onDelete: "cascade" }),
	debit: numeric("debit", { precision: 15, scale: 2 }).default("0").notNull(),
	credit: numeric("credit", { precision: 15, scale: 2 }).default("0").notNull(),
	description: text("description"),
});

export const JournalEntryLineSchema = createSelectSchema(journalEntryLines);
export const InsertJournalEntryLineSchema = createInsertSchema(journalEntryLines).omit({
	id: true,
});
export type JournalEntryLine = typeof journalEntryLines.$inferSelect;
export type InsertJournalEntryLine = typeof journalEntryLines.$inferInsert;

// Invoices (Customer Invoices and Vendor Bills)
export const invoices = pgTable("invoices", {
	...defaultFields,
	organizationId: uuid("organization_id")
		.notNull()
		.references(() => organizations.id, { onDelete: "cascade" }),
	invoiceNumber: text("invoice_number").notNull(),
	invoiceType: text("invoice_type").notNull(), // "customer" or "vendor"
	customerId: uuid("customer_id").references(() => customers.id, { onDelete: "set null" }),
	vendorId: uuid("vendor_id").references(() => vendors.id, { onDelete: "set null" }),
	salesOrderId: uuid("sales_order_id").references(() => salesOrders.id, { onDelete: "set null" }),
	purchaseOrderId: uuid("purchase_order_id").references(() => purchaseOrders.id, { onDelete: "set null" }),
	status: invoiceStatusEnum("status").default("draft").notNull(),
	invoiceDate: date("invoice_date").notNull(),
	dueDate: date("due_date"),
	paidDate: date("paid_date"),
	subtotal: numeric("subtotal", { precision: 12, scale: 2 }).default("0").notNull(),
	taxAmount: numeric("tax_amount", { precision: 12, scale: 2 }).default("0").notNull(),
	total: numeric("total", { precision: 12, scale: 2 }).default("0").notNull(),
	amountPaid: numeric("amount_paid", { precision: 12, scale: 2 }).default("0").notNull(),
	journalEntryId: uuid("journal_entry_id").references(() => journalEntries.id, { onDelete: "set null" }),
	notes: text("notes"),
});

export const InvoiceSchema = createSelectSchema(invoices);
export const InsertInvoiceSchema = createInsertSchema(invoices).omit({
	id: true,
});
export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = typeof invoices.$inferInsert;
