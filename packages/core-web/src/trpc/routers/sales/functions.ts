import type { Context } from "@starter/core-web/src/trpc/context";
import {
	assignLead as assignLeadMutation,
	convertLeadToCustomer as convertLeadToCustomerMutation,
	createCustomer as createCustomerMutation,
	createLead as createLeadMutation,
	deleteCustomer as deleteCustomerMutation,
	deleteLead as deleteLeadMutation,
	updateCustomer as updateCustomerMutation,
	updateLead as updateLeadMutation,
	updateLeadStatus as updateLeadStatusMutation,
} from "@starter/core/src/sql/queries/sales/mutations";
import {
	countCustomers as countCustomersQuery,
	countLeads as countLeadsQuery,
	getCustomerById as getCustomerByIdQuery,
	getLeadById as getLeadByIdQuery,
	listCustomers as listCustomersQuery,
	listLeads as listLeadsQuery,
} from "@starter/core/src/sql/queries/sales/queries";
import { TRPCError } from "@trpc/server";
import type {
	CreateCustomerArgs,
	CreateLeadArgs,
	ListCustomersArgs,
	ListLeadsArgs,
	UpdateCustomerArgs,
	UpdateLeadArgs,
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
