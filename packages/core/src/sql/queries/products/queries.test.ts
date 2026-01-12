import { describe, it, expect, beforeEach } from "vitest";
import { getDb } from "@plantiq/core/src/sql";
import { products } from "@plantiq/core/src/sql/schema";
import { listProducts, getProductById, countProducts } from "./queries";
import { createProduct } from "./mutations";

const TEST_ORG_ID = "00000000-0000-0000-0000-000000000001";

describe("Product Queries", () => {
	beforeEach(async () => {
		const db = getDb();
		// Clean up test data
		await db.delete(products);
	});

	it("should list products for an organization", async () => {
		// Create test products
		await createProduct({
			organizationId: TEST_ORG_ID,
			sku: "TEST-001",
			name: "Test Product 1",
			productType: "storable",
			uom: "unit",
		});
		await createProduct({
			organizationId: TEST_ORG_ID,
			sku: "TEST-002",
			name: "Test Product 2",
			productType: "storable",
			uom: "unit",
		});

		const result = await listProducts({
			organizationId: TEST_ORG_ID,
			limit: 10,
			offset: 0,
		});

		expect(result).toHaveLength(2);
		expect(result[0]?.name).toBe("Test Product 1");
		expect(result[1]?.name).toBe("Test Product 2");
	});

	it("should get a product by ID", async () => {
		const product = await createProduct({
			organizationId: TEST_ORG_ID,
			sku: "TEST-001",
			name: "Test Product",
			productType: "storable",
			uom: "unit",
		});

		const found = await getProductById(product.id, TEST_ORG_ID);

		expect(found).not.toBeNull();
		expect(found?.name).toBe("Test Product");
		expect(found?.sku).toBe("TEST-001");
	});

	it("should count products for an organization", async () => {
		await createProduct({
			organizationId: TEST_ORG_ID,
			sku: "TEST-001",
			name: "Test Product 1",
			productType: "storable",
			uom: "unit",
		});
		await createProduct({
			organizationId: TEST_ORG_ID,
			sku: "TEST-002",
			name: "Test Product 2",
			productType: "storable",
			uom: "unit",
		});

		const count = await countProducts(TEST_ORG_ID);

		expect(count).toBe(2);
	});

	it("should filter products by search term", async () => {
		await createProduct({
			organizationId: TEST_ORG_ID,
			sku: "TEST-001",
			name: "Widget A",
			productType: "storable",
			uom: "unit",
		});
		await createProduct({
			organizationId: TEST_ORG_ID,
			sku: "TEST-002",
			name: "Gadget B",
			productType: "storable",
			uom: "unit",
		});

		const result = await listProducts({
			organizationId: TEST_ORG_ID,
			search: "Widget",
			limit: 10,
			offset: 0,
		});

		expect(result).toHaveLength(1);
		expect(result[0]?.name).toBe("Widget A");
	});

	it("should not return products from other organizations", async () => {
		const OTHER_ORG_ID = "00000000-0000-0000-0000-000000000002";

		await createProduct({
			organizationId: TEST_ORG_ID,
			sku: "TEST-001",
			name: "Org 1 Product",
			productType: "storable",
			uom: "unit",
		});
		await createProduct({
			organizationId: OTHER_ORG_ID,
			sku: "TEST-002",
			name: "Org 2 Product",
			productType: "storable",
			uom: "unit",
		});

		const result = await listProducts({
			organizationId: TEST_ORG_ID,
			limit: 10,
			offset: 0,
		});

		expect(result).toHaveLength(1);
		expect(result[0]?.name).toBe("Org 1 Product");
	});
});
