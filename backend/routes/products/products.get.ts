import type { RouteOptions } from 'fastify';
import { getProducts } from '../../models/product.model';
import { getUserById } from '../../models/user.model';

export default {
	method: 'GET',
	url:    '/',
	onRequest(request) {
		return this.authenticate(request);
	},
	async handler(request) {
		const { id } = request.user;

		const user = await getUserById(this.knex, id);

		if (!user) {
			throw this.httpErrors.notFound();
		}

		return getProducts(this.knex);
	},
} as RouteOptions;
