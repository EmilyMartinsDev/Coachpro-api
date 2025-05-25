/*
  Warnings:

  - You are about to drop the column `duracao` on the `Plano` table. All the data in the column will be lost.
  - You are about to drop the column `valor` on the `Plano` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Plano" DROP COLUMN "duracao",
DROP COLUMN "valor";

-- CreateTable
CREATE TABLE "Parcelamento" (
    "id" TEXT NOT NULL,
    "planoId" TEXT NOT NULL,
    "valorParcela" DOUBLE PRECISION NOT NULL,
    "quantidadeParcela" DOUBLE PRECISION NOT NULL,
    "duracao_dias" INTEGER NOT NULL,

    CONSTRAINT "Parcelamento_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Parcelamento" ADD CONSTRAINT "Parcelamento_planoId_fkey" FOREIGN KEY ("planoId") REFERENCES "Plano"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
