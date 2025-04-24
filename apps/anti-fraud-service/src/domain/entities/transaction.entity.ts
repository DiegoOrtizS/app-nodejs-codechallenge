import { TransactionStatus } from "../value-objects/transaction-status.vo";

export class Transaction {
  public transactionExternalId: string;
  public accountExternalIdDebit: string;
  public accountExternalIdCredit: string;
  public value: number;
  public status: TransactionStatus;

  constructor(
    transactionExternalId: string,
    accountExternalIdDebit: string,
    accountExternalIdCredit: string,
    value: number,
    status: TransactionStatus,
  ) {
    this.transactionExternalId = transactionExternalId;
    this.accountExternalIdDebit = accountExternalIdDebit;
    this.accountExternalIdCredit = accountExternalIdCredit;
    this.value = value;
    this.status = status;
  }
}
