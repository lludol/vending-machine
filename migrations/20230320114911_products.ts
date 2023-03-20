import type { Knex } from 'knex';

export function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('products', (table) => {
		table.increments('id').primary();

		table.integer('amountAvailable').unsigned().notNullable();
		table.integer('cost').unsigned().notNullable();
		table.string('productName').notNullable().unique();

		table
			.integer('sellerId')
			.unsigned()
			.notNullable()
			.references('id')
			.inTable('users');
	});
}

export function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('products');
}
