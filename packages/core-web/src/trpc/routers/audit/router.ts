import { adminProcedure, createTRPCRouter } from "@plantiq/core-web/src/trpc/trpc";
import { z } from "zod";
import {
	listAuditLogs as listAuditLogsQuery,
	getAuditLog as getAuditLogQuery,
} from "@plantiq/core/src/sql/queries/audit/queries";
import { TRPCError } from "@trpc/server";
import type { Context } from "@plantiq/core-web/src/trpc/context";

async function listAuditLogs(
	ctx: Context,
	input: {
		entityType?: string;
		entityId?: string;
		userId?: string;
		limit?: number;
		offset?: number;
	},
) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({ code: "BAD_REQUEST", message: "No active organization" });
	}

	return await listAuditLogsQuery({
		organizationId,
		...input,
	});
}

async function getAuditLog(ctx: Context, input: { id: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({ code: "BAD_REQUEST", message: "No active organization" });
	}

	const log = await getAuditLogQuery(input.id, organizationId);
	if (!log) {
		throw new TRPCError({ code: "NOT_FOUND", message: "Audit log not found" });
	}

	return log;
}

export const auditRouter = createTRPCRouter({
	list: adminProcedure
		.input(
			z.object({
				entityType: z.string().optional(),
				entityId: z.string().uuid().optional(),
				userId: z.string().uuid().optional(),
				limit: z.number().min(1).max(100).default(50),
				offset: z.number().min(0).default(0),
			}),
		)
		.query(async ({ ctx, input }) => {
			return listAuditLogs(ctx, input);
		}),

	get: adminProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.query(async ({ ctx, input }) => {
			return getAuditLog(ctx, input);
		}),
});
