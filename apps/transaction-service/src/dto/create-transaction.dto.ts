import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateTransactionDto {
    @IsUUID()
    accountExternalIdDebit: string;

    @IsUUID()
    accountExternalIdCredit: string;

    @IsNumber()
    tranferTypeId: number;

    @IsNumber()
    value: number;

    @IsNumber()
    transferTypeId: number;
}
