import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter()
    );

    const config = new DocumentBuilder()
        .setTitle('Transaction Service')
        .setDescription('API for managing transactions')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/docs', app, document);

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
