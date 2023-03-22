import fp from 'fastify-plugin';
import type { FastifyPluginAsync, FastifyRequest } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import { getUserById, Role } from '../models/user.model';

const knexPlugin: FastifyPluginAsync = async function (fastify) {
	await fastify.register(fastifyJwt, {
		secret: fastify.config.JWT_SECRET,
	});

	fastify.decorate('authenticate', async (request: FastifyRequest, role?: Role) => {
		try {
			await request.jwtVerify();
		} catch {
			throw fastify.httpErrors.unauthorized();
		}

		if (role) {
			const user = await getUserById(fastify.knex, request.user.id);

			if (!user) {
				throw fastify.httpErrors.unauthorized();
			} if (user.role !== role) {
				throw fastify.httpErrors.forbidden();
			}
		}
	});
};

export default fp(knexPlugin);
