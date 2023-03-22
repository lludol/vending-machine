import {
	expect, test, describe,
} from 'vitest';
import app from './app';

describe('/users POST 200', () => {
	test('Create an user with role=seller', async () => {
		const response = await app.inject({
			method:  'POST',
			url:     '/users',
			payload: {
				username: 'sellerUsername',
				password: 'helloWorld!',
				role:     'seller',
			},
		});

		expect(response.statusCode).toBe(200);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		expect(response.json()).toMatchObject({});
		expect(app.knex('users').where({ username: 'sellerUsername' }).first())
			.resolves
			.toMatchObject(expect.objectContaining({
				username: 'sellerUsername',
				role:     'seller',
			}));
	});

	test('Create an user with role=buyer', async () => {
		const response = await app.inject({
			method:  'POST',
			url:     '/users',
			payload: {
				username: 'buyerUsername',
				password: 'helloWorld!',
				role:     'buyer',
			},
		});

		expect(response.statusCode).toBe(200);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		expect(response.json()).toMatchObject({});
		expect(app.knex('users').where({ username: 'buyerUsername' }).first())
			.resolves
			.toMatchObject(expect.objectContaining({
				username: 'buyerUsername',
				role:     'buyer',
			}));
	});
});

describe('/users POST 400', () => {
	test('Return an error if username exists', async () => {
		const response = await app.inject({
			method:  'POST',
			url:     '/users',
			payload: {
				username: 'sellerUsername',
				password: 'helloWorld!',
				role:     'seller',
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

	test('Return an error if role is invalid', async () => {
		const response = await app.inject({
			method:  'POST',
			url:     '/users',
			payload: {
				username: 'sellerUsername',
				password: 'helloWorld!',
				role:     'test',
			},
		});

		expect(response.statusCode).toBe(400);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		expect(response.json()).toMatchObject(expect.objectContaining({
			statusCode: 400,
			error:      'Bad Request',
		}));
	});

	test('Return an error if username too small', async () => {
		const response = await app.inject({
			method:  'POST',
			url:     '/users',
			payload: {
				username: 'a',
				password: 'helloWorld!',
				role:     'seller',
			},
		});

		expect(response.statusCode).toBe(400);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		expect(response.json()).toMatchObject(expect.objectContaining({
			statusCode: 400,
			error:      'Bad Request',
		}));
	});

	test('Return an error if username too big', async () => {
		const response = await app.inject({
			method:  'POST',
			url:     '/users',
			payload: {
				username: new Array(42).join('A'),
				password: 'helloWorld!',
				role:     'seller',
			},
		});

		expect(response.statusCode).toBe(400);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		expect(response.json()).toMatchObject(expect.objectContaining({
			statusCode: 400,
			error:      'Bad Request',
		}));
	});

	test('Return an error if password too small', async () => {
		const response = await app.inject({
			method:  'POST',
			url:     '/users',
			payload: {
				username: 'sellerUsername',
				password: 'abc',
				role:     'seller',
			},
		});

		expect(response.statusCode).toBe(400);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		expect(response.json()).toMatchObject(expect.objectContaining({
			statusCode: 400,
			error:      'Bad Request',
		}));
	});

	test('Return an error if password too big', async () => {
		const response = await app.inject({
			method:  'POST',
			url:     '/users',
			payload: {
				username: 'sellerUsername',
				password: new Array(42).join('A'),
				role:     'seller',
			},
		});

		expect(response.statusCode).toBe(400);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		expect(response.json()).toMatchObject(expect.objectContaining({
			statusCode: 400,
			error:      'Bad Request',
		}));
	});
});
