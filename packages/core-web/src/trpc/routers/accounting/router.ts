import {
	protectedProcedureWithOrganization,
	createTRPCRouter,
} from "@starter/core-web/src/trpc/trpc";
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
	listAccounts: protectedProcedureWithOrganization.query(async ({ ctx }) => {
		return accountingFunctions.listAccounts(ctx);
	}),

	getAccount: protectedProcedureWithOrganization
		.input(z.object({ id: z.string().uuid() }))
		.query(async ({ ctx, input }) => {
			return accountingFunctions.getAccount(ctx, input);
		}),

	createAccount: protectedProcedureWithOrganization
		.input(CreateAccountSchema)
		.mutation(async ({ ctx, input }) => {
			return accountingFunctions.createAccount(ctx, input);
		}),

	updateAccount: protectedProcedureWithOrganization
		.input(z.object({ id: z.string().uuid() }).merge(UpdateAccountSchema))
		.mutation(async ({ ctx, input }) => {
			return accountingFunctions.updateAccount(ctx, input);
		}),

	// Journals
	listJournals: protectedProcedureWithOrganization.query(async ({ ctx }) => {
		return accountingFunctions.listJournals(ctx);
	}),

	createJournal: protectedProcedureWithOrganization
		.input(CreateJournalSchema)
		.mutation(async ({ ctx, input }) => {
			return accountingFunctions.createJournal(ctx, input);
		}),

	// Journal Entries
	listJournalEntries: protectedProcedureWithOrganization
		.input(z.object({ journalId: z.string().uuid().nullable().optional() }).optional())
		.query(async ({ ctx, input }) => {
			return accountingFunctions.listJournalEntries(ctx, input);
		}),

	getJournalEntry: protectedProcedureWithOrganization
		.input(z.object({ id: z.string().uuid() }))
		.query(async ({ ctx, input }) => {
			return accountingFunctions.getJournalEntry(ctx, input);
		}),

	createJournalEntry: protectedProcedureWithOrganization
		.input(CreateJournalEntrySchema)
		.mutation(async ({ ctx, input }) => {
			return accountingFunctions.createJournalEntry(ctx, input);
		}),

	postJournalEntry: protectedProcedureWithOrganization
		.input(z.object({ id: z.string().uuid() }))
		.mutation(async ({ ctx, input }) => {
			return accountingFunctions.postJournalEntry(ctx, input);
		}),

	addJournalEntryLine: protectedProcedureWithOrganization
		.input(CreateJournalEntryLineSchema)
		.mutation(async ({ ctx, input }) => {
			return accountingFunctions.addJournalEntryLine(ctx, input);
		}),

	getJournalEntryLines: protectedProcedureWithOrganization
		.input(z.object({ journalEntryId: z.string().uuid() }))
		.query(async ({ ctx, input }) => {
			return accountingFunctions.getJournalEntryLines(ctx, input);
		}),

	// Invoices
	listInvoices: protectedProcedureWithOrganization
		.input(z.object({ invoiceType: z.string().nullable().optional() }).optional())
		.query(async ({ ctx, input }) => {
			return accountingFunctions.listInvoices(ctx, input);
		}),

	getInvoice: protectedProcedureWithOrganization
		.input(z.object({ id: z.string().uuid() }))
		.query(async ({ ctx, input }) => {
			return accountingFunctions.getInvoice(ctx, input);
		}),

	createInvoice: protectedProcedureWithOrganization
		.input(CreateInvoiceSchema)
		.mutation(async ({ ctx, input }) => {
			return accountingFunctions.createInvoice(ctx, input);
		}),

	updateInvoice: protectedProcedureWithOrganization
		.input(z.object({ id: z.string().uuid() }).merge(UpdateInvoiceSchema))
		.mutation(async ({ ctx, input }) => {
			return accountingFunctions.updateInvoice(ctx, input);
		}),
});
