import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: "anti-fraud-service",
          brokers: ["kafka:29092"],
        },
        consumer: {
          groupId: "anti-fraud-consumer",
          sessionTimeout: 30000,
          rebalanceTimeout: 30000,
          heartbeatInterval: 3000,
        },
      },
    },
  );

  await app.listen();
}
bootstrap();
