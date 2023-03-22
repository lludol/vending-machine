import {
	expect, test, describe,
} from 'vitest';
import app from './app';
import { createFakeUser } from './helper';

describe('/users/:id DELETE 200', () => {
	test('Delete an user', async () => {
		const { user, token } = await createFakeUser(app, {
			username: 'userDeleteTest',
			password: 'helloWorld!',
			role:     'buyer',
		});

		const response = await app.inject({
			method:  'DELETE',
			url:     `/users/${user.id}`,
			headers: {
				authorization: `Bearer ${token}`,
			},
		});

		expect(response.statusCode).toBe(200);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		expect(response.json()).toMatchObject({
			id: user.id,
		});
		expect(app.knex('users').where('id', user.id).first()).resolves.toBeUndefined();
	});
});

describe('/users/:id DELETE 403', () => {
	test('Return an error if we try to delete another user', async () => {
		const { user, token } = await createFakeUser(app, {
			username: 'userDelete403Test',
			password: 'helloWorld!',
			role:     'seller',
		});

		const response = await app.inject({
			method:  'DELETE',
			url:     `/users/${user.id + 1}`,
			headers: {
				authorization: `Bearer ${token}`,
			},
		});

		expect(response.statusCode).toBe(403);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
	});
});
