import { getDb } from "@starter/core/src/sql";
import { auditLogs, type InsertAuditLog } from "@starter/core/src/sql/schema/audit";

/**
 * Create an audit log entry
 */
export const createAuditLog = async (data: InsertAuditLog) => {
	const db = getDb();
	const [log] = await db.insert(auditLogs).values(data).returning();
	return log;
};

/**
 * Helper to log a create action
 */
export const logCreate = async (
	organizationId: string,
	userId: string,
	entityType: string,
	entityId: string,
	entityName: string,
	afterState: any,
	ipAddress?: string,
	userAgent?: string,
) => {
	return createAuditLog({
		organizationId,
		userId,
		action: "create",
		entityType,
		entityId,
		entityName,
		beforeState: null,
		afterState,
		changes: null,
		ipAddress,
		userAgent,
	});
};

/**
 * Helper to log an update action
 */
export const logUpdate = async (
	organizationId: string,
	userId: string,
	entityType: string,
	entityId: string,
	entityName: string,
	beforeState: any,
	afterState: any,
	changes: any,
	ipAddress?: string,
	userAgent?: string,
) => {
	return createAuditLog({
		organizationId,
		userId,
		action: "update",
		entityType,
		entityId,
		entityName,
		beforeState,
		afterState,
		changes,
		ipAddress,
		userAgent,
	});
};

/**
 * Helper to log a delete action
 */
export const logDelete = async (
	organizationId: string,
	userId: string,
	entityType: string,
	entityId: string,
	entityName: string,
	beforeState: any,
	ipAddress?: string,
	userAgent?: string,
) => {
	return createAuditLog({
		organizationId,
		userId,
		action: "delete",
		entityType,
		entityId,
		entityName,
		beforeState,
		afterState: null,
		changes: null,
		ipAddress,
		userAgent,
	});
};
