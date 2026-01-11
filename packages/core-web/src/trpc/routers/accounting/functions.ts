import type { Context } from "@starter/core-web/src/trpc/context";
import {
	createAccount as createAccountMutation,
	updateAccount as updateAccountMutation,
	createJournal as createJournalMutation,
	createJournalEntry as createJournalEntryMutation,
	postJournalEntry as postJournalEntryMutation,
	addJournalEntryLine as addJournalEntryLineMutation,
	createInvoice as createInvoiceMutation,
	updateInvoice as updateInvoiceMutation,
} from "@starter/core/src/sql/queries/accounting/mutations";
import {
	listAccounts as listAccountsQuery,
	getAccountById as getAccountByIdQuery,
	listJournals as listJournalsQuery,
	listJournalEntries as listJournalEntriesQuery,
	getJournalEntryById as getJournalEntryByIdQuery,
	getJournalEntryLines as getJournalEntryLinesQuery,
	listInvoices as listInvoicesQuery,
	getInvoiceById as getInvoiceByIdQuery,
} from "@starter/core/src/sql/queries/accounting/queries";
import { TRPCError } from "@trpc/server";
import type {
	CreateAccountArgs,
	UpdateAccountArgs,
	CreateJournalArgs,
	CreateJournalEntryArgs,
	CreateJournalEntryLineArgs,
	CreateInvoiceArgs,
	UpdateInvoiceArgs,
} from "./schema";

// Chart of Accounts
export async function listAccounts(ctx: Context) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({ code: "BAD_REQUEST", message: "No active organization" });
	}
	return await listAccountsQuery(organizationId);
}

export async function getAccount(ctx: Context, input: { id: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({ code: "BAD_REQUEST", message: "No active organization" });
	}
	const account = await getAccountByIdQuery(input.id, organizationId);
	if (!account) {
		throw new TRPCError({ code: "NOT_FOUND", message: "Account not found" });
	}
	return account;
}

export async function createAccount(ctx: Context, input: CreateAccountArgs) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({ code: "BAD_REQUEST", message: "No active organization" });
	}
	return await createAccountMutation({ ...input, organizationId });
}

export async function updateAccount(ctx: Context, input: UpdateAccountArgs & { id: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({ code: "BAD_REQUEST", message: "No active organization" });
	}
	const { id, ...updateData } = input;
	const account = await updateAccountMutation(id, organizationId, updateData);
	if (!account) {
		throw new TRPCError({ code: "NOT_FOUND", message: "Account not found" });
	}
	return account;
}

// Journals
export async function listJournals(ctx: Context) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({ code: "BAD_REQUEST", message: "No active organization" });
	}
	return await listJournalsQuery(organizationId);
}

export async function createJournal(ctx: Context, input: CreateJournalArgs) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({ code: "BAD_REQUEST", message: "No active organization" });
	}
	return await createJournalMutation({ ...input, organizationId });
}

// Journal Entries
export async function listJournalEntries(ctx: Context, input?: { journalId?: string | null }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({ code: "BAD_REQUEST", message: "No active organization" });
	}
	return await listJournalEntriesQuery(organizationId, input?.journalId);
}

export async function getJournalEntry(ctx: Context, input: { id: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({ code: "BAD_REQUEST", message: "No active organization" });
	}
	const entry = await getJournalEntryByIdQuery(input.id, organizationId);
	if (!entry) {
		throw new TRPCError({ code: "NOT_FOUND", message: "Journal entry not found" });
	}
	return entry;
}

export async function createJournalEntry(ctx: Context, input: CreateJournalEntryArgs) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({ code: "BAD_REQUEST", message: "No active organization" });
	}
	return await createJournalEntryMutation({
		...input,
		organizationId,
		isPosted: false,
		postedAt: null,
	});
}

export async function postJournalEntry(ctx: Context, input: { id: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({ code: "BAD_REQUEST", message: "No active organization" });
	}
	const entry = await postJournalEntryMutation(input.id, organizationId);
	if (!entry) {
		throw new TRPCError({ code: "NOT_FOUND", message: "Journal entry not found" });
	}
	return entry;
}

export async function addJournalEntryLine(ctx: Context, input: CreateJournalEntryLineArgs) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({ code: "BAD_REQUEST", message: "No active organization" });
	}
	return await addJournalEntryLineMutation({ ...input, organizationId });
}

export async function getJournalEntryLines(ctx: Context, input: { journalEntryId: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({ code: "BAD_REQUEST", message: "No active organization" });
	}
	return await getJournalEntryLinesQuery(input.journalEntryId, organizationId);
}

// Invoices
export async function listInvoices(ctx: Context, input?: { invoiceType?: string | null }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({ code: "BAD_REQUEST", message: "No active organization" });
	}
	return await listInvoicesQuery(organizationId, input?.invoiceType);
}

export async function getInvoice(ctx: Context, input: { id: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({ code: "BAD_REQUEST", message: "No active organization" });
	}
	const invoice = await getInvoiceByIdQuery(input.id, organizationId);
	if (!invoice) {
		throw new TRPCError({ code: "NOT_FOUND", message: "Invoice not found" });
	}
	return invoice;
}

export async function createInvoice(ctx: Context, input: CreateInvoiceArgs) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({ code: "BAD_REQUEST", message: "No active organization" });
	}
	return await createInvoiceMutation({
		...input,
		organizationId,
		amountPaid: "0",
		paidDate: null,
		journalEntryId: null,
	});
}

export async function updateInvoice(ctx: Context, input: UpdateInvoiceArgs & { id: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({ code: "BAD_REQUEST", message: "No active organization" });
	}
	const { id, ...updateData } = input;
	const invoice = await updateInvoiceMutation(id, organizationId, updateData);
	if (!invoice) {
		throw new TRPCError({ code: "NOT_FOUND", message: "Invoice not found" });
	}
	return invoice;
}
