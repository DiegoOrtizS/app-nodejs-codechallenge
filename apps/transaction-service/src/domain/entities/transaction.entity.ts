import { TransactionStatus } from "../value-objects/transaction-status.vo";

export class Transaction {
  public transactionExternalId: string;
  public accountExternalIdDebit: string;
  public accountExternalIdCredit: string;
  public value: number;
  public status: TransactionStatus;
  public transferTypeId: number;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(
    transactionExternalId: string,
    accountExternalIdDebit: string,
    accountExternalIdCredit: string,
    value: number,
    status: TransactionStatus,
    transferTypeId: number,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    this.transactionExternalId = transactionExternalId;
    this.accountExternalIdDebit = accountExternalIdDebit;
    this.accountExternalIdCredit = accountExternalIdCredit;
    this.value = value;
    this.status = status;
    this.transferTypeId = transferTypeId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
