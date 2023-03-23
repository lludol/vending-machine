import type { FastifyRequest, RouteOptions } from 'fastify';
import type { FromSchema } from 'json-schema-to-ts';
import { getUserById } from '../../../models/user.model';

const paramsJsonSchema = {
	oneOf: [
		{
			type:       'object',
			properties: {
				id: { type: 'number' },
			},
			required:             ['id'],
			additionalProperties: false,
		},
		{
			type:       'object',
			properties: {
				id: { type: 'string', enum: ['me'] },
			},
			required:             ['id'],
			additionalProperties: false,
		},
	],
} as const;

const schema = {
	params: paramsJsonSchema,
};

type CustomRequest = FastifyRequest<{
	Params: FromSchema<typeof paramsJsonSchema>
}>

export default {
	method: 'GET',
	url:    '/',
	schema,
	onRequest(request) {
		return this.authenticate(request);
	},
	async handler(request: CustomRequest) {
		const { id: paramId } = request.params;
		const { id: userId } = request.user;

		let user = null;
		if (paramId === 'me') {
			user = await getUserById(this.knex, userId);
		} else {
			user = await getUserById(this.knex, paramId);
		}

		if (!user) {
			throw this.httpErrors.notFound();
		}

		return user;
	},
} as RouteOptions;
