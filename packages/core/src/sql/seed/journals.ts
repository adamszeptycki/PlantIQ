import type { InsertJournal } from "../schema/accounting";

/**
 * Standard Journals for Accounting
 */
export const getStandardJournals = (organizationId: string): InsertJournal[] => {
	return [
		{
			organizationId,
			code: "GJ",
			name: "General Journal",
			journalType: "general",
			description: "General journal entries and adjustments",
		},
		{
			organizationId,
			code: "SJ",
			name: "Sales Journal",
			journalType: "sales",
			description: "Customer invoices and sales revenue",
		},
		{
			organizationId,
			code: "PJ",
			name: "Purchase Journal",
			journalType: "purchase",
			description: "Vendor bills and purchase expenses",
		},
		{
			organizationId,
			code: "CJ",
			name: "Cash Journal",
			journalType: "cash",
			description: "Cash receipts and payments",
		},
		{
			organizationId,
			code: "BJ",
			name: "Bank Journal",
			journalType: "bank",
			description: "Bank transactions and reconciliations",
		},
	];
};
