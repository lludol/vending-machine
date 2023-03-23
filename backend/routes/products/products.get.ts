import type { RouteOptions } from 'fastify';
import { getProducts, getProductsAvailable } from '../../models/product.model';
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

		if (user.role === 'buyer') {
			return getProductsAvailable(this.knex);
		}

		return getProducts(this.knex);
	},
} as RouteOptions;
