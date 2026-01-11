import { getDb } from "@starter/core/src/sql";
import {
	customers,
	leads,
	quotes,
	quoteLineItems,
	type Customer,
	type InsertCustomer,
	type InsertLead,
	type InsertQuote,
	type InsertQuoteLineItem,
	type Lead,
	type Quote,
	type QuoteLineItem,
} from "@starter/core/src/sql/schema";
import { and, eq, sql } from "drizzle-orm";

// Customers
export const createCustomer = async (data: InsertCustomer): Promise<Customer> => {
	const db = getDb();
	const [newCustomer] = await db.insert(customers).values(data).returning();
	if (!newCustomer) {
		throw new Error("Failed to create customer");
	}
	return newCustomer;
};

export const updateCustomer = async (
	id: string,
	organizationId: string,
	data: Partial<InsertCustomer>,
): Promise<Customer | null> => {
	const db = getDb();
	const [updatedCustomer] = await db
		.update(customers)
		.set({ ...data, updatedAt: new Date() })
		.where(and(eq(customers.id, id), eq(customers.organizationId, organizationId)))
		.returning();
	return updatedCustomer || null;
};

export const deleteCustomer = async (
	id: string,
	organizationId: string,
): Promise<Customer | null> => {
	const db = getDb();
	const [deletedCustomer] = await db
		.delete(customers)
		.where(and(eq(customers.id, id), eq(customers.organizationId, organizationId)))
		.returning();
	return deletedCustomer || null;
};

// Leads
export const createLead = async (data: InsertLead): Promise<Lead> => {
	const db = getDb();
	const [newLead] = await db.insert(leads).values(data).returning();
	if (!newLead) {
		throw new Error("Failed to create lead");
	}
	return newLead;
};

export const updateLead = async (
	id: string,
	organizationId: string,
	data: Partial<InsertLead>,
): Promise<Lead | null> => {
	const db = getDb();
	const [updatedLead] = await db
		.update(leads)
		.set({ ...data, updatedAt: new Date() })
		.where(and(eq(leads.id, id), eq(leads.organizationId, organizationId)))
		.returning();
	return updatedLead || null;
};

export const deleteLead = async (
	id: string,
	organizationId: string,
): Promise<Lead | null> => {
	const db = getDb();
	const [deletedLead] = await db
		.delete(leads)
		.where(and(eq(leads.id, id), eq(leads.organizationId, organizationId)))
		.returning();
	return deletedLead || null;
};

export const updateLeadStatus = async (
	id: string,
	organizationId: string,
	status: string,
): Promise<Lead | null> => {
	return updateLead(id, organizationId, { status: status as any });
};

export const assignLead = async (
	id: string,
	organizationId: string,
	assignedTo: string,
): Promise<Lead | null> => {
	return updateLead(id, organizationId, { assignedTo });
};

// Convert lead to customer
export const convertLeadToCustomer = async (
	leadId: string,
	organizationId: string,
): Promise<Customer> => {
	const db = getDb();

	// Get the lead
	const [lead] = await db
		.select()
		.from(leads)
		.where(and(eq(leads.id, leadId), eq(leads.organizationId, organizationId)));

	if (!lead) {
		throw new Error("Lead not found");
	}

	// Create customer from lead
	const customerData: InsertCustomer = {
		organizationId,
		name: lead.company || lead.name,
		email: lead.email,
		phone: lead.phone,
		notes: lead.notes,
	};

	const customer = await createCustomer(customerData);

	// Update lead status to won
	await updateLeadStatus(leadId, organizationId, "won");

	return customer;
};

// Quotes
export const createQuote = async (data: InsertQuote): Promise<Quote> => {
	const db = getDb();
	const [newQuote] = await db.insert(quotes).values(data).returning();
	if (!newQuote) {
		throw new Error("Failed to create quote");
	}
	return newQuote;
};

export const updateQuote = async (
	id: string,
	organizationId: string,
	data: Partial<InsertQuote>,
): Promise<Quote | null> => {
	const db = getDb();
	const [updatedQuote] = await db
		.update(quotes)
		.set({ ...data, updatedAt: new Date() })
		.where(and(eq(quotes.id, id), eq(quotes.organizationId, organizationId)))
		.returning();
	return updatedQuote || null;
};

export const deleteQuote = async (
	id: string,
	organizationId: string,
): Promise<Quote | null> => {
	const db = getDb();
	const [deletedQuote] = await db
		.delete(quotes)
		.where(and(eq(quotes.id, id), eq(quotes.organizationId, organizationId)))
		.returning();
	return deletedQuote || null;
};

export const updateQuoteStatus = async (
	id: string,
	organizationId: string,
	status: string,
): Promise<Quote | null> => {
	return updateQuote(id, organizationId, { status: status as any });
};

// Quote Line Items
export const addQuoteLineItem = async (
	data: InsertQuoteLineItem,
): Promise<QuoteLineItem> => {
	const db = getDb();
	const [newLineItem] = await db.insert(quoteLineItems).values(data).returning();
	if (!newLineItem) {
		throw new Error("Failed to add quote line item");
	}

	// Recalculate quote totals
	await recalculateQuoteTotals(data.quoteId, data.organizationId);

	return newLineItem;
};

export const updateQuoteLineItem = async (
	id: string,
	organizationId: string,
	data: Partial<InsertQuoteLineItem>,
): Promise<QuoteLineItem | null> => {
	const db = getDb();
	const [updatedLineItem] = await db
		.update(quoteLineItems)
		.set({ ...data, updatedAt: new Date() })
		.where(and(eq(quoteLineItems.id, id), eq(quoteLineItems.organizationId, organizationId)))
		.returning();

	// Recalculate quote totals if line item was updated
	if (updatedLineItem) {
		await recalculateQuoteTotals(updatedLineItem.quoteId, organizationId);
	}

	return updatedLineItem || null;
};

export const deleteQuoteLineItem = async (
	id: string,
	organizationId: string,
): Promise<QuoteLineItem | null> => {
	const db = getDb();
	const [deletedLineItem] = await db
		.delete(quoteLineItems)
		.where(and(eq(quoteLineItems.id, id), eq(quoteLineItems.organizationId, organizationId)))
		.returning();

	// Recalculate quote totals if line item was deleted
	if (deletedLineItem) {
		await recalculateQuoteTotals(deletedLineItem.quoteId, organizationId);
	}

	return deletedLineItem || null;
};

// Helper function to recalculate quote totals
const recalculateQuoteTotals = async (
	quoteId: string,
	organizationId: string,
): Promise<void> => {
	const db = getDb();

	// Sum all line totals
	const [result] = await db
		.select({
			subtotal: sql<string>`COALESCE(SUM(${quoteLineItems.lineTotal}), 0)`,
		})
		.from(quoteLineItems)
		.where(
			and(
				eq(quoteLineItems.quoteId, quoteId),
				eq(quoteLineItems.organizationId, organizationId),
			),
		);

	const subtotal = result?.subtotal || "0";

	// Update quote totals (tax calculation can be added later)
	await db
		.update(quotes)
		.set({
			subtotal,
			total: subtotal, // For now, total = subtotal (tax can be added later)
			updatedAt: new Date(),
		})
		.where(and(eq(quotes.id, quoteId), eq(quotes.organizationId, organizationId)));
};
