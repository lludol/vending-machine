import Fastify from 'fastify';
import fastifyEnv from '@fastify/env';
import fastifyAutoLoad from '@fastify/autoload';
import path from 'path';
import fastifySensible from '@fastify/sensible';

const envSchema = {
	type:       'object',
	required:   ['PORT'],
	properties: {
		NODE_ENV:   { type: 'string', default: 'development', enum: ['development', 'production'] },
		PORT:       { type: 'number', default: 4000 },
		HOST:       { type: 'string', default: '0.0.0.0' },
		JWT_SECRET: { type: 'string', default: 'y5B7&f9q&EXF6j@E' },
	},
};

const server = Fastify({
	logger: process.env.NODE_ENV === 'production' ? true : {
		transport: {
			target:  'pino-pretty',
			options: {
				translateTime: 'HH:MM:ss Z',
				ignore:        'pid,hostname',
			},
		},
	},
	ajv: {
		customOptions: {
			strict:           true,
			useDefaults:      true,
			removeAdditional: 'all',
			addUsedSchema:    false,
			coerceTypes:      'array',
		},
	},
});

const start = async () => {
	try {
		await server.register(fastifyEnv, {
			dotenv: true,
			schema: envSchema,
		});

		await server.register(fastifySensible);

		await server.register(fastifyAutoLoad, {
			dir: path.join(__dirname, 'plugins'),
		});

		await server.register(fastifyAutoLoad, {
			dir: path.join(__dirname, 'routes'),
		});

		await server.listen({
			port: server.config.PORT,
			host: server.config.HOST,
		});
	} catch (error) {
		server.log.error(error);
		process.exit(1);
	}
};

start();
