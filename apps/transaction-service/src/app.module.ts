import { Module } from '@nestjs/common';
import { TransactionPrismaRepository } from './infrastructure/repositories/transaction-prisma.repository';
import { TransactionController } from './interface/controllers/transaction.controller';
import { PrismaModule } from './infrastructure/repositories/prisma.module';
import { TransactionService } from './application/services/transaction.service';

@Module({
  imports: [PrismaModule],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    {
      provide: 'TransactionRepositoryPort',
      useClass: TransactionPrismaRepository,
    },
  ],
})
export class AppModule {}
