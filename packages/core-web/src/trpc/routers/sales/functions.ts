import type { Context } from "@starter/core-web/src/trpc/context";
import {
	addQuoteLineItem as addQuoteLineItemMutation,
	assignLead as assignLeadMutation,
	convertLeadToCustomer as convertLeadToCustomerMutation,
	createCustomer as createCustomerMutation,
	createLead as createLeadMutation,
	createQuote as createQuoteMutation,
	deleteCustomer as deleteCustomerMutation,
	deleteLead as deleteLeadMutation,
	deleteQuote as deleteQuoteMutation,
	deleteQuoteLineItem as deleteQuoteLineItemMutation,
	updateCustomer as updateCustomerMutation,
	updateLead as updateLeadMutation,
	updateLeadStatus as updateLeadStatusMutation,
	updateQuote as updateQuoteMutation,
	updateQuoteLineItem as updateQuoteLineItemMutation,
	updateQuoteStatus as updateQuoteStatusMutation,
} from "@starter/core/src/sql/queries/sales/mutations";
import {
	countCustomers as countCustomersQuery,
	countLeads as countLeadsQuery,
	countQuotes as countQuotesQuery,
	getCustomerById as getCustomerByIdQuery,
	getLeadById as getLeadByIdQuery,
	getQuoteById as getQuoteByIdQuery,
	getQuoteLineItems as getQuoteLineItemsQuery,
	listCustomers as listCustomersQuery,
	listLeads as listLeadsQuery,
	listQuotes as listQuotesQuery,
} from "@starter/core/src/sql/queries/sales/queries";
import { TRPCError } from "@trpc/server";
import type {
	CreateCustomerArgs,
	CreateLeadArgs,
	CreateQuoteArgs,
	CreateQuoteLineItemArgs,
	ListCustomersArgs,
	ListLeadsArgs,
	ListQuotesArgs,
	UpdateCustomerArgs,
	UpdateLeadArgs,
	UpdateQuoteArgs,
	UpdateQuoteLineItemArgs,
} from "./schema";

// Customers
export async function createCustomer(ctx: Context, input: CreateCustomerArgs) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const customer = await createCustomerMutation({
		...input,
		organizationId,
	});

	return customer;
}

export async function updateCustomer(
	ctx: Context,
	input: UpdateCustomerArgs & { id: string },
) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const { id, ...updateData } = input;
	const customer = await updateCustomerMutation(id, organizationId, updateData);

	if (!customer) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Customer not found",
		});
	}

	return customer;
}

export async function deleteCustomer(ctx: Context, input: { id: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const customer = await deleteCustomerMutation(input.id, organizationId);

	if (!customer) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Customer not found",
		});
	}

	return { success: true, customer };
}

export async function listCustomers(ctx: Context, input: ListCustomersArgs) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const [customers, total] = await Promise.all([
		listCustomersQuery({ ...input, organizationId }),
		countCustomersQuery(organizationId),
	]);

	return {
		customers,
		total,
		hasMore: input.offset + input.limit < total,
	};
}

export async function getCustomer(ctx: Context, input: { id: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const customer = await getCustomerByIdQuery(input.id, organizationId);

	if (!customer) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Customer not found",
		});
	}

	return customer;
}

// Leads
export async function createLead(ctx: Context, input: CreateLeadArgs) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const lead = await createLeadMutation({
		...input,
		organizationId,
	});

	return lead;
}

export async function updateLead(ctx: Context, input: UpdateLeadArgs & { id: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const { id, ...updateData } = input;
	const lead = await updateLeadMutation(id, organizationId, updateData);

	if (!lead) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Lead not found",
		});
	}

	return lead;
}

export async function deleteLead(ctx: Context, input: { id: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const lead = await deleteLeadMutation(input.id, organizationId);

	if (!lead) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Lead not found",
		});
	}

	return { success: true, lead };
}

export async function listLeads(ctx: Context, input: ListLeadsArgs) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const [leads, total] = await Promise.all([
		listLeadsQuery({ ...input, organizationId }),
		countLeadsQuery(organizationId),
	]);

	return {
		leads,
		total,
		hasMore: input.offset + input.limit < total,
	};
}

export async function getLead(ctx: Context, input: { id: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const lead = await getLeadByIdQuery(input.id, organizationId);

	if (!lead) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Lead not found",
		});
	}

	return lead;
}

export async function updateLeadStatus(
	ctx: Context,
	input: { id: string; status: string },
) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const lead = await updateLeadStatusMutation(input.id, organizationId, input.status);

	if (!lead) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Lead not found",
		});
	}

	return lead;
}

export async function assignLead(ctx: Context, input: { id: string; assignedTo: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const lead = await assignLeadMutation(input.id, organizationId, input.assignedTo);

	if (!lead) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Lead not found",
		});
	}

	return lead;
}

export async function convertLeadToCustomer(ctx: Context, input: { id: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const customer = await convertLeadToCustomerMutation(input.id, organizationId);

	return customer;
}

// Quotes
export async function createQuote(ctx: Context, input: CreateQuoteArgs) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const quote = await createQuoteMutation({
		...input,
		organizationId,
		subtotal: "0",
		total: "0",
	});

	return quote;
}

export async function updateQuote(ctx: Context, input: UpdateQuoteArgs & { id: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const { id, ...updateData } = input;
	const quote = await updateQuoteMutation(id, organizationId, updateData);

	if (!quote) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Quote not found",
		});
	}

	return quote;
}

export async function deleteQuote(ctx: Context, input: { id: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const quote = await deleteQuoteMutation(input.id, organizationId);

	if (!quote) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Quote not found",
		});
	}

	return { success: true, quote };
}

export async function listQuotes(ctx: Context, input: ListQuotesArgs) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const [quotes, total] = await Promise.all([
		listQuotesQuery({ ...input, organizationId }),
		countQuotesQuery(organizationId),
	]);

	return {
		quotes,
		total,
		hasMore: input.offset + input.limit < total,
	};
}

export async function getQuote(ctx: Context, input: { id: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const quote = await getQuoteByIdQuery(input.id, organizationId);

	if (!quote) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Quote not found",
		});
	}

	return quote;
}

export async function updateQuoteStatus(
	ctx: Context,
	input: { id: string; status: string },
) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const quote = await updateQuoteStatusMutation(input.id, organizationId, input.status);

	if (!quote) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Quote not found",
		});
	}

	return quote;
}

export async function getQuoteLineItems(ctx: Context, input: { quoteId: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const lineItems = await getQuoteLineItemsQuery(input.quoteId, organizationId);

	return lineItems;
}

export async function addQuoteLineItem(ctx: Context, input: CreateQuoteLineItemArgs) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const lineItem = await addQuoteLineItemMutation({
		...input,
		organizationId,
	});

	return lineItem;
}

export async function updateQuoteLineItem(
	ctx: Context,
	input: UpdateQuoteLineItemArgs & { id: string },
) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const { id, ...updateData } = input;
	const lineItem = await updateQuoteLineItemMutation(id, organizationId, updateData);

	if (!lineItem) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Quote line item not found",
		});
	}

	return lineItem;
}

export async function deleteQuoteLineItem(ctx: Context, input: { id: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No active organization",
		});
	}

	const lineItem = await deleteQuoteLineItemMutation(input.id, organizationId);

	if (!lineItem) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Quote line item not found",
		});
	}

	return { success: true, lineItem };
}
