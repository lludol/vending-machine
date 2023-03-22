import fp from 'fastify-plugin';
import Knex from 'knex';
import type { FastifyPluginCallback } from 'fastify';

import knexConfig from '../../knexfile';

const knexPlugin: FastifyPluginCallback = function (fastify, _, done) {
	const knex = Knex(knexConfig[fastify.config.NODE_ENV]);

	fastify.decorate('knex', knex);

	fastify.addHook('onClose', (f, d) => {
		if (f.knex === knex) {
			f.knex.destroy(d);
		}
	});

	done();
};

export default fp(knexPlugin);
