import { Test, TestingModule } from "@nestjs/testing";
import { TransactionService } from "./transaction.service";
import { TransactionRepositoryPort } from "../ports/transaction-repository.port";
import { KafkaProducer } from "../../infrastructure/kafka/kafka-producer";
import { CreateTransactionDto } from "../../dto/create-transaction.dto";
import { Transaction } from "../../domain/entities/transaction.entity";
import { NotFoundException } from "@nestjs/common";
import { TransactionStatus } from "../../domain/value-objects/transaction-status.vo";

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

  describe("createTransaction", () => {
    it("should create a transaction and send it to Kafka when value is less than or equal to 1000", async () => {
      const dto: CreateTransactionDto = {
        accountExternalIdDebit: "e29a7b38-fbac-4e32-8b1a-eef2f6643c96",
        accountExternalIdCredit: "e29a7b38-fbac-4e32-8b1a-eef2f6643c96",
        tranferTypeId: 1,
        value: 100,
      };
  
      const result = await service.createTransaction(dto);
  
      expect(result).toEqual(
        expect.objectContaining({
          accountExternalIdDebit: dto.accountExternalIdDebit,
          accountExternalIdCredit: dto.accountExternalIdCredit,
          value: dto.value,
          status: TransactionStatus.pending(),
          transferTypeId: dto.tranferTypeId,
        }),
      );
  
      expect(repositoryMock.save).toHaveBeenCalledWith(expect.objectContaining({
        accountExternalIdDebit: dto.accountExternalIdDebit,
        accountExternalIdCredit: dto.accountExternalIdCredit,
        value: dto.value,
        status: TransactionStatus.pending(),
        transferTypeId: dto.tranferTypeId,
      }));
  
      expect(kafkaProducerMock.sendTransactionToAntiFraud).toHaveBeenCalledWith(expect.objectContaining({
        accountExternalIdDebit: dto.accountExternalIdDebit,
        accountExternalIdCredit: dto.accountExternalIdCredit,
        value: dto.value,
        status: TransactionStatus.pending(),
        transferTypeId: dto.tranferTypeId,
      }));
    });
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
