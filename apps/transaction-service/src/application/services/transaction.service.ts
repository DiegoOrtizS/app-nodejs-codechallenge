import { Inject, Injectable } from '@nestjs/common';
import { TransactionRepositoryPort } from '../ports/transaction-repository.port';
import { CreateTransactionDto } from '../../dto/create-transaction.dto';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionStatus } from '../../domain/value-objects/transaction-status.vo';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('TransactionRepositoryPort')
    private readonly repository: TransactionRepositoryPort,
  ) {}
  
  async createTransaction(dto: CreateTransactionDto): Promise<Transaction> {
    const status = dto.value > 1000
      ? TransactionStatus.rejected()
      : TransactionStatus.pending();

    const transaction = new Transaction(
      crypto.randomUUID(),
      dto.accountExternalIdDebit,
      dto.accountExternalIdCredit,
      dto.value,
      status
    );

    await this.repository.save(transaction);
    return transaction;
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    return this.repository.findById(id);
  }
}
