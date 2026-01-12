import {
	financeProcedure,
	createTRPCRouter,
} from "@plantiq/core-web/src/trpc/trpc";
import { z } from "zod";
import * as accountingFunctions from "./functions";
import {
	CreateAccountSchema,
	UpdateAccountSchema,
	CreateJournalSchema,
	CreateJournalEntrySchema,
	CreateJournalEntryLineSchema,
	CreateInvoiceSchema,
	UpdateInvoiceSchema,
} from "./schema";

export const accountingRouter = createTRPCRouter({
	// Chart of Accounts
	listAccounts: financeProcedure.query(async ({ ctx }) => {
		return accountingFunctions.listAccounts(ctx);
	}),

	getAccount: financeProcedure
		.input(z.object({ id: z.string().uuid() }))
		.query(async ({ ctx, input }) => {
			return accountingFunctions.getAccount(ctx, input);
		}),

	createAccount: financeProcedure
		.input(CreateAccountSchema)
		.mutation(async ({ ctx, input }) => {
			return accountingFunctions.createAccount(ctx, input);
		}),

	updateAccount: financeProcedure
		.input(z.object({ id: z.string().uuid() }).merge(UpdateAccountSchema))
		.mutation(async ({ ctx, input }) => {
			return accountingFunctions.updateAccount(ctx, input);
		}),

	// Journals
	listJournals: financeProcedure.query(async ({ ctx }) => {
		return accountingFunctions.listJournals(ctx);
	}),

	createJournal: financeProcedure
		.input(CreateJournalSchema)
		.mutation(async ({ ctx, input }) => {
			return accountingFunctions.createJournal(ctx, input);
		}),

	// Journal Entries
	listJournalEntries: financeProcedure
		.input(z.object({ journalId: z.string().uuid().nullable().optional() }).optional())
		.query(async ({ ctx, input }) => {
			return accountingFunctions.listJournalEntries(ctx, input);
		}),

	getJournalEntry: financeProcedure
		.input(z.object({ id: z.string().uuid() }))
		.query(async ({ ctx, input }) => {
			return accountingFunctions.getJournalEntry(ctx, input);
		}),

	createJournalEntry: financeProcedure
		.input(CreateJournalEntrySchema)
		.mutation(async ({ ctx, input }) => {
			return accountingFunctions.createJournalEntry(ctx, input);
		}),

	postJournalEntry: financeProcedure
		.input(z.object({ id: z.string().uuid() }))
		.mutation(async ({ ctx, input }) => {
			return accountingFunctions.postJournalEntry(ctx, input);
		}),

	addJournalEntryLine: financeProcedure
		.input(CreateJournalEntryLineSchema)
		.mutation(async ({ ctx, input }) => {
			return accountingFunctions.addJournalEntryLine(ctx, input);
		}),

	getJournalEntryLines: financeProcedure
		.input(z.object({ journalEntryId: z.string().uuid() }))
		.query(async ({ ctx, input }) => {
			return accountingFunctions.getJournalEntryLines(ctx, input);
		}),

	// Invoices
	listInvoices: financeProcedure
		.input(z.object({ invoiceType: z.string().nullable().optional() }).optional())
		.query(async ({ ctx, input }) => {
			return accountingFunctions.listInvoices(ctx, input);
		}),

	getInvoice: financeProcedure
		.input(z.object({ id: z.string().uuid() }))
		.query(async ({ ctx, input }) => {
			return accountingFunctions.getInvoice(ctx, input);
		}),

	createInvoice: financeProcedure
		.input(CreateInvoiceSchema)
		.mutation(async ({ ctx, input }) => {
			return accountingFunctions.createInvoice(ctx, input);
		}),

	updateInvoice: financeProcedure
		.input(z.object({ id: z.string().uuid() }).merge(UpdateInvoiceSchema))
		.mutation(async ({ ctx, input }) => {
			return accountingFunctions.updateInvoice(ctx, input);
		}),
});
