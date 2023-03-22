import build from './app';

const start = async () => {
	const app = build({
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
				removeAdditional: false,
			},
		},
	});

	try {
		await app.ready();
		await app.listen({
			port: app.config.PORT,
			host: app.config.HOST,
		});
	} catch (error) {
		app.log.error(error);
		process.exit(1);
	}
};

start();
