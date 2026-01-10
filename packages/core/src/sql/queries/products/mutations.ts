import { getDb } from "@starter/core/src/sql";
import { products, type InsertProduct, type Product } from "@starter/core/src/sql/schema";
import { and, eq } from "drizzle-orm";

export const createProduct = async (
	data: InsertProduct,
): Promise<Product> => {
	const db = getDb();
	const [newProduct] = await db.insert(products).values(data).returning();
	if (!newProduct) {
		throw new Error("Failed to create product");
	}
	return newProduct;
};

export const updateProduct = async (
	id: string,
	organizationId: string,
	data: Partial<InsertProduct>,
): Promise<Product | null> => {
	const db = getDb();
	const [updatedProduct] = await db
		.update(products)
		.set({ ...data, updatedAt: new Date() })
		.where(and(eq(products.id, id), eq(products.organizationId, organizationId)))
		.returning();
	return updatedProduct || null;
};

export const deleteProduct = async (
	id: string,
	organizationId: string,
): Promise<Product | null> => {
	const db = getDb();
	const [deletedProduct] = await db
		.delete(products)
		.where(and(eq(products.id, id), eq(products.organizationId, organizationId)))
		.returning();
	return deletedProduct || null;
};

export const softDeleteProduct = async (
	id: string,
	organizationId: string,
): Promise<Product | null> => {
	return updateProduct(id, organizationId, { isActive: false });
};
