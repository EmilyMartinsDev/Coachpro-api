/*
  Warnings:

  - You are about to drop the column `planoId` on the `Assinatura` table. All the data in the column will be lost.
  - You are about to drop the column `duracao_dias` on the `Parcelamento` table. All the data in the column will be lost.
  - Added the required column `parcelamentoId` to the `Assinatura` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Assinatura" DROP CONSTRAINT "Assinatura_planoId_fkey";

-- AlterTable
ALTER TABLE "Assinatura" DROP COLUMN "planoId",
ADD COLUMN     "parcelamentoId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Parcelamento" DROP COLUMN "duracao_dias";

-- AddForeignKey
ALTER TABLE "Assinatura" ADD CONSTRAINT "Assinatura_parcelamentoId_fkey" FOREIGN KEY ("parcelamentoId") REFERENCES "Parcelamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
