import type { FastifyRequest, RouteOptions } from 'fastify';
import type { FromSchema } from 'json-schema-to-ts';
import { updateUserDeposity } from '../models/user.model';

const bodyJsonSchema = {
	type:       'object',
	properties: {
		deposit: { type: 'number', enum: [5, 10, 20, 50, 100] },
	},
	required:             ['deposit'],
	additionalProperties: false,
} as const;

const schema = {
	body: bodyJsonSchema,
};

type CustomRequest = FastifyRequest<{
	Body: FromSchema<typeof bodyJsonSchema>
}>

export default {
	method: 'POST',
	url:    '/deposit',
	schema,
	onRequest(request) {
		return this.authenticate(request, 'buyer');
	},
	async handler(request: CustomRequest) {
		const { body } = request;
		const { id } = request.user;

		const userUpdated = await updateUserDeposity(this.knex, id, body.deposit);

		if (!userUpdated) {
			throw this.httpErrors.notFound();
		}

		return {
			deposit: userUpdated.deposit,
		};
	},
} as RouteOptions;
