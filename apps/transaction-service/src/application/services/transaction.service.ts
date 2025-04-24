import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { TransactionRepositoryPort } from "../ports/transaction-repository.port";
import { CreateTransactionDto } from "../../dto/create-transaction.dto";
import { Transaction } from "../../domain/entities/transaction.entity";
import {
  TransactionStatus,
  TransactionStatusEnum,
} from "../../domain/value-objects/transaction-status.vo";
import { KafkaProducer } from "../../infrastructure/kafka/kafka-producer";

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    @Inject("TransactionRepositoryPort")
    private readonly repository: TransactionRepositoryPort,
    private readonly kafkaProducer: KafkaProducer,
  ) {}

  async createTransaction(dto: CreateTransactionDto): Promise<Transaction> {
    const transaction = new Transaction(
      crypto.randomUUID(),
      dto.accountExternalIdDebit,
      dto.accountExternalIdCredit,
      dto.value,
      TransactionStatus.pending(),
      dto.tranferTypeId,
    );

    await this.repository.save(transaction);
    await this.kafkaProducer.sendTransactionToAntiFraud(transaction);
    return transaction;
  }

  async getTransactionById(id: string): Promise<object> {
    const trx = await this.repository.findById(id);
    if (!trx) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return {
      transactionExternalId: trx.transactionExternalId,
      transactionType: {
        name: trx.transferTypeId,
      },
      transactionStatus: {
        name: trx.status,
      },
      value: trx.value,
      createdAt: trx.createdAt,
    };
  }

  async updateStatus(transactionId: string, status: string): Promise<void> {
    if (status === TransactionStatusEnum.PENDING) {
      this.logger.warn("Cannot update status to pending");
      return;
    }

    const transaction = await this.repository.findById(transactionId);
    if (!transaction) {
      this.logger.warn(`Transaction ${transactionId} not found`);
      return;
    }

    transaction.status =
      status === TransactionStatusEnum.APPROVED
        ? TransactionStatus.approved()
        : TransactionStatus.rejected();

    await this.repository.update(transaction);
  }
}
