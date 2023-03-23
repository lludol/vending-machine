import type { Knex } from 'knex';

export interface Product {
	id: number;
	amountAvailable: number;
	cost: number;
	productName: string;
	sellerId: number;
}

export const getProductById = (knex: Knex, id: number) => knex<Product>('products')
	.where('id', id)
	.first();

export const getProducts = (knex: Knex) => knex<Product>('products');
export const getProductsAvailable = (knex: Knex) => knex<Product>('products').where('amountAvailable', '>', 0);

export const createProduct = async (knex: Knex, data: Partial<Product>) => {
	const productCreated = await knex<Product>('products')
		.insert(data)
		.returning('*');

	return productCreated[0];
};

export const updateProductById = async (knex: Knex, id: number, data: Partial<Product>) => {
	const productUpdated = await knex<Product>('products')
		.update(data)
		.where('id', id)
		.returning('*');

	return productUpdated[0];
};

export const deleteProductById = (knex: Knex, id: number) => knex<Product>('products')
	.delete()
	.where('id', id);

export const deleteProductBySellerId = (knex: Knex, sellerId: number) => knex<Product>('products')
	.delete()
	.where('sellerId', sellerId);
