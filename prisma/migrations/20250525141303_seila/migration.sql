/*
  Warnings:

  - You are about to drop the column `totalParcelas` on the `Assinatura` table. All the data in the column will be lost.
  - You are about to drop the column `valor` on the `Assinatura` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Assinatura" DROP COLUMN "totalParcelas",
DROP COLUMN "valor",
ALTER COLUMN "dataInicio" DROP NOT NULL,
ALTER COLUMN "dataFim" DROP NOT NULL;
