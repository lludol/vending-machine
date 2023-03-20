import type { Knex } from 'knex';
import type { Role } from '../models/user.model';

declare module 'fastify' {
	interface FastifyInstance {
		config: {
			NODE_ENV: 'development' | 'production';
			PORT: number;
			HOST: string;
			JWT_SECRET: string;
		};
		knex: Knex;
		authenticate: (request: FastifyRequest, role?: Role) => void;
	}
}
