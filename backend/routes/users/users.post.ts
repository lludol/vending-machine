import type { FastifyRequest, RouteOptions } from 'fastify';
import type { FromSchema } from 'json-schema-to-ts';
import { createUser, getUserByUsername } from '../../models/user.model';
import { hashPassword } from '../../utils/password';

const bodyJsonSchema = {
	type:       'object',
	properties: {
		username: { type: 'string', minLength: 3, maxLength: 30 },
		password: { type: 'string', minLength: 8, maxLength: 30 },
		role:  	  { type: 'string', enum: ['seller', 'buyer'] },
	},
	required:             ['username', 'password', 'role'],
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
	async handler(request: CustomRequest) {
		const { body } = request;

		const user = await getUserByUsername(this.knex, body.username);

		if (user) {
			throw this.httpErrors.badRequest('USERNAME_EXISTS');
		}

		await createUser(this.knex, {
			username: body.username,
			password: await hashPassword(body.password),
			deposit:  0,
			role:     body.role,
		});

		return {};
	},
} as RouteOptions;
