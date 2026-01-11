import { getDb } from "@starter/core/src/sql";
import { userErpRoles, type ErpRole } from "@starter/core/src/sql/schema/erp-roles";
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
