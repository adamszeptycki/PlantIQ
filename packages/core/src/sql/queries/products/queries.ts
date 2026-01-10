import { getDb } from "@starter/core/src/sql";
import { products, type Product } from "@starter/core/src/sql/schema";
import { and, desc, eq, ilike, or } from "drizzle-orm";

export const getProductById = async (
	id: string,
	organizationId: string,
): Promise<Product | null> => {
	const db = getDb();
	const [product] = await db
		.select()
		.from(products)
		.where(and(eq(products.id, id), eq(products.organizationId, organizationId)));
	return product || null;
};

export const getProductBySku = async (
	sku: string,
	organizationId: string,
): Promise<Product | null> => {
	const db = getDb();
	const [product] = await db
		.select()
		.from(products)
		.where(and(eq(products.sku, sku), eq(products.organizationId, organizationId)));
	return product || null;
};

type ListProductsArgs = {
	organizationId: string;
	search?: string | null;
	productType?: string | null;
	limit?: number;
	offset?: number;
};

export const listProducts = async ({
	organizationId,
	search,
	productType,
	limit = 50,
	offset = 0,
}: ListProductsArgs) => {
	const db = getDb();

	const conditions = [eq(products.organizationId, organizationId)];

	if (search && search.length > 0) {
		conditions.push(
			or(
				ilike(products.name, `%${search}%`),
				ilike(products.sku, `%${search}%`),
				ilike(products.description, `%${search}%`),
			)!,
		);
	}

	if (productType) {
		conditions.push(eq(products.productType, productType as any));
	}

	const results = await db
		.select()
		.from(products)
		.where(and(...conditions))
		.orderBy(desc(products.createdAt))
		.limit(limit)
		.offset(offset);

	return results;
};

export const countProducts = async (organizationId: string): Promise<number> => {
	const db = getDb();
	const [result] = await db
		.select({ count: products.id })
		.from(products)
		.where(eq(products.organizationId, organizationId));
	return Number(result?.count) || 0;
};
