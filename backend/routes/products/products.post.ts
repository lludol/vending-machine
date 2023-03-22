import type { FastifyRequest, RouteOptions } from 'fastify';
import type { FromSchema } from 'json-schema-to-ts';
import { createProduct } from '../../models/product.model';

const bodyJsonSchema = {
	type:       'object',
	properties: {
		amountAvailable: { type: 'number', minimum: 1 },
		cost:            { type: 'number', minimum: 0 },
		productName:     { type: 'string', minLength: 3, maxLength: 255 },
	},
	required:             ['amountAvailable', 'cost', 'productName'],
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
	url:    '/',
	schema,
	onRequest(request) {
		return this.authenticate(request, 'seller');
	},
	handler(request: CustomRequest) {
		const { body } = request;
		const { id } = request.user;

		return createProduct(this.knex, {
			amountAvailable: body.amountAvailable,
			cost:            body.cost,
			productName:     body.productName,
			sellerId:        id,
		});
	},
} as RouteOptions;
