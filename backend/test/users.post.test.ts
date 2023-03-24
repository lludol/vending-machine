import {
	expect, test, describe,
} from 'vitest';
import app from './app';
import { createFakeUser } from './helper';

describe('/users POST 200', () => {
	test('Create an user with role=seller', async () => {
		const response = await app.inject({
			method:  'POST',
			url:     '/users',
			payload: {
				username:      'sellerUsername',
				password:      'helloWorld!',
				passwordCheck: 'helloWorld!',
				role:          'seller',
			},
		});

		const userCreated = await app.knex('users').where({ username: 'sellerUsername' }).first();

		expect(response.statusCode).toBe(200);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		expect(response.json()).toMatchObject({});
		expect(userCreated).toMatchObject({
			id:       userCreated.id,
			username: 'sellerUsername',
			role:     'seller',
			deposit:  0,
		});
	});

	test('Create an user with role=buyer', async () => {
		const response = await app.inject({
			method:  'POST',
			url:     '/users',
			payload: {
				username:      'buyerUsername',
				password:      'helloWorld!',
				passwordCheck: 'helloWorld!',
				role:          'buyer',
			},
		});

		const userCreated = await app.knex('users').where({ username: 'buyerUsername' }).first();

		expect(response.statusCode).toBe(200);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		expect(response.json()).toMatchObject({});
		expect(userCreated).toMatchObject({
			id:       userCreated.id,
			username: 'buyerUsername',
			role:     'buyer',
			deposit:  0,
		});
	});
});

describe('/users POST 400', () => {
	test('Return an error if username exists', async () => {
		const { user } = await createFakeUser(app, {
			username: 'userPostExist',
			password: 'helloWorld!',
			role:     'seller',
		});
		const response = await app.inject({
			method:  'POST',
			url:     '/users',
			payload: {
				username:      user.username,
				password:      'helloWorld!',
				passwordCheck: 'helloWorld!',
				role:          'seller',
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

	test('Return an error if password doesn\'t match', async () => {
		const response = await app.inject({
			method:  'POST',
			url:     '/users',
			payload: {
				username:      'sellerUsernamePassword',
				password:      'helloWorld!',
				passwordCheck: 'helloWorld!42',
				role:          'seller',
			},
		});

		expect(response.statusCode).toBe(400);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		expect(response.json()).toMatchObject({
			error:      'Bad Request',
			statusCode: 400,
			message:    'PASSWORDS_NOT_MATCH',
		});
	});

	test('Return an error if role is invalid', async () => {
		const response = await app.inject({
			method:  'POST',
			url:     '/users',
			payload: {
				username:      'sellerUsername',
				password:      'helloWorld!',
				passwordCheck: 'helloWorld!',
				role:          'test',
			},
		});

		expect(response.statusCode).toBe(400);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
	});

	test('Return an error if username too small', async () => {
		const response = await app.inject({
			method:  'POST',
			url:     '/users',
			payload: {
				username:      'a',
				password:      'helloWorld!',
				passwordCheck: 'helloWorld!',
				role:          'seller',
			},
		});

		expect(response.statusCode).toBe(400);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
	});

	test('Return an error if username too big', async () => {
		const response = await app.inject({
			method:  'POST',
			url:     '/users',
			payload: {
				username:      new Array(42).join('A'),
				password:      'helloWorld!',
				passwordCheck: 'helloWorld!',
				role:          'seller',
			},
		});

		expect(response.statusCode).toBe(400);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
	});

	test('Return an error if password too small', async () => {
		const response = await app.inject({
			method:  'POST',
			url:     '/users',
			payload: {
				username:      'sellerUsername',
				password:      'abc',
				passwordCheck: 'abc',
				role:          'seller',
			},
		});

		expect(response.statusCode).toBe(400);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
	});

	test('Return an error if password too big', async () => {
		const response = await app.inject({
			method:  'POST',
			url:     '/users',
			payload: {
				username:      'sellerUsername',
				password:      new Array(42).join('A'),
				passwordCheck: new Array(42).join('A'),
				role:          'seller',
			},
		});

		expect(response.statusCode).toBe(400);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
	});
});
