import { getDb } from "@starter/core/src/sql";
import { userErpRoles, type ErpRole, type InsertUserErpRole } from "@starter/core/src/sql/schema/erp-roles";
import { and, eq } from "drizzle-orm";

/**
 * Add an ERP role to a user
 */
export const addUserErpRole = async (
	userId: string,
	organizationId: string,
	role: ErpRole,
) => {
	const db = getDb();

	// Check if role already exists
	const [existing] = await db
		.select()
		.from(userErpRoles)
		.where(
			and(
				eq(userErpRoles.userId, userId),
				eq(userErpRoles.organizationId, organizationId),
				eq(userErpRoles.role, role),
			),
		)
		.limit(1);

	if (existing) {
		return existing;
	}

	const [newRole] = await db
		.insert(userErpRoles)
		.values({
			userId,
			organizationId,
			role,
		})
		.returning();

	return newRole;
};

/**
 * Remove an ERP role from a user
 */
export const removeUserErpRole = async (
	userId: string,
	organizationId: string,
	role: ErpRole,
) => {
	const db = getDb();
	const [deleted] = await db
		.delete(userErpRoles)
		.where(
			and(
				eq(userErpRoles.userId, userId),
				eq(userErpRoles.organizationId, organizationId),
				eq(userErpRoles.role, role),
			),
		)
		.returning();

	return deleted;
};

/**
 * Set user ERP roles (replaces all existing roles)
 */
export const setUserErpRoles = async (
	userId: string,
	organizationId: string,
	roles: ErpRole[],
) => {
	const db = getDb();

	// Delete all existing roles
	await db
		.delete(userErpRoles)
		.where(
			and(eq(userErpRoles.userId, userId), eq(userErpRoles.organizationId, organizationId)),
		);

	// Insert new roles
	if (roles.length > 0) {
		const newRoles = await db
			.insert(userErpRoles)
			.values(
				roles.map((role) => ({
					userId,
					organizationId,
					role,
				})),
			)
			.returning();

		return newRoles;
	}

	return [];
};
