import type { FastifyRequest, RouteOptions } from 'fastify';
import type { FromSchema } from 'json-schema-to-ts';
import { createProduct } from '../../models/product.model';

const bodyJsonSchema = {
	type:       'object',
	properties: {
		amountAvailable: { type: 'number', minimum: 1 },
		cost:            { type: 'number', minimum: 1 },
		productName:     { type: 'string', minLength: 3, maxLength: 42 },
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
	async handler(request: CustomRequest) {
		const { body } = request;
		const { id } = request.user;

		try {
			const productCreated = await createProduct(this.knex, {
				amountAvailable: body.amountAvailable,
				cost:            body.cost,
				productName:     body.productName,
				sellerId:        id,
			});
			return productCreated;
		} catch (error) {
			if (error && (error as {code: string}).code === 'SQLITE_CONSTRAINT_UNIQUE') {
				throw this.httpErrors.badRequest('PRODUCT_EXISTS');
			} else {
				throw error;
			}
		}
	},
} as RouteOptions;
