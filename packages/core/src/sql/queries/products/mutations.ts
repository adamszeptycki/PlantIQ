import { getDb } from "@starter/core/src/sql";
import { products, type InsertProduct, type Product } from "@starter/core/src/sql/schema";
import { and, eq } from "drizzle-orm";
import { logCreate, logUpdate, logDelete } from "@starter/core/src/sql/queries/audit/mutations";

export const createProduct = async (
	data: InsertProduct,
	userId?: string,
): Promise<Product> => {
	const db = getDb();
	const [newProduct] = await db.insert(products).values(data).returning();
	if (!newProduct) {
		throw new Error("Failed to create product");
	}

	// Audit log
	if (userId) {
		await logCreate(
			newProduct.organizationId,
			userId,
			"product",
			newProduct.id,
			newProduct.name,
			newProduct,
		);
	}

	return newProduct;
};

export const updateProduct = async (
	id: string,
	organizationId: string,
	data: Partial<InsertProduct>,
	userId?: string,
): Promise<Product | null> => {
	const db = getDb();

	// Get before state for audit
	const [beforeState] = await db
		.select()
		.from(products)
		.where(and(eq(products.id, id), eq(products.organizationId, organizationId)))
		.limit(1);

	const [updatedProduct] = await db
		.update(products)
		.set({ ...data, updatedAt: new Date() })
		.where(and(eq(products.id, id), eq(products.organizationId, organizationId)))
		.returning();

	// Audit log
	if (updatedProduct && userId && beforeState) {
		await logUpdate(
			updatedProduct.organizationId,
			userId,
			"product",
			updatedProduct.id,
			updatedProduct.name,
			beforeState,
			updatedProduct,
			data,
		);
	}

	return updatedProduct || null;
};

export const deleteProduct = async (
	id: string,
	organizationId: string,
	userId?: string,
): Promise<Product | null> => {
	const db = getDb();
	const [deletedProduct] = await db
		.delete(products)
		.where(and(eq(products.id, id), eq(products.organizationId, organizationId)))
		.returning();

	// Audit log
	if (deletedProduct && userId) {
		await logDelete(
			deletedProduct.organizationId,
			userId,
			"product",
			deletedProduct.id,
			deletedProduct.name,
			deletedProduct,
		);
	}

	return deletedProduct || null;
};

export const softDeleteProduct = async (
	id: string,
	organizationId: string,
): Promise<Product | null> => {
	return updateProduct(id, organizationId, { isActive: false });
};
