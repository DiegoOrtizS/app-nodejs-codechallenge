import { Test, TestingModule } from "@nestjs/testing";
import { TransactionController } from "./transaction.controller";
import { TransactionService } from "../../application/services/transaction.service";
import { CreateTransactionDto } from "../../dto/create-transaction.dto";
import { Transaction } from "../../domain/entities/transaction.entity";
import { NotFoundException } from "@nestjs/common";
import { KafkaProducer } from "../../infrastructure/kafka/kafka-producer";
import { TransactionRepositoryPort } from "../../application/ports/transaction-repository.port";
import { TransactionStatus } from "../../domain/value-objects/transaction-status.vo";

jest.mock("../../application/services/transaction.service");
jest.mock("../../infrastructure/kafka/kafka-producer");
jest.mock("../../application/ports/transaction-repository.port");

describe("TransactionController", () => {
  let controller: TransactionController;
  let transactionServiceMock: jest.Mocked<TransactionService>;
  let kafkaProducerMock: jest.Mocked<KafkaProducer>;
  let transactionRepositoryMock: jest.Mocked<TransactionRepositoryPort>;

  beforeEach(async () => {
    kafkaProducerMock = {
      onModuleInit: jest.fn(),
      sendTransactionToAntiFraud: jest.fn(),
    } as any;

    transactionRepositoryMock = {} as jest.Mocked<TransactionRepositoryPort>;

    transactionServiceMock = new TransactionService(
      transactionRepositoryMock,
      kafkaProducerMock,
    ) as jest.Mocked<TransactionService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        { provide: TransactionService, useValue: transactionServiceMock },
        { provide: KafkaProducer, useValue: kafkaProducerMock },
        {
          provide: "TransactionRepositoryPort",
          useValue: transactionRepositoryMock,
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should create a transaction successfully", async () => {
      const dto: CreateTransactionDto = {
        accountExternalIdDebit: "debit-id",
        accountExternalIdCredit: "credit-id",
        tranferTypeId: 1,
        value: 100,
      };

      const createdTransaction = new Transaction(
        "e29a7b38-fbac-4e32-8b1a-eef2f6643c96",
        dto.accountExternalIdDebit,
        dto.accountExternalIdCredit,
        dto.value,
        TransactionStatus.pending(),
        dto.tranferTypeId,
      );

      transactionServiceMock.createTransaction.mockResolvedValue(
        createdTransaction,
      );

      const result = await controller.create(dto);
      expect(result).toEqual(createdTransaction);
      expect(transactionServiceMock.createTransaction).toHaveBeenCalledWith(
        dto,
      );
    });
  });

  describe("get", () => {
    it("should return a transaction by ID", async () => {
      const transaction = new Transaction(
        "e29a7b38-fbac-4e32-8b1a-eef2f6643c96",
        "debit-id",
        "credit-id",
        100,
        TransactionStatus.pending(),
        1,
      );

      transactionServiceMock.getTransactionById.mockResolvedValue({
        transactionExternalId: transaction.transactionExternalId,
        transactionType: { name: transaction.transferTypeId },
        transactionStatus: { name: transaction.status },
        value: transaction.value,
        createdAt: transaction.createdAt,
      });

      const result = await controller.get("e29a7b38-fbac-4e32-8b1a-eef2f6643c96");
      expect(result).toEqual({
        transactionExternalId: transaction.transactionExternalId,
        transactionType: { name: transaction.transferTypeId },
        transactionStatus: { name: transaction.status },
        value: transaction.value,
        createdAt: transaction.createdAt,
      });
      expect(transactionServiceMock.getTransactionById).toHaveBeenCalledWith(
        "e29a7b38-fbac-4e32-8b1a-eef2f6643c96",
      );
    });

    it("should throw NotFoundException if transaction not found", async () => {
      transactionServiceMock.getTransactionById = jest.fn().mockRejectedValue(new NotFoundException('Transaction not found'));
    
      await expect(controller.get("non-existing-id")).rejects.toThrow(
        NotFoundException
      );
    });    
  });

  describe("updateStatus", () => {
    it("should update the status of a transaction from Kafka", async () => {
      const message = { transactionExternalId: "e29a7b38-fbac-4e32-8b1a-eef2f6643c96", status: "APPROVED" };

      transactionServiceMock.updateStatus.mockResolvedValue(undefined);

      await controller.updateStatus(message);
      expect(transactionServiceMock.updateStatus).toHaveBeenCalledWith(
        "e29a7b38-fbac-4e32-8b1a-eef2f6643c96",
        "APPROVED",
      );
    });
  });
});
