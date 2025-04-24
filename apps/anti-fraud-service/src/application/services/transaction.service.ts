import { Injectable } from "@nestjs/common";
import { Transaction } from "../../domain/entities/transaction.entity";
import { KafkaProducer } from "../../infrastructure/kafka/kafka-producer";

@Injectable()
export class AntiFraudService {
  private readonly MAX_TRANSACTION_VALUE = 1000;

  constructor(private readonly kafkaProducer: KafkaProducer) {}

  async validateTransaction(transaction: Transaction): Promise<void> {
    const result =
      transaction.value > this.MAX_TRANSACTION_VALUE ? "rejected" : "approved";
    await this.kafkaProducer.sendResult(
      result,
      transaction.transactionExternalId,
    );
  }
}
