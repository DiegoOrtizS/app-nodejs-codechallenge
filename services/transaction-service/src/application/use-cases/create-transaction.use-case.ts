import { Injectable } from '@nestjs/common';
import { Transaction } from '../../domain/entities/transaction.entity';
import { CreateTransactionDto } from '../../dto/create-transaction.dto';
import { TransactionService } from '../services/transaction.service';

@Injectable()
export class CreateTransactionUseCase {
  constructor(private readonly transactionService: TransactionService) {}

  async execute(dto: CreateTransactionDto): Promise<Transaction> {
    return this.transactionService.createTransaction(dto);
  }
}
