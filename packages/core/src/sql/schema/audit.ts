import { defaultFields } from "@plantiq/core/src/sql/utils";
import { json, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { organizations } from "./auth";
import { users } from "./auth";

// Audit Action Types
export const auditActionEnum = pgEnum("audit_action", ["create", "update", "delete"]);
export type AuditAction = (typeof auditActionEnum.enumValues)[number];

// Audit Logs
export const auditLogs = pgTable("audit_logs", {
	...defaultFields,
	organizationId: uuid("organization_id")
		.notNull()
		.references(() => organizations.id, { onDelete: "cascade" }),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "set null" }),
	action: auditActionEnum("action").notNull(),
	entityType: text("entity_type").notNull(), // e.g., "product", "sales_order", "manufacturing_order"
	entityId: uuid("entity_id").notNull(),
	entityName: text("entity_name"), // Human-readable name for display
	beforeState: json("before_state"), // JSON of entity state before change
	afterState: json("after_state"), // JSON of entity state after change
	changes: json("changes"), // JSON of specific fields changed
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
});

export const AuditLogSchema = createSelectSchema(auditLogs);
export const InsertAuditLogSchema = createInsertSchema(auditLogs).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;
