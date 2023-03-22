import {
	expect, test, describe,
} from 'vitest';
import app from './app';
import { createFakeUser } from './helper';

describe('/users/:id GET 200', () => {
	test('Get an user', async () => {
		const { user, token } = await createFakeUser(app, {
			username: 'userGetTest',
			password: 'helloWorld!',
			role:     'seller',
		});

		const response = await app.inject({
			method:  'GET',
			url:     `/users/${user.id}`,
			headers: {
				authorization: `Bearer ${token}`,
			},
		});

		expect(response.statusCode).toBe(200);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		expect(response.json()).toMatchObject({
			id:       user.id,
			username: user.username,
			role:     user.role,
			deposit:  user.deposit,
		});
	});
});

describe('/users/:id GET 401', () => {
	test('Return an error if the token is invalid', async () => {
		const response = await app.inject({
			method:  'GET',
			url:     '/users/42',
			headers: {
				authorization: 'Bearer fakeToken',
			},
		});

		expect(response.statusCode).toBe(401);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
	});
});

describe('/users/:id GET 404', () => {
	test('Return an error if the user doesn\'t exist', async () => {
		const { token } = await createFakeUser(app, {
			username: 'userGet404Test',
			password: 'helloWorld!',
			role:     'seller',
		});

		const response = await app.inject({
			method:  'GET',
			url:     '/users/10000',
			headers: {
				authorization: `Bearer ${token}`,
			},
		});

		expect(response.statusCode).toBe(404);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
	});
});
