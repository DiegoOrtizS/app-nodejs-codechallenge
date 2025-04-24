import { Injectable, OnModuleInit } from "@nestjs/common";
import { Kafka } from "kafkajs";
import { Transaction } from "../../domain/entities/transaction.entity";

@Injectable()
export class KafkaProducer implements OnModuleInit {
  private readonly kafka = new Kafka({
    clientId: "transaction-service",
    brokers: ["kafka:29092"],
  });

  private readonly producer = this.kafka.producer();

  async onModuleInit(): Promise<void> {
    await this.producer.connect();
  }

  async sendTransactionToAntiFraud(transaction: Transaction): Promise<void> {
    await this.producer.send({
      topic: "transaction-created",
      messages: [
        {
          value: JSON.stringify(transaction),
        },
      ],
    });
  }
}
