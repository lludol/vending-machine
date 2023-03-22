import { beforeAll, afterAll } from 'vitest';
import build from '../app';

const app = build({
	ajv: {
		customOptions: {
			removeAdditional: false,
		},
	},
});

beforeAll(async () => {
	await app.ready();
	await app.knex('products').truncate();
	await app.knex('users').truncate();
});

afterAll(async () => {
	await app.close();
});

export default app;
