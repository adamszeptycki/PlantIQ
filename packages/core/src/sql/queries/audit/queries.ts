import { getDb } from "@plantiq/core/src/sql";
import { auditLogs } from "@plantiq/core/src/sql/schema/audit";
import { users } from "@plantiq/core/src/sql/schema/auth";
import { and, desc, eq, sql } from "drizzle-orm";

type ListAuditLogsArgs = {
	organizationId: string;
	entityType?: string;
	entityId?: string;
	userId?: string;
	limit?: number;
	offset?: number;
};

/**
 * List audit logs with optional filters
 */
export const listAuditLogs = async (args: ListAuditLogsArgs) => {
	const db = getDb();
	const { organizationId, entityType, entityId, userId, limit = 100, offset = 0 } = args;

	const whereConditions = [eq(auditLogs.organizationId, organizationId)];

	if (entityType) {
		whereConditions.push(eq(auditLogs.entityType, entityType));
	}
	if (entityId) {
		whereConditions.push(eq(auditLogs.entityId, entityId));
	}
	if (userId) {
		whereConditions.push(eq(auditLogs.userId, userId));
	}

	const logs = await db
		.select({
			id: auditLogs.id,
			organizationId: auditLogs.organizationId,
			userId: auditLogs.userId,
			userName: users.name,
			userEmail: users.email,
			action: auditLogs.action,
			entityType: auditLogs.entityType,
			entityId: auditLogs.entityId,
			entityName: auditLogs.entityName,
			beforeState: auditLogs.beforeState,
			afterState: auditLogs.afterState,
			changes: auditLogs.changes,
			ipAddress: auditLogs.ipAddress,
			userAgent: auditLogs.userAgent,
			createdAt: auditLogs.createdAt,
		})
		.from(auditLogs)
		.leftJoin(users, eq(users.id, auditLogs.userId))
		.where(and(...whereConditions))
		.orderBy(desc(auditLogs.createdAt))
		.limit(limit)
		.offset(offset);

	return logs;
};

/**
 * Get a single audit log by ID
 */
export const getAuditLog = async (id: string, organizationId: string) => {
	const db = getDb();
	const [log] = await db
		.select()
		.from(auditLogs)
		.where(and(eq(auditLogs.id, id), eq(auditLogs.organizationId, organizationId)))
		.limit(1);
	return log || null;
};
