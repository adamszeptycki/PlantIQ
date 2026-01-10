import { getDb } from "@starter/core/src/sql";
import { customers, leads, type Customer, type Lead } from "@starter/core/src/sql/schema";
import { and, desc, eq, ilike, or } from "drizzle-orm";

// Customers
type ListCustomersArgs = {
	organizationId: string;
	search?: string | null;
	limit?: number;
	offset?: number;
};

export const listCustomers = async ({
	organizationId,
	search,
	limit = 50,
	offset = 0,
}: ListCustomersArgs): Promise<Customer[]> => {
	const db = getDb();

	const conditions = [eq(customers.organizationId, organizationId)];

	if (search && search.length > 0) {
		conditions.push(
			or(
				ilike(customers.name, `%${search}%`),
				ilike(customers.email, `%${search}%`),
			)!,
		);
	}

	const results = await db
		.select()
		.from(customers)
		.where(and(...conditions))
		.orderBy(desc(customers.createdAt))
		.limit(limit)
		.offset(offset);

	return results;
};

export const getCustomerById = async (
	id: string,
	organizationId: string,
): Promise<Customer | null> => {
	const db = getDb();
	const [customer] = await db
		.select()
		.from(customers)
		.where(and(eq(customers.id, id), eq(customers.organizationId, organizationId)));
	return customer || null;
};

export const countCustomers = async (organizationId: string): Promise<number> => {
	const db = getDb();
	const [result] = await db
		.select({ count: customers.id })
		.from(customers)
		.where(eq(customers.organizationId, organizationId));
	return Number(result?.count) || 0;
};

// Leads
type ListLeadsArgs = {
	organizationId: string;
	status?: string | null;
	assignedTo?: string | null;
	search?: string | null;
	limit?: number;
	offset?: number;
};

export const listLeads = async ({
	organizationId,
	status,
	assignedTo,
	search,
	limit = 50,
	offset = 0,
}: ListLeadsArgs): Promise<Lead[]> => {
	const db = getDb();

	const conditions = [eq(leads.organizationId, organizationId)];

	if (status) {
		conditions.push(eq(leads.status, status as any));
	}

	if (assignedTo) {
		conditions.push(eq(leads.assignedTo, assignedTo));
	}

	if (search && search.length > 0) {
		conditions.push(
			or(
				ilike(leads.name, `%${search}%`),
				ilike(leads.company, `%${search}%`),
				ilike(leads.email, `%${search}%`),
			)!,
		);
	}

	const results = await db
		.select()
		.from(leads)
		.where(and(...conditions))
		.orderBy(desc(leads.createdAt))
		.limit(limit)
		.offset(offset);

	return results;
};

export const getLeadById = async (
	id: string,
	organizationId: string,
): Promise<Lead | null> => {
	const db = getDb();
	const [lead] = await db
		.select()
		.from(leads)
		.where(and(eq(leads.id, id), eq(leads.organizationId, organizationId)));
	return lead || null;
};

export const countLeads = async (organizationId: string): Promise<number> => {
	const db = getDb();
	const [result] = await db
		.select({ count: leads.id })
		.from(leads)
		.where(eq(leads.organizationId, organizationId));
	return Number(result?.count) || 0;
};

export const countLeadsByStatus = async (
	organizationId: string,
	status: string,
): Promise<number> => {
	const db = getDb();
	const [result] = await db
		.select({ count: leads.id })
		.from(leads)
		.where(and(eq(leads.organizationId, organizationId), eq(leads.status, status as any)));
	return Number(result?.count) || 0;
};
