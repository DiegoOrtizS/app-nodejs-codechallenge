import { Transaction } from '../../domain/entities/transaction.entity';

export interface TransactionRepositoryPort {
    save(transaction: Transaction): Promise<void>;
    findById(transactionExternalId: string): Promise<Transaction | null>;
    update(transaction: Transaction): Promise<void>;
}

export const TransactionRepositoryPortToken = Symbol('TransactionRepositoryPort');
