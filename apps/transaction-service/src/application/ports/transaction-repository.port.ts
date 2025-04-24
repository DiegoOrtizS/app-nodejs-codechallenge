import { Transaction } from '../../domain/entities/transaction.entity';

export interface TransactionRepositoryPort {
    save(transaction: Transaction): Promise<void>;
    findById(transactionExternalId: string): Promise<Transaction | null>;
}

export const TransactionRepositoryPortToken = Symbol('TransactionRepositoryPort');
