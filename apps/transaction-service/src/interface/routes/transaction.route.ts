import { FastifyInstance } from 'fastify';
import { CreateTransactionController } from '../controllers/create-transaction.controller';
import { GetTransactionController } from '../controllers/get-transaction.controller';
import { CreateTransactionSchema } from '../schemas/create-transaction.schema';
import { GetTransactionSchema } from '../schemas/get-transaction.schema';

export async function transactionRoutes(fastify: FastifyInstance) {
    fastify.post('/transactions', {
        schema: CreateTransactionSchema,
        handler: async (request, reply) => {
            const createTransactionController = new CreateTransactionController();
            return createTransactionController.handle(request, reply);
        }
    });

    fastify.get('/transactions/:transactionExternalId', {
        schema: GetTransactionSchema,
        handler: async (request, reply) => {
            const getTransactionController = new GetTransactionController();
            return getTransactionController.handle(request, reply);
        }
    });
}
