import type { RouteOptions } from 'fastify';
import { getUsers } from '../../models/user.model';

export default {
	method: 'GET',
	url:    '/',
	onRequest(request) {
		return this.authenticate(request);
	},
	handler() {
		return getUsers(this.knex);
	},
} as RouteOptions;
