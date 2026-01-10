import { getDb } from "@starter/core/src/sql";
import {
	customers,
	leads,
	type Customer,
	type InsertCustomer,
	type InsertLead,
	type Lead,
} from "@starter/core/src/sql/schema";
import { and, eq } from "drizzle-orm";

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
