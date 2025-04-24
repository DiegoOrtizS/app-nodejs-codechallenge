export enum TransactionStatusEnum {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

export class TransactionStatus {
    private readonly value: TransactionStatusEnum;

    private constructor(status: TransactionStatusEnum) {
        this.value = status;
    }

    static pending(): TransactionStatus {
        return new TransactionStatus(TransactionStatusEnum.PENDING);
    }

    static approved(): TransactionStatus {
        return new TransactionStatus(TransactionStatusEnum.APPROVED);
    }

    static rejected(): TransactionStatus {
        return new TransactionStatus(TransactionStatusEnum.REJECTED);
    }

    equals(other: TransactionStatus): boolean {
        return this.value === other.value;
    }

    getValue(): string {
        return this.value;
    }
}
