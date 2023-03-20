import type { FastifyRequest, RouteOptions } from 'fastify';
import type { FromSchema } from 'json-schema-to-ts';
import { deleteProductById, getProductById } from '../../../models/product.model';

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
		return this.authenticate(request, 'seller');
	},
	async handler(request: CustomRequest) {
		const { id: paramId } = request.params;
		const { id: userId } = request.user;

		const product = await getProductById(this.knex, paramId);

		if (!product) {
			throw this.httpErrors.notFound();
		} if (product.sellerId !== userId) {
			throw this.httpErrors.unauthorized();
		}

		await deleteProductById(this.knex, product.id);

		return {
			id: product.id,
		};
	},
} as RouteOptions;
