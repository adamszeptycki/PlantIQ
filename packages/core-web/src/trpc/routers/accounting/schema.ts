import { z } from "zod";

// Chart of Accounts
export const CreateAccountSchema = z.object({
	code: z.string().min(1, "Code is required"),
	name: z.string().min(1, "Name is required"),
	accountType: z.enum(["asset", "liability", "equity", "revenue", "expense"]),
	parentId: z.string().uuid().nullable().optional(),
	currency: z.string().default("USD"),
	balance: z.string().default("0"),
	isActive: z.boolean().default(true),
	description: z.string().nullable().optional(),
});

export const UpdateAccountSchema = CreateAccountSchema.partial();

export type CreateAccountArgs = z.infer<typeof CreateAccountSchema>;
export type UpdateAccountArgs = z.infer<typeof UpdateAccountSchema>;

// Journals
export const CreateJournalSchema = z.object({
	code: z.string().min(1, "Code is required"),
	name: z.string().min(1, "Name is required"),
	journalType: z.enum(["general", "sales", "purchase", "cash", "bank"]),
	description: z.string().nullable().optional(),
});

export type CreateJournalArgs = z.infer<typeof CreateJournalSchema>;

// Journal Entries
export const CreateJournalEntrySchema = z.object({
	journalId: z.string().uuid(),
	entryNumber: z.string().min(1, "Entry number is required"),
	entryDate: z.string().min(1, "Entry date is required"),
	reference: z.string().nullable().optional(),
	notes: z.string().nullable().optional(),
});

export type CreateJournalEntryArgs = z.infer<typeof CreateJournalEntrySchema>;

// Journal Entry Lines
export const CreateJournalEntryLineSchema = z.object({
	journalEntryId: z.string().uuid(),
	accountId: z.string().uuid(),
	debit: z.string().default("0"),
	credit: z.string().default("0"),
	description: z.string().nullable().optional(),
});

export type CreateJournalEntryLineArgs = z.infer<typeof CreateJournalEntryLineSchema>;

// Invoices
export const CreateInvoiceSchema = z.object({
	invoiceNumber: z.string().min(1, "Invoice number is required"),
	invoiceType: z.enum(["customer", "vendor"]),
	customerId: z.string().uuid().nullable().optional(),
	vendorId: z.string().uuid().nullable().optional(),
	salesOrderId: z.string().uuid().nullable().optional(),
	purchaseOrderId: z.string().uuid().nullable().optional(),
	status: z.enum(["draft", "posted", "paid", "cancelled"]).default("draft"),
	invoiceDate: z.string().min(1, "Invoice date is required"),
	dueDate: z.string().nullable().optional(),
	subtotal: z.string().default("0"),
	taxAmount: z.string().default("0"),
	total: z.string().default("0"),
	notes: z.string().nullable().optional(),
});

export const UpdateInvoiceSchema = CreateInvoiceSchema.partial();

export type CreateInvoiceArgs = z.infer<typeof CreateInvoiceSchema>;
export type UpdateInvoiceArgs = z.infer<typeof UpdateInvoiceSchema>;
