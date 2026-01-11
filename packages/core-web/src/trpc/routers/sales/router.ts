import {
	protectedProcedureWithOrganization,
	createTRPCRouter,
} from "@starter/core-web/src/trpc/trpc";
import { z } from "zod";
import * as salesFunctions from "./functions";
import {
	CreateCustomerSchema,
	CreateLeadSchema,
	CreateQuoteLineItemSchema,
	CreateQuoteSchema,
	ListCustomersSchema,
	ListLeadsSchema,
	ListQuotesSchema,
	UpdateCustomerSchema,
	UpdateLeadSchema,
	UpdateQuoteLineItemSchema,
	UpdateQuoteSchema,
} from "./schema";

export const salesRouter = createTRPCRouter({
	// Customers
	createCustomer: protectedProcedureWithOrganization
		.input(CreateCustomerSchema)
		.mutation(async ({ ctx, input }) => {
			return salesFunctions.createCustomer(ctx, input);
		}),

	updateCustomer: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
			}).merge(UpdateCustomerSchema),
		)
		.mutation(async ({ ctx, input }) => {
			return salesFunctions.updateCustomer(ctx, input);
		}),

	deleteCustomer: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return salesFunctions.deleteCustomer(ctx, input);
		}),

	listCustomers: protectedProcedureWithOrganization
		.input(ListCustomersSchema)
		.query(async ({ ctx, input }) => {
			return salesFunctions.listCustomers(ctx, input);
		}),

	getCustomer: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.query(async ({ ctx, input }) => {
			return salesFunctions.getCustomer(ctx, input);
		}),

	// Leads
	createLead: protectedProcedureWithOrganization
		.input(CreateLeadSchema)
		.mutation(async ({ ctx, input }) => {
			return salesFunctions.createLead(ctx, input);
		}),

	updateLead: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
			}).merge(UpdateLeadSchema),
		)
		.mutation(async ({ ctx, input }) => {
			return salesFunctions.updateLead(ctx, input);
		}),

	deleteLead: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return salesFunctions.deleteLead(ctx, input);
		}),

	listLeads: protectedProcedureWithOrganization
		.input(ListLeadsSchema)
		.query(async ({ ctx, input }) => {
			return salesFunctions.listLeads(ctx, input);
		}),

	getLead: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.query(async ({ ctx, input }) => {
			return salesFunctions.getLead(ctx, input);
		}),

	updateLeadStatus: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
				status: z.enum(["new", "contacted", "qualified", "proposal", "negotiation", "won", "lost"]),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return salesFunctions.updateLeadStatus(ctx, input);
		}),

	assignLead: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
				assignedTo: z.string().uuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return salesFunctions.assignLead(ctx, input);
		}),

	convertLeadToCustomer: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return salesFunctions.convertLeadToCustomer(ctx, input);
		}),

	// Quotes
	createQuote: protectedProcedureWithOrganization
		.input(CreateQuoteSchema)
		.mutation(async ({ ctx, input }) => {
			return salesFunctions.createQuote(ctx, input);
		}),

	updateQuote: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
			}).merge(UpdateQuoteSchema),
		)
		.mutation(async ({ ctx, input }) => {
			return salesFunctions.updateQuote(ctx, input);
		}),

	deleteQuote: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return salesFunctions.deleteQuote(ctx, input);
		}),

	listQuotes: protectedProcedureWithOrganization
		.input(ListQuotesSchema)
		.query(async ({ ctx, input }) => {
			return salesFunctions.listQuotes(ctx, input);
		}),

	getQuote: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.query(async ({ ctx, input }) => {
			return salesFunctions.getQuote(ctx, input);
		}),

	updateQuoteStatus: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
				status: z.enum(["draft", "sent", "accepted", "rejected", "expired"]),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return salesFunctions.updateQuoteStatus(ctx, input);
		}),

	getQuoteLineItems: protectedProcedureWithOrganization
		.input(
			z.object({
				quoteId: z.string().uuid(),
			}),
		)
		.query(async ({ ctx, input }) => {
			return salesFunctions.getQuoteLineItems(ctx, input);
		}),

	addQuoteLineItem: protectedProcedureWithOrganization
		.input(CreateQuoteLineItemSchema)
		.mutation(async ({ ctx, input }) => {
			return salesFunctions.addQuoteLineItem(ctx, input);
		}),

	updateQuoteLineItem: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
			}).merge(UpdateQuoteLineItemSchema),
		)
		.mutation(async ({ ctx, input }) => {
			return salesFunctions.updateQuoteLineItem(ctx, input);
		}),

	deleteQuoteLineItem: protectedProcedureWithOrganization
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return salesFunctions.deleteQuoteLineItem(ctx, input);
		}),
});
