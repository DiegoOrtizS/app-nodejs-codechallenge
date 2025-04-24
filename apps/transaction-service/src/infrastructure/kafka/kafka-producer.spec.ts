import { Test, TestingModule } from "@nestjs/testing";
import { KafkaProducer } from "../../infrastructure/kafka/kafka-producer";
import { CreateTransactionDto } from "../../dto/create-transaction.dto";
import { Transaction } from "../../domain/entities/transaction.entity";
import { NotFoundException } from "@nestjs/common";
import { TransactionStatus } from "../../domain/value-objects/transaction-status.vo";
import { TransactionService } from "../../application/services/transaction.service";
import { TransactionRepositoryPort } from "../../application/ports/transaction-repository.port";

describe("TransactionService", () => {
  let service: TransactionService;
  let repositoryMock: jest.Mocked<TransactionRepositoryPort>;
  let kafkaProducerMock: jest.Mocked<any>;

  beforeEach(async () => {
    repositoryMock = {
      save: jest.fn().mockResolvedValue(undefined),
      findById: jest.fn(),
      update: jest.fn().mockResolvedValue(undefined),
    };

    kafkaProducerMock = {
      onModuleInit: jest.fn().mockResolvedValue(undefined),
      sendTransactionToAntiFraud: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        { provide: "TransactionRepositoryPort", useValue: repositoryMock },
        { provide: KafkaProducer, useValue: kafkaProducerMock },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getTransactionById", () => {
    it("should return a transaction by ID", async () => {
      const transaction = new Transaction(
        "e29a7b38-fbac-4e32-8b1a-eef2f6643c96",
        "e29a7b38-fbac-4e32-8b1a-eef2f6643c96",
        "e29a7b38-fbac-4e32-8b1a-eef2f6643c96",
        100,
        TransactionStatus.pending(),
        1,
      );

      repositoryMock.findById.mockResolvedValue(transaction);

      const result = await service.getTransactionById("e29a7b38-fbac-4e32-8b1a-eef2f6643c96");
      expect(result).toEqual({
        transactionExternalId: transaction.transactionExternalId,
        transactionType: { name: transaction.transferTypeId },
        transactionStatus: { name: transaction.status },
        value: transaction.value,
        createdAt: transaction.createdAt,
      });
    });

    it("should throw an error if transaction is not found", async () => {
      repositoryMock.findById.mockResolvedValue(null);

      await expect(
        service.getTransactionById("non-existing-id"),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("updateStatus", () => {
    it("should handle a missing transaction gracefully", async () => {
      repositoryMock.findById.mockResolvedValue(null);

      await service.updateStatus("non-existing-id", "APPROVED");
      expect(repositoryMock.update).not.toHaveBeenCalled();
    });
  });
});
