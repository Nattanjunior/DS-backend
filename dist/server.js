"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
require("dotenv/config");
const jwt_1 = __importDefault(require("@fastify/jwt"));
const rate_limit_1 = __importDefault(require("@fastify/rate-limit"));
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
const subjectRoutes_1 = require("./routes/subjectRoutes");
const studyRoutes_1 = require("./routes/studyRoutes");
const goalRoutes_1 = require("./routes/goalRoutes");
const noteRoutes_1 = require("./routes/noteRoutes");
const userRoutes_1 = require("./routes/userRoutes");
const authRoutes_1 = require("./routes/authRoutes");
const isDevelopment = process.env.NODE_ENV !== 'production';
const app = (0, fastify_1.default)({
    logger: isDevelopment
        ? {
            level: 'debug',
            transport: {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    translateTime: 'HH:MM:ss Z',
                    ignore: 'pid,hostname',
                },
            },
        }
        : {
            level: 'info',
            formatters: {
                level: (label) => ({ level: label }),
            },
        },
});
app.setValidatorCompiler(fastify_type_provider_zod_1.validatorCompiler);
app.setSerializerCompiler(fastify_type_provider_zod_1.serializerCompiler);
async function start() {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is required');
    }
    if (process.env.JWT_SECRET === 'CHANGE_ME_IN_PRODUCTION_USE_OPENSSL_RAND_HEX_32') {
        app.log.warn('WARNING: Using default JWT_SECRET. Change this in production!');
    }
    await app.register(rate_limit_1.default, {
        keyGenerator: (request) => {
            return request.user?.userId || request.ip;
        },
        max: 100,
        timeWindow: '10 minute',
        errorResponseBuilder: (request, context) => ({
            error: 'Too Many Requests',
            message: `Rate limit exceeded. Try again in ${context.after}`,
            statusCode: 429,
        }),
    });
    await app.register(cors_1.default, {
        origin: true,
    });
    await app.register(jwt_1.default, {
        secret: process.env.JWT_SECRET,
        sign: {
            expiresIn: "7d"
        }
    });
    await app.register(authRoutes_1.authRoutes, { prefix: '/auth' });
    await app.register(subjectRoutes_1.subjectRoutes, { prefix: '/subjects' });
    await app.register(studyRoutes_1.studyRoutes, { prefix: '/studies' });
    await app.register(goalRoutes_1.goalRoutes, { prefix: '/goals' });
    await app.register(noteRoutes_1.noteRoutes, { prefix: '/notes' });
    await app.register(userRoutes_1.userRoutes, { prefix: '/users' });
    app.get('/health', async (request, reply) => {
        const healthcheck = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
        };
        return reply.send(healthcheck);
    });
    const port = Number(process.env.PORT) || 3000;
    app.listen({ port }, (err) => {
        if (err) {
            app.log.error(err);
            process.exit(1);
        }
    });
}
start();
