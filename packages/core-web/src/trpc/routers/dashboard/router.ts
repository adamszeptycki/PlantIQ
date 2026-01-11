import {
	protectedProcedureWithOrganization,
	createTRPCRouter,
} from "@starter/core-web/src/trpc/trpc";
import {
	getSalesMetrics as getSalesMetricsQuery,
	getInventoryMetrics as getInventoryMetricsQuery,
	getProductionMetrics as getProductionMetricsQuery,
	getFinancialMetrics as getFinancialMetricsQuery,
} from "@starter/core/src/sql/queries/dashboard/queries";
import { TRPCError } from "@trpc/server";
import type { Context } from "@starter/core-web/src/trpc/context";

async function getSalesMetrics(ctx: Context) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({ code: "BAD_REQUEST", message: "No active organization" });
	}
	return await getSalesMetricsQuery(organizationId);
}

async function getInventoryMetrics(ctx: Context) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({ code: "BAD_REQUEST", message: "No active organization" });
	}
	return await getInventoryMetricsQuery(organizationId);
}

async function getProductionMetrics(ctx: Context) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({ code: "BAD_REQUEST", message: "No active organization" });
	}
	return await getProductionMetricsQuery(organizationId);
}

async function getFinancialMetrics(ctx: Context) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({ code: "BAD_REQUEST", message: "No active organization" });
	}
	return await getFinancialMetricsQuery(organizationId);
}

export const dashboardRouter = createTRPCRouter({
	getSalesMetrics: protectedProcedureWithOrganization.query(async ({ ctx }) => {
		return getSalesMetrics(ctx);
	}),

	getInventoryMetrics: protectedProcedureWithOrganization.query(async ({ ctx }) => {
		return getInventoryMetrics(ctx);
	}),

	getProductionMetrics: protectedProcedureWithOrganization.query(async ({ ctx }) => {
		return getProductionMetrics(ctx);
	}),

	getFinancialMetrics: protectedProcedureWithOrganization.query(async ({ ctx }) => {
		return getFinancialMetrics(ctx);
	}),
});
