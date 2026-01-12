import { describe, it, expect, beforeEach } from "vitest";
import { getDb } from "@plantiq/core/src/sql";
import { auditLogs, products } from "@plantiq/core/src/sql/schema";
import { listAuditLogs } from "./queries";
import { logCreate, logUpdate, logDelete } from "./mutations";
import { createProduct } from "../products/mutations";

const TEST_ORG_ID = "00000000-0000-0000-0000-000000000001";
const TEST_USER_ID = "00000000-0000-0000-0000-000000000010";

describe("Audit Logging", () => {
	beforeEach(async () => {
		const db = getDb();
		// Clean up test data
		await db.delete(auditLogs);
		await db.delete(products);
	});

	it("should log product creation", async () => {
		const product = await createProduct(
			{
				organizationId: TEST_ORG_ID,
				sku: "TEST-001",
				name: "Test Product",
				productType: "storable",
				uom: "unit",
			},
			TEST_USER_ID,
		);

		const logs = await listAuditLogs({
			organizationId: TEST_ORG_ID,
			entityId: product.id,
		});

		expect(logs).toHaveLength(1);
		expect(logs[0]?.action).toBe("create");
		expect(logs[0]?.entityType).toBe("product");
		expect(logs[0]?.userId).toBe(TEST_USER_ID);
		expect(logs[0]?.afterState).toBeTruthy();
	});

	it("should log product update with before/after state", async () => {
		const product = await createProduct(
			{
				organizationId: TEST_ORG_ID,
				sku: "TEST-001",
				name: "Original Name",
				productType: "storable",
				uom: "unit",
			},
			TEST_USER_ID,
		);

		const beforeState = { ...product };
		const afterState = { ...product, name: "Updated Name" };
		const changes = { name: "Updated Name" };

		await logUpdate(
			TEST_ORG_ID,
			TEST_USER_ID,
			"product",
			product.id,
			"Updated Name",
			beforeState,
			afterState,
			changes,
		);

		const logs = await listAuditLogs({
			organizationId: TEST_ORG_ID,
			entityId: product.id,
			userId: TEST_USER_ID,
		});

		const updateLog = logs.find((log) => log.action === "update");
		expect(updateLog).toBeTruthy();
		expect(updateLog?.beforeState).toBeTruthy();
		expect(updateLog?.afterState).toBeTruthy();
		expect(updateLog?.changes).toBeTruthy();
	});

	it("should log product deletion", async () => {
		const product = await createProduct(
			{
				organizationId: TEST_ORG_ID,
				sku: "TEST-001",
				name: "Test Product",
				productType: "storable",
				uom: "unit",
			},
			TEST_USER_ID,
		);

		await logDelete(
			TEST_ORG_ID,
			TEST_USER_ID,
			"product",
			product.id,
			product.name,
			product,
		);

		const logs = await listAuditLogs({
			organizationId: TEST_ORG_ID,
			entityId: product.id,
		});

		const deleteLog = logs.find((log) => log.action === "delete");
		expect(deleteLog).toBeTruthy();
		expect(deleteLog?.beforeState).toBeTruthy();
		expect(deleteLog?.afterState).toBeNull();
	});

	it("should filter audit logs by entity type", async () => {
		// Log multiple entity types
		await logCreate(TEST_ORG_ID, TEST_USER_ID, "product", "prod-1", "Product 1", {});
		await logCreate(TEST_ORG_ID, TEST_USER_ID, "sales_order", "so-1", "SO 1", {});
		await logCreate(TEST_ORG_ID, TEST_USER_ID, "product", "prod-2", "Product 2", {});

		const productLogs = await listAuditLogs({
			organizationId: TEST_ORG_ID,
			entityType: "product",
		});

		expect(productLogs).toHaveLength(2);
		expect(productLogs.every((log) => log.entityType === "product")).toBe(true);
	});

	it("should order audit logs by creation time (descending)", async () => {
		await logCreate(TEST_ORG_ID, TEST_USER_ID, "product", "prod-1", "First", {});
		await new Promise((resolve) => setTimeout(resolve, 10)); // Small delay
		await logCreate(TEST_ORG_ID, TEST_USER_ID, "product", "prod-2", "Second", {});

		const logs = await listAuditLogs({
			organizationId: TEST_ORG_ID,
			entityType: "product",
		});

		expect(logs[0]?.entityName).toBe("Second");
		expect(logs[1]?.entityName).toBe("First");
	});
});
