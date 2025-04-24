import { Inject, Injectable } from '@nestjs/common';
import { TransactionRepositoryPort } from '../ports/transaction-repository.port';
import { CreateTransactionDto } from '../../dto/create-transaction.dto';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionStatus, TransactionStatusEnum } from '../../domain/value-objects/transaction-status.vo';
import { KafkaProducer } from '../../infrastructure/kafka/kafka-producer';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('TransactionRepositoryPort')
    private readonly repository: TransactionRepositoryPort,
    private readonly kafkaProducer: KafkaProducer,
  ) {}
  
  async createTransaction(dto: CreateTransactionDto): Promise<Transaction> {
    const transaction = new Transaction(
      crypto.randomUUID(),
      dto.accountExternalIdDebit,
      dto.accountExternalIdCredit,
      dto.value,
      TransactionStatus.pending(),
    );

    await this.repository.save(transaction);
    await this.kafkaProducer.sendTransactionToAntiFraud(transaction);
    return transaction;
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    return this.repository.findById(id);
  }

  async updateStatus(transactionId: string, status: string): Promise<void> {
    if (status === TransactionStatusEnum.PENDING) {
      console.warn('Cannot update status to pending');
      return;
    }
    const transaction = await this.repository.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction ${transactionId} not found`);
      return;
    }
  
    transaction.status = status === TransactionStatusEnum.APPROVED ? TransactionStatus.approved() : TransactionStatus.rejected();
    await this.repository.update(transaction);
  }
}
