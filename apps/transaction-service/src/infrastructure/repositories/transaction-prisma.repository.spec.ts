import { Test, TestingModule } from "@nestjs/testing";
import { TransactionPrismaRepository } from "./transaction-prisma.repository";
import { PrismaClient } from "@prisma/client";
import { Transaction } from "../../domain/entities/transaction.entity";
import { TransactionStatus } from "../../domain/value-objects/transaction-status.vo";

describe("TransactionPrismaRepository", () => {
  let repository: TransactionPrismaRepository;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      transaction: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionPrismaRepository,
        { provide: PrismaClient, useValue: prismaMock },
      ],
    }).compile();

    repository = module.get<TransactionPrismaRepository>(TransactionPrismaRepository);
  });

  it("should be defined", () => {
    expect(repository).toBeDefined();
  });

  describe("save", () => {
    it("should save a transaction", async () => {
      const transaction = new Transaction(
        "e29a7b38-fbac-4e32-8b1a-eef2f6643c96",
        "debit-id",
        "credit-id",
        100,
        TransactionStatus.pending(),
        1,
      );

      await repository.save(transaction);

      expect(prismaMock.transaction.create).toHaveBeenCalledWith({
        data: {
          transactionExternalId: transaction.transactionExternalId,
          accountExternalIdDebit: transaction.accountExternalIdDebit,
          accountExternalIdCredit: transaction.accountExternalIdCredit,
          value: transaction.value,
          transferTypeId: transaction.transferTypeId,
          status: transaction.status.getValue(),
        },
      });
    });
  });

  describe("findById", () => {
    it("should return null if no transaction found", async () => {
      prismaMock.transaction.findUnique.mockResolvedValue(null);
      const result = await repository.findById("non-existing-id");
      expect(result).toBeNull();
    });
  });

  describe("update", () => {
    it("should update a transaction", async () => {
      const transaction = new Transaction(
        "e29a7b38-fbac-4e32-8b1a-eef2f6643c96",
        "debit-id",
        "credit-id",
        100,
        TransactionStatus.pending(),
        1,
      );

      prismaMock.transaction.update.mockResolvedValue({
        transactionExternalId: "e29a7b38-fbac-4e32-8b1a-eef2f6643c96",
        accountExternalIdDebit: "debit-id",
        accountExternalIdCredit: "credit-id",
        value: 100,
        transferTypeId: 1,
        status: "PENDING",
        updatedAt: new Date(),
      });

      await repository.update(transaction);

      expect(prismaMock.transaction.update).toHaveBeenCalledWith({
        where: { transactionExternalId: transaction.transactionExternalId },
        data: {
          status: transaction.status.getValue(),
          updatedAt: expect.any(Date),
        },
      });
    });
  });
});
