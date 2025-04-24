/*
  Warnings:

  - Changed the type of `transfer_type_id` on the `transactions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "transfer_type_id",
ADD COLUMN     "transfer_type_id" INTEGER NOT NULL;
