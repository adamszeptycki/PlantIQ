import {
	salesProcedure,
	createTRPCRouter,
} from "@plantiq/core-web/src/trpc/trpc";
import { z } from "zod";
import * as salesFunctions from "./functions";
import {
	CreateCustomerSchema,
	CreateLeadSchema,
	CreateQuoteLineItemSchema,
	CreateQuoteSchema,
	CreateSalesOrderLineItemSchema,
	CreateSalesOrderSchema,
	ListCustomersSchema,
	ListLeadsSchema,
	ListQuotesSchema,
	ListSalesOrdersSchema,
	UpdateCustomerSchema,
	UpdateLeadSchema,
	UpdateQuoteLineItemSchema,
	UpdateQuoteSchema,
	UpdateSalesOrderLineItemSchema,
	UpdateSalesOrderSchema,
} from "./schema";

export const salesRouter = createTRPCRouter({
	// Customers
	createCustomer: salesProcedure
		.input(CreateCustomerSchema)
		.mutation(async ({ ctx, input }) => {
			return salesFunctions.createCustomer(ctx, input);
		}),

	updateCustomer: salesProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}).merge(UpdateCustomerSchema),
		)
		.mutation(async ({ ctx, input }) => {
			return salesFunctions.updateCustomer(ctx, input);
		}),

	deleteCustomer: salesProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return salesFunctions.deleteCustomer(ctx, input);
		}),

	listCustomers: salesProcedure
		.input(ListCustomersSchema)
		.query(async ({ ctx, input }) => {
			return salesFunctions.listCustomers(ctx, input);
		}),

	getCustomer: salesProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.query(async ({ ctx, input }) => {
			return salesFunctions.getCustomer(ctx, input);
		}),

	// Leads
	createLead: salesProcedure
		.input(CreateLeadSchema)
		.mutation(async ({ ctx, input }) => {
			return salesFunctions.createLead(ctx, input);
		}),

	updateLead: salesProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}).merge(UpdateLeadSchema),
		)
		.mutation(async ({ ctx, input }) => {
			return salesFunctions.updateLead(ctx, input);
		}),

	deleteLead: salesProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return salesFunctions.deleteLead(ctx, input);
		}),

	listLeads: salesProcedure
		.input(ListLeadsSchema)
		.query(async ({ ctx, input }) => {
			return salesFunctions.listLeads(ctx, input);
		}),

	getLead: salesProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.query(async ({ ctx, input }) => {
			return salesFunctions.getLead(ctx, input);
		}),

	updateLeadStatus: salesProcedure
		.input(
			z.object({
				id: z.string().uuid(),
				status: z.enum(["new", "contacted", "qualified", "proposal", "negotiation", "won", "lost"]),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return salesFunctions.updateLeadStatus(ctx, input);
		}),

	assignLead: salesProcedure
		.input(
			z.object({
				id: z.string().uuid(),
				assignedTo: z.string().uuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return salesFunctions.assignLead(ctx, input);
		}),

	convertLeadToCustomer: salesProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return salesFunctions.convertLeadToCustomer(ctx, input);
		}),

	// Quotes
	createQuote: salesProcedure
		.input(CreateQuoteSchema)
		.mutation(async ({ ctx, input }) => {
			return salesFunctions.createQuote(ctx, input);
		}),

	updateQuote: salesProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}).merge(UpdateQuoteSchema),
		)
		.mutation(async ({ ctx, input }) => {
			return salesFunctions.updateQuote(ctx, input);
		}),

	deleteQuote: salesProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return salesFunctions.deleteQuote(ctx, input);
		}),

	listQuotes: salesProcedure
		.input(ListQuotesSchema)
		.query(async ({ ctx, input }) => {
			return salesFunctions.listQuotes(ctx, input);
		}),

	getQuote: salesProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.query(async ({ ctx, input }) => {
			return salesFunctions.getQuote(ctx, input);
		}),

	updateQuoteStatus: salesProcedure
		.input(
			z.object({
				id: z.string().uuid(),
				status: z.enum(["draft", "sent", "accepted", "rejected", "expired"]),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return salesFunctions.updateQuoteStatus(ctx, input);
		}),

	getQuoteLineItems: salesProcedure
		.input(
			z.object({
				quoteId: z.string().uuid(),
			}),
		)
		.query(async ({ ctx, input }) => {
			return salesFunctions.getQuoteLineItems(ctx, input);
		}),

	addQuoteLineItem: salesProcedure
		.input(CreateQuoteLineItemSchema)
		.mutation(async ({ ctx, input }) => {
			return salesFunctions.addQuoteLineItem(ctx, input);
		}),

	updateQuoteLineItem: salesProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}).merge(UpdateQuoteLineItemSchema),
		)
		.mutation(async ({ ctx, input }) => {
			return salesFunctions.updateQuoteLineItem(ctx, input);
		}),

	deleteQuoteLineItem: salesProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return salesFunctions.deleteQuoteLineItem(ctx, input);
		}),

	// Sales Orders
	createSalesOrder: salesProcedure
		.input(CreateSalesOrderSchema)
		.mutation(async ({ ctx, input }) => {
			return salesFunctions.createSalesOrder(ctx, input);
		}),

	updateSalesOrder: salesProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}).merge(UpdateSalesOrderSchema),
		)
		.mutation(async ({ ctx, input }) => {
			return salesFunctions.updateSalesOrder(ctx, input);
		}),

	deleteSalesOrder: salesProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return salesFunctions.deleteSalesOrder(ctx, input);
		}),

	listSalesOrders: salesProcedure
		.input(ListSalesOrdersSchema)
		.query(async ({ ctx, input }) => {
			return salesFunctions.listSalesOrders(ctx, input);
		}),

	getSalesOrder: salesProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.query(async ({ ctx, input }) => {
			return salesFunctions.getSalesOrder(ctx, input);
		}),

	updateSalesOrderStatus: salesProcedure
		.input(
			z.object({
				id: z.string().uuid(),
				status: z.enum([
					"draft",
					"confirmed",
					"in_production",
					"ready",
					"delivered",
					"invoiced",
					"cancelled",
				]),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return salesFunctions.updateSalesOrderStatus(ctx, input);
		}),

	getSalesOrderLineItems: salesProcedure
		.input(
			z.object({
				salesOrderId: z.string().uuid(),
			}),
		)
		.query(async ({ ctx, input }) => {
			return salesFunctions.getSalesOrderLineItems(ctx, input);
		}),

	addSalesOrderLineItem: salesProcedure
		.input(CreateSalesOrderLineItemSchema)
		.mutation(async ({ ctx, input }) => {
			return salesFunctions.addSalesOrderLineItem(ctx, input);
		}),

	updateSalesOrderLineItem: salesProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}).merge(UpdateSalesOrderLineItemSchema),
		)
		.mutation(async ({ ctx, input }) => {
			return salesFunctions.updateSalesOrderLineItem(ctx, input);
		}),

	deleteSalesOrderLineItem: salesProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return salesFunctions.deleteSalesOrderLineItem(ctx, input);
		}),
});
