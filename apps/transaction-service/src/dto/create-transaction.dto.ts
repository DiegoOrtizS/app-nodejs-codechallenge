import { IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
    @IsUUID()
    @ApiProperty({
        description: 'ID of the debit account',
        example: 'ab865bf7-079d-43b3-80f8-cd6dc35ba33b',
    })
    accountExternalIdDebit: string;

    @IsUUID()
    @ApiProperty({
        description: 'ID of the credit account',
        example: 'fe219ec9-3e32-4d41-9add-66bef431179c',
    })
    accountExternalIdCredit: string;

    @IsNumber()
    @ApiProperty({
        description: 'Type of the transfer',
        example: 1,
    })
    tranferTypeId: number;

    @IsNumber()
    @ApiProperty({
        description: 'The value of the transaction',
        example: 100,
    })
    value: number;
}
