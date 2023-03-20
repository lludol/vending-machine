import type { FastifyRequest, RouteOptions } from 'fastify';
import type { FromSchema } from 'json-schema-to-ts';
import { deleteProductBySellerId } from '../../../models/product.model';
import { deleteUserById } from '../../../models/user.model';

const paramsJsonSchema = {
	type:       'object',
	properties: {
		id: { type: 'number' },
	},
	required: ['id'],
} as const;

const schema = {
	params: paramsJsonSchema,
};

type CustomRequest = FastifyRequest<{
	Params: FromSchema<typeof paramsJsonSchema>
}>

export default {
	method: 'DELETE',
	url:    '/',
	schema,
	onRequest(request) {
		return this.authenticate(request);
	},
	async handler(request: CustomRequest) {
		const { id: paramId } = request.params;
		const { id: userId } = request.user;

		if (paramId	!== userId) {
			throw this.httpErrors.badRequest();
		}

		await deleteProductBySellerId(this.knex, userId);
		await deleteUserById(this.knex, userId);

		return {
			id: userId,
		};
	},
} as RouteOptions;
