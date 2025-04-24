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
            brokers: ['localhost:9092'],
        },
        consumer: {
            groupId: 'transaction-validator-consumer',
        },
        },
    });

    await app.startAllMicroservices();
    await app.listen(3000);
}
bootstrap();
