import {
	expect, test, describe,
} from 'vitest';
import app from './app';
import { createFakeUser } from './helper';

describe('/users GET 200', () => {
	test('Get all users', async () => {
		const { user, token } = await createFakeUser(app, {
			username: 'userGetTest',
			password: 'helloWorld!',
			role:     'seller',
		});

		const response = await app.inject({
			method:  'GET',
			url:     '/users',
			headers: {
				authorization: `Bearer ${token}`,
			},
		});

		expect(response.statusCode).toBe(200);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		expect(response.json().length).toBeGreaterThanOrEqual(1);

		const userCreated = response.json().find((u: any) => u.id === user.id);
		expect(userCreated).toMatchObject({
			id:       user.id,
			username: user.username,
			role:     user.role,
			deposit:  user.deposit,
		});
	});
});

describe('/users GET 401', () => {
	test('Return an error if the token is invalid', async () => {
		const response = await app.inject({
			method:  'GET',
			url:     '/users',
			headers: {
				authorization: 'Bearer fakeToken',
			},
		});

		expect(response.statusCode).toBe(401);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
	});
});
