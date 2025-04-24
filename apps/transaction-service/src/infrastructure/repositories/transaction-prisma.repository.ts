import { Injectable } from '@nestjs/common';
import { TransactionRepositoryPort } from '../../application/ports/transaction-repository.port';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionStatus, TransactionStatusEnum } from '../../domain/value-objects/transaction-status.vo';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class TransactionPrismaRepository implements TransactionRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  async save(transaction: Transaction): Promise<void> {
    await this.prisma.transaction.create({
      data: {
        transactionExternalId: transaction.transactionExternalId,
        accountExternalIdDebit: transaction.accountExternalIdDebit,
        accountExternalIdCredit: transaction.accountExternalIdCredit,
        value: transaction.value,
        transferTypeId: transaction.transferTypeId,
        status: transaction.status.getValue(),
      },
    });
  }

  async findById(transactionExternalId: string): Promise<Transaction | null> {
    const result = await this.prisma.transaction.findUnique({
      where: { transactionExternalId },
    });

    if (!result) return null;

    return new Transaction(
      result.transactionExternalId,
      result.accountExternalIdDebit,
      result.accountExternalIdCredit,
      result.value,
      TransactionStatus[result.status as TransactionStatusEnum](),
      result.transferTypeId,
      result.createdAt,
      result.updatedAt,
    );
  }
  
  async update(transaction: Transaction): Promise<void> {
    await this.prisma.transaction.update({
      where: { transactionExternalId: transaction.transactionExternalId },
      data: {
        status: transaction.status.getValue(),
        updatedAt: new Date(),
      },
    });
  }
}
