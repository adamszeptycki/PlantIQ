import { defaultFields } from "@starter/core/src/sql/utils";
import { pgEnum, pgTable, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { organizations } from "./auth";
import { users } from "./auth";

// ERP Role Enum
export const erpRoles = ["sales", "planner", "buyer", "worker", "supervisor", "finance", "admin"] as const;
export const erpRoleEnum = pgEnum("erp_role", erpRoles);
export type ErpRole = (typeof erpRoles)[number];

// Junction table for user ERP roles (users can have multiple roles per organization)
export const userErpRoles = pgTable("user_erp_roles", {
	...defaultFields,
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	organizationId: uuid("organization_id")
		.notNull()
		.references(() => organizations.id, { onDelete: "cascade" }),
	role: erpRoleEnum("role").notNull(),
});

export const UserErpRoleSchema = createSelectSchema(userErpRoles);
export const InsertUserErpRoleSchema = createInsertSchema(userErpRoles).omit({
	id: true,
});
export type UserErpRole = typeof userErpRoles.$inferSelect;
export type InsertUserErpRole = typeof userErpRoles.$inferInsert;
