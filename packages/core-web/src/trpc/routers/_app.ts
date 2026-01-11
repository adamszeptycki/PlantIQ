import type { inferRouterOutputs } from "@trpc/server";
import { createTRPCRouter } from "../trpc";
import { organizationRouter } from "./organization/router";
import { userRouter } from "./user/router";
import { productsRouter } from "./products/router";
import { inventoryRouter } from "./inventory/router";
import { salesRouter } from "./sales/router";
import { manufacturingRouter } from "./manufacturing/router";
import { purchasingRouter } from "./purchasing/router";
import { accountingRouter } from "./accounting/router";
import { dashboardRouter } from "./dashboard/router";
import { auditRouter } from "./audit/router";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	user: userRouter,
	organization: organizationRouter,
	products: productsRouter,
	inventory: inventoryRouter,
	sales: salesRouter,
	manufacturing: manufacturingRouter,
	purchasing: purchasingRouter,
	accounting: accountingRouter,
	dashboard: dashboardRouter,
	audit: auditRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
