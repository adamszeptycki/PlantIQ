import { adminProcedure, createTRPCRouter } from "@starter/core-web/src/trpc/trpc";
import { z } from "zod";
import {
	listUsersWithRoles as listUsersWithRolesQuery,
	getUserErpRoles as getUserErpRolesQuery,
} from "@starter/core/src/sql/queries/erp-roles/queries";
import {
	addUserErpRole as addUserErpRoleMutation,
	removeUserErpRole as removeUserErpRoleMutation,
	setUserErpRoles as setUserErpRolesMutation,
} from "@starter/core/src/sql/queries/erp-roles/mutations";
import { erpRoles } from "@starter/core/src/sql/schema/erp-roles";
import { TRPCError } from "@trpc/server";
import type { Context } from "@starter/core-web/src/trpc/context";

async function listUsersWithRoles(ctx: Context) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({ code: "BAD_REQUEST", message: "No active organization" });
	}

	return await listUsersWithRolesQuery(organizationId);
}

async function getUserErpRoles(ctx: Context, input: { userId: string }) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({ code: "BAD_REQUEST", message: "No active organization" });
	}

	return await getUserErpRolesQuery(input.userId, organizationId);
}

async function addUserErpRole(
	ctx: Context,
	input: { userId: string; role: (typeof erpRoles)[number] },
) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({ code: "BAD_REQUEST", message: "No active organization" });
	}

	return await addUserErpRoleMutation(input.userId, organizationId, input.role);
}

async function removeUserErpRole(
	ctx: Context,
	input: { userId: string; role: (typeof erpRoles)[number] },
) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({ code: "BAD_REQUEST", message: "No active organization" });
	}

	return await removeUserErpRoleMutation(input.userId, organizationId, input.role);
}

async function setUserErpRoles(
	ctx: Context,
	input: { userId: string; roles: (typeof erpRoles)[number][] },
) {
	const organizationId = ctx.session?.session?.activeOrganizationId;
	if (!organizationId) {
		throw new TRPCError({ code: "BAD_REQUEST", message: "No active organization" });
	}

	return await setUserErpRolesMutation(input.userId, organizationId, input.roles);
}

export const erpRolesRouter = createTRPCRouter({
	listUsersWithRoles: adminProcedure.query(async ({ ctx }) => {
		return listUsersWithRoles(ctx);
	}),

	getUserRoles: adminProcedure
		.input(
			z.object({
				userId: z.string().uuid(),
			}),
		)
		.query(async ({ ctx, input }) => {
			return getUserErpRoles(ctx, input);
		}),

	addRole: adminProcedure
		.input(
			z.object({
				userId: z.string().uuid(),
				role: z.enum(erpRoles),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return addUserErpRole(ctx, input);
		}),

	removeRole: adminProcedure
		.input(
			z.object({
				userId: z.string().uuid(),
				role: z.enum(erpRoles),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return removeUserErpRole(ctx, input);
		}),

	setRoles: adminProcedure
		.input(
			z.object({
				userId: z.string().uuid(),
				roles: z.array(z.enum(erpRoles)),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return setUserErpRoles(ctx, input);
		}),
});
