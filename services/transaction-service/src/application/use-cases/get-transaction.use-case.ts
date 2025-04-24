import { Injectable } from '@nestjs/common';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionService } from '../services/transaction.service';

@Injectable()
export class GetTransactionUseCase {
  constructor(private readonly transactionService: TransactionService) {}

  async execute(transactionExternalId: string): Promise<Transaction | null> {
    return this.transactionService.getTransactionById(transactionExternalId);
  }
}
