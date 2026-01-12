import { getDb } from "@plantiq/core/src/sql";
import { userErpRoles, type ErpRole } from "@plantiq/core/src/sql/schema/erp-roles";
import { users } from "@plantiq/core/src/sql/schema/auth";
import { and, eq } from "drizzle-orm";

/**
 * Check if a user has a specific ERP role in an organization
 */
export const checkUserHasErpRole = async (
	userId: string,
	organizationId: string,
	role: ErpRole,
): Promise<boolean> => {
	const db = getDb();
	const [userRole] = await db
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
	return !!userRole;
};

/**
 * Get all ERP roles for a user in an organization
 */
export const getUserErpRoles = async (userId: string, organizationId: string) => {
	const db = getDb();
	const roles = await db
		.select()
		.from(userErpRoles)
		.where(and(eq(userErpRoles.userId, userId), eq(userErpRoles.organizationId, organizationId)));
	return roles;
};

/**
 * List all users with their ERP roles in an organization
 */
export const listUsersWithRoles = async (organizationId: string) => {
	const db = getDb();
	const usersWithRoles = await db
		.select({
			userId: users.id,
			userName: users.name,
			userEmail: users.email,
			role: userErpRoles.role,
		})
		.from(users)
		.leftJoin(
			userErpRoles,
			and(eq(userErpRoles.userId, users.id), eq(userErpRoles.organizationId, organizationId)),
		);

	// Group roles by user
	const userMap = new Map<
		string,
		{ userId: string; userName: string | null; userEmail: string; roles: ErpRole[] }
	>();

	for (const row of usersWithRoles) {
		if (!userMap.has(row.userId)) {
			userMap.set(row.userId, {
				userId: row.userId,
				userName: row.userName,
				userEmail: row.userEmail,
				roles: [],
			});
		}
		if (row.role) {
			userMap.get(row.userId)!.roles.push(row.role);
		}
	}

	return Array.from(userMap.values());
};
