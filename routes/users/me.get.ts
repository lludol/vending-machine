import type { RouteOptions } from 'fastify';
import { getUserById } from '../../models/user.model';

export default {
	method: 'GET',
	url:    '/me',
	onRequest(request) {
		return this.authenticate(request);
	},
	async handler(request) {
		const { id } = request.user;

		const user = await getUserById(this.knex, id);

		if (!user) {
			throw this.httpErrors.notFound();
		}

		return user;
	},
} as RouteOptions;
