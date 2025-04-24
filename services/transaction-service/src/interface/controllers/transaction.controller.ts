import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { CreateTransactionUseCase } from '../../application/use-cases/create-transaction.use-case';
import { GetTransactionUseCase } from '../../application/use-cases/get-transaction.use-case';
import { Transaction } from '../../domain/entities/transaction.entity';
import { CreateTransactionDto } from '../../dto/create-transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly getTransactionUseCase: GetTransactionUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateTransactionDto): Promise<Transaction> {
    return this.createTransactionUseCase.execute(dto);
  }

  @Get(':transactionExternalId')
  async get(@Param('transactionExternalId') id: string): Promise<Transaction | null> {
    return this.getTransactionUseCase.execute(id);
  }
}
