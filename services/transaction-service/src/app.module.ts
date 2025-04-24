import { Module } from '@nestjs/common';
import { TransactionPrismaRepository } from './infrastructure/repositories/transaction-prisma.repository';
import { TransactionController } from './interface/controllers/transaction.controller';
import { CreateTransactionUseCase } from './application/use-cases/create-transaction.use-case';
import { GetTransactionUseCase } from './application/use-cases/get-transaction.use-case';
import { PrismaModule } from './infrastructure/repositories/prisma.module'; // Import PrismaModule
import { TransactionService } from './application/services/transaction.service';

@Module({
  imports: [PrismaModule], // Ensure PrismaModule is imported
  controllers: [TransactionController],
  providers: [
    TransactionService,
    CreateTransactionUseCase,
    GetTransactionUseCase,
    {
      provide: 'TransactionRepositoryPort',
      useClass: TransactionPrismaRepository,
    },
  ],
})
export class AppModule {}
