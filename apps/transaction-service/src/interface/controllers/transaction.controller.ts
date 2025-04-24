import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { Transaction } from '../../domain/entities/transaction.entity';
import { CreateTransactionDto } from '../../dto/create-transaction.dto';
import { TransactionService } from '../../application/services/transaction.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

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
  async get(@Param('transactionExternalId') id: string): Promise<Object> {
    return this.transactionService.getTransactionById(id);
  }

  @MessagePattern('transaction-validated')
  async updateStatus(@Payload() message: { transactionExternalId: string; status: string } ) {
    await this.transactionService.updateStatus(message.transactionExternalId, message.status);
  }
}
