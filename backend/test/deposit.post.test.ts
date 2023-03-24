import {
	expect, test, describe,
} from 'vitest';
import app from './app';
import { createFakeUser } from './helper';

describe('/deposit POST 200', () => {
	test.each([
		[5],
		[10],
		[20],
		[50],
		[100],
	])('We can deposit %i to our account', async (deposit) => {
		const { user, token } = await createFakeUser(app, {
			username: `userDeposit_${deposit}`,
			password: 'helloWorld!',
			role:     'buyer',
		});

		const response = await app.inject({
			method:  'POST',
			url:     '/deposit',
			headers: {
				authorization: `Bearer ${token}`,
			},
			payload: {
				deposit,
			},
		});

		const userCreated = await app.knex('users').select('deposit').where('id', user.id).first();

		expect(response.statusCode).toBe(200);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		expect(response.json()).toMatchObject({
			deposit,
		});
		expect(userCreated).toMatchObject({
			deposit: user.deposit + deposit,
		});
	});
});

describe('/deposit POST 400', () => {
	test('Return an error if we try to insert invalid coin', async () => {
		const { token } = await createFakeUser(app, {
			username: 'userDeposit400',
			password: 'helloWorld!',
			role:     'buyer',
		});

		const response = await app.inject({
			method:  'POST',
			url:     '/deposit',
			headers: {
				authorization: `Bearer ${token}`,
			},
			payload: {
				deposit: 42,
			},
		});

		expect(response.statusCode).toBe(400);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
	});
});

describe('/deposit POST 403', () => {
	test('Return an error if user has not the right role', async () => {
		const { token } = await createFakeUser(app, {
			username: 'userDeposit403',
			password: 'helloWorld!',
			role:     'seller',
		});

		const response = await app.inject({
			method:  'POST',
			url:     '/deposit',
			headers: {
				authorization: `Bearer ${token}`,
			},
			payload: {
				deposit: 10,
			},
		});

		expect(response.statusCode).toBe(403);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
	});
});

describe('/deposit POST 401', () => {
	test('Return an error if token is invalid', async () => {
		const { user, token } = await createFakeUser(app, {
			username: 'userDeposit401',
			password: 'helloWorld!',
			role:     'buyer',
		});

		await app.knex('users').where('id', user.id).delete();

		const response = await app.inject({
			method:  'POST',
			url:     '/deposit',
			headers: {
				authorization: `Bearer ${token}`,
			},
			payload: {
				deposit: 10,
			},
		});

		expect(response.statusCode).toBe(401);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
	});
});
