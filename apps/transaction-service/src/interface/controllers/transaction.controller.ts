import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { Transaction } from '../../domain/entities/transaction.entity';
import { CreateTransactionDto } from '../../dto/create-transaction.dto';
import { TransactionService } from '../../application/services/transaction.service';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
  ) {}

  @Post()
  async create(@Body() dto: CreateTransactionDto): Promise<Transaction> {
    return this.transactionService.createTransaction(dto);
  }

  @Get(':transactionExternalId')
  async get(@Param('transactionExternalId') id: string): Promise<Transaction | null> {
    return this.transactionService.getTransactionById(id);
  }
}
