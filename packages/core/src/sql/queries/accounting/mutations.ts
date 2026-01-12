import { getDb } from "@plantiq/core/src/sql";
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
	type InsertAccount,
	type InsertJournal,
	type InsertJournalEntry,
	type InsertJournalEntryLine,
	type InsertInvoice,
} from "@plantiq/core/src/sql/schema";
import { and, eq, sql } from "drizzle-orm";

// Chart of Accounts
export const createAccount = async (data: InsertAccount): Promise<Account> => {
	const db = getDb();
	const [newAccount] = await db.insert(chartOfAccounts).values(data).returning();
	if (!newAccount) throw new Error("Failed to create account");
	return newAccount;
};

export const updateAccount = async (
	id: string,
	organizationId: string,
	data: Partial<InsertAccount>,
): Promise<Account | null> => {
	const db = getDb();
	const [updated] = await db
		.update(chartOfAccounts)
		.set({ ...data, updatedAt: new Date() })
		.where(
			and(
				eq(chartOfAccounts.id, id),
				eq(chartOfAccounts.organizationId, organizationId),
			),
		)
		.returning();
	return updated || null;
};

// Journals
export const createJournal = async (data: InsertJournal): Promise<Journal> => {
	const db = getDb();
	const [newJournal] = await db.insert(journals).values(data).returning();
	if (!newJournal) throw new Error("Failed to create journal");
	return newJournal;
};

// Journal Entries
export const createJournalEntry = async (
	data: InsertJournalEntry,
): Promise<JournalEntry> => {
	const db = getDb();
	const [newEntry] = await db.insert(journalEntries).values(data).returning();
	if (!newEntry) throw new Error("Failed to create journal entry");
	return newEntry;
};

export const postJournalEntry = async (
	id: string,
	organizationId: string,
): Promise<JournalEntry | null> => {
	const db = getDb();

	// Get journal entry lines
	const lines = await db
		.select()
		.from(journalEntryLines)
		.where(
			and(
				eq(journalEntryLines.journalEntryId, id),
				eq(journalEntryLines.organizationId, organizationId),
			),
		);

	// Update account balances
	for (const line of lines) {
		const netChange =
			Number.parseFloat(line.debit) - Number.parseFloat(line.credit);
		await db
			.update(chartOfAccounts)
			.set({
				balance: sql`${chartOfAccounts.balance} + ${netChange}`,
				updatedAt: new Date(),
			})
			.where(eq(chartOfAccounts.id, line.accountId));
	}

	// Mark as posted
	const [posted] = await db
		.update(journalEntries)
		.set({
			isPosted: true,
			postedAt: new Date().toISOString().split("T")[0],
			updatedAt: new Date(),
		})
		.where(
			and(
				eq(journalEntries.id, id),
				eq(journalEntries.organizationId, organizationId),
			),
		)
		.returning();

	return posted || null;
};

export const addJournalEntryLine = async (
	data: InsertJournalEntryLine,
): Promise<JournalEntryLine> => {
	const db = getDb();
	const [newLine] = await db.insert(journalEntryLines).values(data).returning();
	if (!newLine) throw new Error("Failed to add journal entry line");
	return newLine;
};

// Invoices
export const createInvoice = async (data: InsertInvoice): Promise<Invoice> => {
	const db = getDb();
	const [newInvoice] = await db.insert(invoices).values(data).returning();
	if (!newInvoice) throw new Error("Failed to create invoice");
	return newInvoice;
};

export const updateInvoice = async (
	id: string,
	organizationId: string,
	data: Partial<InsertInvoice>,
): Promise<Invoice | null> => {
	const db = getDb();
	const [updated] = await db
		.update(invoices)
		.set({ ...data, updatedAt: new Date() })
		.where(and(eq(invoices.id, id), eq(invoices.organizationId, organizationId)))
		.returning();
	return updated || null;
};
