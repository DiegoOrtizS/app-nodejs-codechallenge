import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { Transaction } from '../../domain/entities/transaction.entity';
import { CreateTransactionDto } from '../../dto/create-transaction.dto';
import { TransactionService } from '../../application/services/transaction.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({ status: 201, description: 'Transaction created successfully', type: Transaction })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  async create(@Body() dto: CreateTransactionDto): Promise<Transaction> {
    return this.transactionService.createTransaction(dto);
  }

  @Get(':transactionExternalId')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiResponse({ status: 200, description: 'Transaction details', type: Transaction })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async get(@Param('transactionExternalId') id: string): Promise<Object> {
    return this.transactionService.getTransactionById(id);
  }

  @MessagePattern('transaction-validated')
  async updateStatus(@Payload() message: { transactionExternalId: string; status: string }) {
    await this.transactionService.updateStatus(message.transactionExternalId, message.status);
  }
}
