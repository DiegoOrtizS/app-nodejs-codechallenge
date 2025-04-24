/*
  Warnings:

  - Added the required column `transfer_type_id` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "transfer_type_id" TEXT NOT NULL;
