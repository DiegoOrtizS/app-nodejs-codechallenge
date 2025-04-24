import { Injectable } from '@nestjs/common';
import { Transaction } from '../../domain/entities/transaction.entity';
import { KafkaProducer } from '../../infrastructure/kafka/kafka-producer';

@Injectable()
export class AntiFraudService {
  constructor(
    private readonly kafkaProducer: KafkaProducer,
  ) {}
  
  async validateTransaction(transaction: Transaction): Promise<void> {
    const result = transaction.value > 1000 ? 'rejected' : 'approved';
    await this.kafkaProducer.sendResult(result, transaction.transactionExternalId);
  }
}