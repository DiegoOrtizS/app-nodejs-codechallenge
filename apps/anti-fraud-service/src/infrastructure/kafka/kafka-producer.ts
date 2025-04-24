import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaProducer implements OnModuleInit {
  private readonly kafka = new Kafka({
    clientId: 'anti-fraud-producer',
    brokers: ['localhost:9092'],
  });

  private readonly producer: Producer = this.kafka.producer();

  async onModuleInit() {
    await this.producer.connect();
  }

  async sendResult(result: 'approved' | 'rejected', transactionExternalId: string) {
    await this.producer.send({
      topic: 'transaction-validated',
      messages: [
        {
          value: JSON.stringify({
            transactionExternalId,
            status: result,
          }),
        },
      ],
    });
  }
}
