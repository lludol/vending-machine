import type { Knex } from 'knex';

export function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('users', (table) => {
		table.increments('id').primary();

		table.string('username', 30).notNullable().unique();
		table.string('password').notNullable();

		table.integer('deposit').notNullable();

		table.enu('role', ['seller', 'buyer']).notNullable();
	});
}

export function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('users');
}
