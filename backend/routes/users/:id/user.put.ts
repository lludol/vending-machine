import type { FastifyRequest, RouteOptions } from 'fastify';
import type { FromSchema } from 'json-schema-to-ts';
import { getUserById, updateUserById, User } from '../../../models/user.model';
import { hashPassword } from '../../../utils/password';

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
		username: { type: 'string', minLength: 3, maxLength: 30 },
		password: { type: 'string', minLength: 8, maxLength: 30 },
	},
	additionalProperties: false,
	minProperties:        1,
} as const;

const schema = {
	body:   bodyJsonSchema,
	params: paramsJsonSchema,
};

type CustomRequest = FastifyRequest<{
	Body: FromSchema<typeof bodyJsonSchema>
	Params: FromSchema<typeof paramsJsonSchema>
}>

export default {
	method: 'PUT',
	url:    '/',
	schema,
	onRequest(request) {
		return this.authenticate(request);
	},
	async handler(request: CustomRequest) {
		const { id: paramId } = request.params;
		const { id: userId } = request.user;
		const { body } = request;

		if (paramId	!== userId) {
			throw this.httpErrors.forbidden();
		}

		const user = await getUserById(this.knex, userId);

		if (!user) {
			throw this.httpErrors.notFound();
		}

		try {
			const userUpdated = await updateUserById(this.knex, userId, {
				username: body.username,
				password: body.password ? await hashPassword(body.password) : undefined,
			} as Partial<User>);

			return userUpdated;
		} catch {
			throw this.httpErrors.badRequest('USERNAME_EXISTS');
		}
	},
} as RouteOptions;
