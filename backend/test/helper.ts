import { FastifyInstance } from 'fastify';
import { User } from '../models/user.model';
import { hashPassword } from '../utils/password';

// eslint-disable-next-line import/prefer-default-export
export async function createFakeUser(fastify: FastifyInstance, userData: Omit<User, 'id' | 'deposit'> | Omit<User, 'id'>) {
	const userInserted = await fastify.knex('users')
		.insert({
			username: userData.username,
			password: await hashPassword(userData.password),
			role:     userData.role,
			deposit:  (userData as Omit<User, 'id'>).deposit || 0,
		}).returning('*');

	const user = userInserted[0];
	const token = fastify.jwt.sign({ id: user.id });

	return {
		user,
		token,
	};
}
