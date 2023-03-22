import type { Knex } from 'knex';

interface KnexConfig {
	test: Knex.Config;
	development: Knex.Config;
	production: Knex.Config;
}

const knexConfig: KnexConfig = {
	test: {
		client:     'better-sqlite3',
		connection: {
			filename: './test.sqlite',
		},
		migrations: {
			extension: 'ts',
		},
		useNullAsDefault: true
	},
	development: {
		client:     'better-sqlite3',
		connection: {
			filename: './dev.sqlite',
		},
		migrations: {
			extension: 'ts',
		},
		useNullAsDefault: true
	},
	production: {
		client:     'better-sqlite3',
		connection: {
			filename: './dev.sqlite',
		},
		migrations: {
			extension: 'ts',
		},
		useNullAsDefault: true
	},
};

export default knexConfig;
