import fastifyEnv from '@fastify/env';
import fastifySensible from '@fastify/sensible';
import Fastify from 'fastify';
import type { FastifyServerOptions } from 'fastify';
import fastifyAutoload from '@fastify/autoload';
import path from 'path';

const build = (options: FastifyServerOptions = {}) => {
	const envSchema = {
		type:       'object',
		required:   ['PORT'],
		properties: {
			NODE_ENV:   { type: 'string', default: 'development', enum: ['development', 'production', 'test'] },
			PORT:       { type: 'number', default: 4000 },
			HOST:       { type: 'string', default: '0.0.0.0' },
			JWT_SECRET: { type: 'string', default: 'y5B7&f9q&EXF6j@E' },
		},
	};

	const app = Fastify(options);

	app.register(fastifyEnv, {
		dotenv: true,
		schema: envSchema,
	});

	app.register(fastifySensible);

	app.register(fastifyAutoload, {
		dir:      path.join(__dirname, 'plugins'),
		forceESM: process.env.NODE_ENV === 'test',
	});

	app.register(fastifyAutoload, {
		dir:      path.join(__dirname, 'routes'),
		forceESM: process.env.NODE_ENV === 'test',
	});

	return app;
};

export default build;
