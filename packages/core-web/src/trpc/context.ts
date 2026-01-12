import { getDb } from "@plantiq/core/src/sql";
import { auth } from "@plantiq/core-web/src/auth/auth";

export async function createTRPCContext(opts: { headers: Headers }) {
	const session = await auth.api.getSession({
		headers: opts.headers,
	});
	const db = getDb();
	return {
		db,
		session,
		...opts,
	};
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
