import { getDb } from "@starter/core/src/sql";
import {
	chartOfAccounts,
	journals,
	journalEntries,
	journalEntryLines,
	invoices,
	type Account,
	type Journal,
	type JournalEntry,
	type JournalEntryLine,
	type Invoice,
} from "@starter/core/src/sql/schema";
import { and, desc, eq } from "drizzle-orm";

// Chart of Accounts
export const listAccounts = async (organizationId: string): Promise<Account[]> => {
	const db = getDb();
	return await db
		.select()
		.from(chartOfAccounts)
		.where(eq(chartOfAccounts.organizationId, organizationId))
		.orderBy(chartOfAccounts.code);
};

export const getAccountById = async (
	id: string,
	organizationId: string,
): Promise<Account | null> => {
	const db = getDb();
	const [account] = await db
		.select()
		.from(chartOfAccounts)
		.where(
			and(
				eq(chartOfAccounts.id, id),
				eq(chartOfAccounts.organizationId, organizationId),
			),
		);
	return account || null;
};

// Journals
export const listJournals = async (organizationId: string): Promise<Journal[]> => {
	const db = getDb();
	return await db
		.select()
		.from(journals)
		.where(eq(journals.organizationId, organizationId))
		.orderBy(journals.code);
};

// Journal Entries
export const listJournalEntries = async (
	organizationId: string,
	journalId?: string | null,
): Promise<JournalEntry[]> => {
	const db = getDb();
	const conditions = [eq(journalEntries.organizationId, organizationId)];
	if (journalId) {
		conditions.push(eq(journalEntries.journalId, journalId));
	}
	return await db
		.select()
		.from(journalEntries)
		.where(and(...conditions))
		.orderBy(desc(journalEntries.entryDate));
};

export const getJournalEntryById = async (
	id: string,
	organizationId: string,
): Promise<JournalEntry | null> => {
	const db = getDb();
	const [entry] = await db
		.select()
		.from(journalEntries)
		.where(
			and(
				eq(journalEntries.id, id),
				eq(journalEntries.organizationId, organizationId),
			),
		);
	return entry || null;
};

export const getJournalEntryLines = async (
	journalEntryId: string,
	organizationId: string,
): Promise<JournalEntryLine[]> => {
	const db = getDb();
	return await db
		.select()
		.from(journalEntryLines)
		.where(
			and(
				eq(journalEntryLines.journalEntryId, journalEntryId),
				eq(journalEntryLines.organizationId, organizationId),
			),
		);
};

// Invoices
export const listInvoices = async (
	organizationId: string,
	invoiceType?: string | null,
): Promise<Invoice[]> => {
	const db = getDb();
	const conditions = [eq(invoices.organizationId, organizationId)];
	if (invoiceType) {
		conditions.push(eq(invoices.invoiceType, invoiceType));
	}
	return await db
		.select()
		.from(invoices)
		.where(and(...conditions))
		.orderBy(desc(invoices.invoiceDate));
};

export const getInvoiceById = async (
	id: string,
	organizationId: string,
): Promise<Invoice | null> => {
	const db = getDb();
	const [invoice] = await db
		.select()
		.from(invoices)
		.where(and(eq(invoices.id, id), eq(invoices.organizationId, organizationId)));
	return invoice || null;
};
