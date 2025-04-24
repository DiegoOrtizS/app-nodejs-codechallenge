import { Static, Type } from '@sinclair/typebox';

export const CreateTransactionSchema = {
    body: Type.Object({
        accountExternalIdDebit: Type.String({ format: 'uuid' }),
        accountExternalIdCredit: Type.String({ format: 'uuid' }),
        tranferTypeId: Type.Number(),
        value: Type.Number({ minimum: 0 }),
    }),
};

export type CreateTransactionSchemaType = Static<typeof CreateTransactionSchema.body>;
