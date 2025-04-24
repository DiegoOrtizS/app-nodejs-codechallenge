import { Static, Type } from '@sinclair/typebox';

export const GetTransactionSchema = {
    params: Type.Object({
        transactionExternalId: Type.String({ format: 'uuid' }),
    }),
};

export type GetTransactionSchemaType = Static<typeof GetTransactionSchema.params>;
