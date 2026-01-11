import {
	protectedProcedureWithOrganization,
	createTRPCRouter,
} from "@starter/core-web/src/trpc/trpc";
import {
	getSalesMetrics as getSalesMetricsQuery,
	getInventoryMetrics as getInventoryMetricsQuery,
	getProductionMetrics as getProductionMetricsQuery,
	getFinancialMetrics as getFinancialMetricsQuery,
	getSalesReport as getSalesReportQuery,
	getInventoryReport as getInventoryReportQuery,
	getProductionReport as getProductionReportQuery,
	getFinancialReport as getFinancialReportQuery,
} from "@starter/core/src/sql/queries/dashboard/queries";
import { TRPCError } from "@trpc/server";
import type { Context } from "@starter/core-web/src/trpc/context";
import { z } from "zod";

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

// Report Functions
const DateRangeSchema = z
	.object({
		startDate: z.string().optional(),
		endDate: z.string().optional(),
	})
	.optional();

async function getSalesReport(
	ctx: Context,
	dateRange?: { startDate?: string; endDate?: string },
) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({ code: "BAD_REQUEST", message: "No active organization" });
	}
	return await getSalesReportQuery(organizationId, dateRange);
}

async function getInventoryReport(
	ctx: Context,
	dateRange?: { startDate?: string; endDate?: string },
) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({ code: "BAD_REQUEST", message: "No active organization" });
	}
	return await getInventoryReportQuery(organizationId, dateRange);
}

async function getProductionReport(
	ctx: Context,
	dateRange?: { startDate?: string; endDate?: string },
) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({ code: "BAD_REQUEST", message: "No active organization" });
	}
	return await getProductionReportQuery(organizationId, dateRange);
}

async function getFinancialReport(
	ctx: Context,
	dateRange?: { startDate?: string; endDate?: string },
) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({ code: "BAD_REQUEST", message: "No active organization" });
	}
	return await getFinancialReportQuery(organizationId, dateRange);
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

	// Reports
	getSalesReport: protectedProcedureWithOrganization
		.input(DateRangeSchema)
		.query(async ({ ctx, input }) => {
			return getSalesReport(ctx, input);
		}),

	getInventoryReport: protectedProcedureWithOrganization
		.input(DateRangeSchema)
		.query(async ({ ctx, input }) => {
			return getInventoryReport(ctx, input);
		}),

	getProductionReport: protectedProcedureWithOrganization
		.input(DateRangeSchema)
		.query(async ({ ctx, input }) => {
			return getProductionReport(ctx, input);
		}),

	getFinancialReport: protectedProcedureWithOrganization
		.input(DateRangeSchema)
		.query(async ({ ctx, input }) => {
			return getFinancialReport(ctx, input);
		}),
});
