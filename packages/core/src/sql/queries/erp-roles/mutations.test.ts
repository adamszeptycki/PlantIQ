import { describe, it, expect, beforeEach } from "vitest";
import { getDb } from "@starter/core/src/sql";
import { userErpRoles } from "@starter/core/src/sql/schema";
import { addUserErpRole, removeUserErpRole, setUserErpRoles } from "./mutations";
import { getUserErpRoles, checkUserHasErpRole } from "./queries";

const TEST_ORG_ID = "00000000-0000-0000-0000-000000000001";
const TEST_USER_ID = "00000000-0000-0000-0000-000000000010";

describe("ERP Role Management", () => {
	beforeEach(async () => {
		const db = getDb();
		// Clean up test data
		await db.delete(userErpRoles);
	});

	it("should add an ERP role to a user", async () => {
		await addUserErpRole(TEST_USER_ID, TEST_ORG_ID, "sales");

		const hasRole = await checkUserHasErpRole(TEST_USER_ID, TEST_ORG_ID, "sales");
		expect(hasRole).toBe(true);
	});

	it("should not duplicate roles when adding the same role twice", async () => {
		await addUserErpRole(TEST_USER_ID, TEST_ORG_ID, "sales");
		await addUserErpRole(TEST_USER_ID, TEST_ORG_ID, "sales");

		const roles = await getUserErpRoles(TEST_USER_ID, TEST_ORG_ID);
		expect(roles).toHaveLength(1);
	});

	it("should remove an ERP role from a user", async () => {
		await addUserErpRole(TEST_USER_ID, TEST_ORG_ID, "sales");
		await removeUserErpRole(TEST_USER_ID, TEST_ORG_ID, "sales");

		const hasRole = await checkUserHasErpRole(TEST_USER_ID, TEST_ORG_ID, "sales");
		expect(hasRole).toBe(false);
	});

	it("should allow a user to have multiple roles", async () => {
		await addUserErpRole(TEST_USER_ID, TEST_ORG_ID, "sales");
		await addUserErpRole(TEST_USER_ID, TEST_ORG_ID, "planner");
		await addUserErpRole(TEST_USER_ID, TEST_ORG_ID, "finance");

		const roles = await getUserErpRoles(TEST_USER_ID, TEST_ORG_ID);
		expect(roles).toHaveLength(3);

		const hasSales = await checkUserHasErpRole(TEST_USER_ID, TEST_ORG_ID, "sales");
		const hasPlanner = await checkUserHasErpRole(TEST_USER_ID, TEST_ORG_ID, "planner");
		const hasFinance = await checkUserHasErpRole(TEST_USER_ID, TEST_ORG_ID, "finance");

		expect(hasSales).toBe(true);
		expect(hasPlanner).toBe(true);
		expect(hasFinance).toBe(true);
	});

	it("should replace all roles when using setUserErpRoles", async () => {
		await addUserErpRole(TEST_USER_ID, TEST_ORG_ID, "sales");
		await addUserErpRole(TEST_USER_ID, TEST_ORG_ID, "planner");

		await setUserErpRoles(TEST_USER_ID, TEST_ORG_ID, ["finance", "admin"]);

		const roles = await getUserErpRoles(TEST_USER_ID, TEST_ORG_ID);
		expect(roles).toHaveLength(2);

		const hasSales = await checkUserHasErpRole(TEST_USER_ID, TEST_ORG_ID, "sales");
		const hasFinance = await checkUserHasErpRole(TEST_USER_ID, TEST_ORG_ID, "finance");
		const hasAdmin = await checkUserHasErpRole(TEST_USER_ID, TEST_ORG_ID, "admin");

		expect(hasSales).toBe(false);
		expect(hasFinance).toBe(true);
		expect(hasAdmin).toBe(true);
	});

	it("should clear all roles when setting empty array", async () => {
		await addUserErpRole(TEST_USER_ID, TEST_ORG_ID, "sales");
		await addUserErpRole(TEST_USER_ID, TEST_ORG_ID, "planner");

		await setUserErpRoles(TEST_USER_ID, TEST_ORG_ID, []);

		const roles = await getUserErpRoles(TEST_USER_ID, TEST_ORG_ID);
		expect(roles).toHaveLength(0);
	});

	it("should isolate roles by organization", async () => {
		const OTHER_ORG_ID = "00000000-0000-0000-0000-000000000002";

		await addUserErpRole(TEST_USER_ID, TEST_ORG_ID, "sales");
		await addUserErpRole(TEST_USER_ID, OTHER_ORG_ID, "finance");

		const org1Roles = await getUserErpRoles(TEST_USER_ID, TEST_ORG_ID);
		const org2Roles = await getUserErpRoles(TEST_USER_ID, OTHER_ORG_ID);

		expect(org1Roles).toHaveLength(1);
		expect(org2Roles).toHaveLength(1);
		expect(org1Roles[0]?.role).toBe("sales");
		expect(org2Roles[0]?.role).toBe("finance");
	});
});
