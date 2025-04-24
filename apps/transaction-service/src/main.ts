import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, new FastifyAdapter());
    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.KAFKA,
        options: {
        client: {
            clientId: 'transaction-service',
            brokers: ['kafka:29092'],
        },
        consumer: {
            groupId: 'transaction-validator-consumer',
            sessionTimeout: 30000,
            rebalanceTimeout: 30000,
            heartbeatInterval: 3000,
        },
        },
    });

    await app.startAllMicroservices();
    await app.listen(3000);
}
bootstrap();
