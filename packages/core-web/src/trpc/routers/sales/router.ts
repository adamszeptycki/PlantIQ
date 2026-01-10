import {
	protectedProcedureWithOrganization,
	createTRPCRouter,
} from "@starter/core-web/src/trpc/trpc";
import { z } from "zod";
import * as salesFunctions from "./functions";
import {
	CreateCustomerSchema,
	CreateLeadSchema,
	ListCustomersSchema,
	ListLeadsSchema,
	UpdateCustomerSchema,
	UpdateLeadSchema,
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
});
