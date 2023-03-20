import type { FastifyRequest, RouteOptions } from 'fastify';
import type { FromSchema } from 'json-schema-to-ts';
import { updateUserById } from '../models/user.model';

const bodyJsonSchema = {
	type: 'object',
} as const;

const schema = {
	body: bodyJsonSchema,
};

type CustomRequest = FastifyRequest<{
	Body: FromSchema<typeof bodyJsonSchema>
}>

export default {
	method: 'POST',
	url:    '/reset',
	schema,
	onRequest(request) {
		return this.authenticate(request, 'buyer');
	},
	async handler(request: CustomRequest) {
		const { id } = request.user;

		const userUpdated = await updateUserById(this.knex, id, {
			deposit: 0,
		});

		if (!userUpdated) {
			throw this.httpErrors.notFound();
		}

		return {
			deposit: userUpdated.deposit,
		};
	},
} as RouteOptions;
