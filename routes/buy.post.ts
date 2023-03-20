import type { FastifyRequest, RouteOptions } from 'fastify';
import type { FromSchema } from 'json-schema-to-ts';
import { getProductById, updateProductById } from '../models/product.model';
import { getUserById, updateUserById } from '../models/user.model';
import { convertChangeToCoins } from '../utils/money';

const bodyJsonSchema = {
	type:       'object',
	properties: {
		productId: { type: 'number', minimum: 1 },
		amount:    { type: 'number', minimum: 1 },
	},
	required: ['productId', 'amount'],
} as const;

const schema = {
	body: bodyJsonSchema,
};

type CustomRequest = FastifyRequest<{
	Body: FromSchema<typeof bodyJsonSchema>
}>

export default {
	method: 'POST',
	url:    '/buy',
	schema,
	onRequest(request) {
		return this.authenticate(request, 'buyer');
	},
	async handler(request: CustomRequest) {
		const { body } = request;
		const { id } = request.user;

		const product = await getProductById(this.knex, body.productId);
		const user = await getUserById(this.knex, id);

		if (!product || !user) {
			throw this.httpErrors.notFound();
		}

		const cost = product.cost * body.amount;
		if (user.deposit < cost || body.amount > product.amountAvailable) {
			throw this.httpErrors.badRequest();
		}
		const remainingChange = convertChangeToCoins(user.deposit - cost);

		await updateProductById(this.knex, body.productId, {
			amountAvailable: product.amountAvailable - body.amount,
		});
		await updateUserById(this.knex, id, {
			deposit: user.deposit - cost,
		});

		return {
			totalSpent:     cost,
			productsBought: body.amount,
			remainingChange,
		};
	},
} as RouteOptions;
