import { Injectable } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class KafkaProducer {
    private readonly kafka = new Kafka({
        clientId: 'transaction-service',
        brokers: ['localhost:9092'],
    });

    private readonly producer = this.kafka.producer();

    async sendTransactionToAntiFraud(transaction: any): Promise<void> {
        await this.producer.send({
            topic: 'transaction-created',
            messages: [
                {
                    value: JSON.stringify(transaction),
                },
            ],
        });
    }
}
