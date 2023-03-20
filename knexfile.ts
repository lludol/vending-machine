import type { Knex } from 'knex';

interface KnexConfig {
	development: Knex.Config;
	production: Knex.Config;
}

const knexConfig: KnexConfig = {
	development: {
		client:     'better-sqlite3',
		connection: {
			filename: './dev.sqlite',
		},
		migrations: {
			extension: 'ts',
		},
	},
	production: {
		client:     'better-sqlite3',
		connection: {
			filename: './dev.sqlite',
		},
		migrations: {
			extension: 'ts',
		},
	},
};

export default knexConfig;
