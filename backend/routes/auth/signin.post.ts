import type { FastifyRequest, RouteOptions } from 'fastify';
import type { FromSchema } from 'json-schema-to-ts';
import { getUserByUsername } from '../../models/user.model';
import { comparePassword } from '../../utils/password';

const bodyJsonSchema = {
	type:       'object',
	properties: {
		username: { type: 'string', minLength: 3, maxLength: 30 },
		password: { type: 'string', minLength: 8, maxLength: 30 },
	},
	required: ['username', 'password'],
} as const;

const schema = {
	body: bodyJsonSchema,
};

type CustomRequest = FastifyRequest<{
	Body: FromSchema<typeof bodyJsonSchema>
}>

export default {
	method: 'POST',
	url:    '/signin',
	schema,
	async handler(request: CustomRequest) {
		const { body } = request;

		const user = await getUserByUsername(this.knex, body.username);

		if (!user || !await comparePassword(body.password, user.password)) {
			throw this.httpErrors.badRequest();
		}

		const token = this.jwt.sign({
			id: user.id,
		});

		return {
			token,
		};
	},
} as RouteOptions;
