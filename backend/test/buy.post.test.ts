import knex from 'knex';
import {
	expect, test, describe,
} from 'vitest';
import app from './app';
import { createFakeUser } from './helper';
import { createProduct } from '../models/product.model';

describe('/buy POST 200', () => {
	test('Buy a product', async () => {
		const { token } = await createFakeUser(app, {
			username: 'userBuy200Buyer',
			password: 'helloWorld!',
			role:     'buyer',
			deposit:  20,
		});
		const { user } = await createFakeUser(app, {
			username: 'userBuy200Seller',
			password: 'helloWorld!',
			role:     'seller',
		});
		const product = await createProduct(app.knex, {
			cost:            10,
			productName:     'productBuy200',
			sellerId:        user.id,
			amountAvailable: 10,
		});

		const response = await app.inject({
			method:  'POST',
			url:     '/buy',
			headers: {
				authorization: `Bearer ${token}`,
			},
			payload: {
				productId: product.id,
				amount:    1,
			},
		});

		expect(response.statusCode).toBe(200);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		expect(response.json()).toMatchObject({
			totalSpent:      10,
			productsBought:  1,
			remainingChange: [10],
		});
	});
});

describe('/buy POST 403', () => {
	test('Return an error if user has not the right role', async () => {
		const { token } = await createFakeUser(app, {
			username: 'userBuy403',
			password: 'helloWorld!',
			role:     'seller',
		});

		const response = await app.inject({
			method:  'POST',
			url:     '/buy',
			headers: {
				authorization: `Bearer ${token}`,
			},
			payload: {
				productId: 1,
				amount:    1,
			},
		});

		expect(response.statusCode).toBe(403);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
	});
});

describe('/buy POST 401', () => {
	test('Return an error if token is invalid', async () => {
		const { user, token } = await createFakeUser(app, {
			username: 'userBuy401',
			password: 'helloWorld!',
			role:     'buyer',
		});

		await app.knex('users').where('id', user.id).delete();

		const response = await app.inject({
			method:  'POST',
			url:     '/buy',
			headers: {
				authorization: `Bearer ${token}`,
			},
			payload: {
				productId: 1,
				amount:    1,
			},
		});

		expect(response.statusCode).toBe(401);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
	});
});
