import type { FastifyRequest, RouteOptions } from 'fastify';
import type { FromSchema } from 'json-schema-to-ts';
import { getProductById, updateProductById } from '../../../models/product.model';

const paramsJsonSchema = {
	type:       'object',
	properties: {
		id: { type: 'number' },
	},
	required:             ['id'],
	additionalProperties: false,
} as const;

const bodyJsonSchema = {
	type:       'object',
	properties: {
		amountAvailable: { type: 'number', minimum: 1 },
		cost:            { type: 'number', minimum: 0 },
		productName:     { type: 'string', minLength: 3, maxLength: 255 },
	},
	minProperties: 1,
} as const;

const schema = {
	body:   bodyJsonSchema,
	params: paramsJsonSchema,
};

type CustomRequest = FastifyRequest<{
	Body: FromSchema<typeof bodyJsonSchema>;
	Params: FromSchema<typeof paramsJsonSchema>
}>

export default {
	method: 'PUT',
	url:    '/',
	schema,
	onRequest(request) {
		return this.authenticate(request, 'seller');
	},
	async handler(request: CustomRequest) {
		const { body } = request;
		const { id: userId } = request.user;
		const { id: productId } = request.params;

		const product = await getProductById(this.knex, productId);

		if (!product) {
			throw this.httpErrors.notFound();
		} if (product.sellerId !== userId) {
			throw this.httpErrors.unauthorized();
		}

		return updateProductById(this.knex, productId, body);
	},
} as RouteOptions;
