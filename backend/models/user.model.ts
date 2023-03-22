import type { Knex } from 'knex';

export type Role = 'seller' | 'buyer';

export interface User {
	id: number;
	username: string;
	password: string;
	deposit: number;
	role: Role;
}

export const publicUserFields = ['id', 'username', 'deposit', 'role'] as const;

export const getUsers = (knex: Knex) => knex<User[]>('users').select(publicUserFields);

export const getUserByUsername = (knex: Knex, username: string) => knex<User>('users')
	.select(publicUserFields)
	.where('username', username)
	.first();

export const getUserById = (knex: Knex, id: number) => knex
	.select(publicUserFields)
	.from('users')
	.where('id', id)
	.first();

export const createUser = async (knex: Knex, data: Omit<User, 'id'>) => {
	const userCreated = await knex<User>('users')
		.insert(data)
		.returning(publicUserFields);

	return userCreated && userCreated.length > 0 ? userCreated[0] : null;
};

export const updateUserById = async (knex: Knex, id: number, data: Partial<User>) => {
	const userUpdated = await knex<User>('users')
		.update(data)
		.where('id', id)
		.returning(publicUserFields);

	return userUpdated && userUpdated.length > 0 ? userUpdated[0] : null;
};

export const updateUserDeposity = async (knex: Knex, id: number, deposit: number) => {
	const userUpdated = await knex<User>('users')
		.update({
			deposit: knex.raw('deposit + ?', [deposit]),
		})
		.where('id', id)
		.returning(publicUserFields);

	return userUpdated && userUpdated.length > 0 ? userUpdated[0] : null;
};

export const deleteUserById = (knex: Knex, id: number) => knex<User>('users')
	.delete()
	.where('id', id);
