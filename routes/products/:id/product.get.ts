import type { FastifyRequest, RouteOptions } from 'fastify';
import type { FromSchema } from 'json-schema-to-ts';
import { getProductById } from '../../../models/product.model';

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
	method: 'GET',
	url:    '/',
	schema,
	onRequest(request) {
		return this.authenticate(request);
	},
	async handler(request: CustomRequest) {
		const { id: paramId } = request.params;

		const product = await getProductById(this.knex, paramId);

		if (!product) {
			throw this.httpErrors.notFound();
		}

		return product;
	},
} as RouteOptions;
