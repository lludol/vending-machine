import {
	expect, test, describe,
} from 'vitest';
import app from './app';
import { createFakeUser } from './helper';

describe('/users/:id PUT 200', () => {
	test('We can update our username', async () => {
		const { user, token } = await createFakeUser(app, {
			username: 'userUpdate200Test',
			password: 'helloWorld!',
			role:     'buyer',
		});
		const newUsername = 'userUpdateTest42';

		const response = await app.inject({
			method:  'PUT',
			url:     `/users/${user.id}`,
			payload: {
				username: newUsername,
			},
			headers: {
				authorization: `Bearer ${token}`,
			},
		});

		expect(response.statusCode).toBe(200);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		expect(response.json()).toMatchObject({
			id:       user.id,
			username: newUsername,
			role:     user.role,
			deposit:  user.deposit,
		});
		expect(app.knex('users').where('id', user.id).first()).resolves.toHaveProperty('username', newUsername);
	});
});

describe('/users/:id PUT 400', () => {
	test('Return an error when payload is invalid', async () => {
		const { user, token } = await createFakeUser(app, {
			username: 'userUpdate400Test',
			password: 'helloWorld!',
			role:     'seller',
		});

		const response = await app.inject({
			method:  'PUT',
			url:     `/users/${user.id}`,
			payload: {
				hello: 'world',
			},
			headers: {
				authorization: `Bearer ${token}`,
			},
		});

		expect(response.statusCode).toBe(400);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
	});

	test('Return an error when username is not available', async () => {
		const { user, token } = await createFakeUser(app, {
			username: 'userUpdate400Available',
			password: 'helloWorld!',
			role:     'seller',
		});
		const { user: user2 } = await createFakeUser(app, {
			username: 'userUpdate400NotAvailable',
			password: 'helloWorld!',
			role:     'seller',
		});

		const response = await app.inject({
			method:  'PUT',
			url:     `/users/${user.id}`,
			payload: {
				username: user2.username,
			},
			headers: {
				authorization: `Bearer ${token}`,
			},
		});

		expect(response.statusCode).toBe(400);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		expect(response.json()).toMatchObject({
			error:      'Bad Request',
			statusCode: 400,
			message:    'USERNAME_EXISTS',
		});
	});
});

describe('/users/:id PUT 404', () => {
	test('Return an error when trying to update a user that doesn\'t exist', async () => {
		const { user, token } = await createFakeUser(app, {
			username: 'userUpdate404Test',
			password: 'helloWorld!',
			role:     'buyer',
		});
		await app.knex('users').delete().where('id', user.id);

		const response = await app.inject({
			method:  'PUT',
			url:     `/users/${user.id}`,
			payload: {
				username: user.username,
			},
			headers: {
				authorization: `Bearer ${token}`,
			},
		});

		expect(response.statusCode).toBe(404);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
	});
});

describe('/users/:id PUT 403', () => {
	test('Return an error when trying another user', async () => {
		const { user, token } = await createFakeUser(app, {
			username: 'userUpdate403Test',
			password: 'helloWorld!',
			role:     'buyer',
		});
		const newUsername = 'userUpdateTest42';

		const response = await app.inject({
			method:  'PUT',
			url:     `/users/${user.id + 1}`,
			payload: {
				username: newUsername,
			},
			headers: {
				authorization: `Bearer ${token}`,
			},
		});

		expect(response.statusCode).toBe(403);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
	});
});
