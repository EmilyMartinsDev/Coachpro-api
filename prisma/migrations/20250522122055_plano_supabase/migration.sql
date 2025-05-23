/*
  Warnings:

  - You are about to drop the column `comprovante_pagamento` on the `Assinatura` table. All the data in the column will be lost.
  - You are about to drop the column `data` on the `FotoFeedback` table. All the data in the column will be lost.
  - You are about to drop the column `arquivo` on the `PlanoAlimentar` table. All the data in the column will be lost.
  - You are about to drop the column `arquivo` on the `PlanoTreino` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Assinatura" DROP COLUMN "comprovante_pagamento",
ADD COLUMN     "comprovante_url" TEXT;

-- AlterTable
ALTER TABLE "FotoFeedback" DROP COLUMN "data",
ADD COLUMN     "url" TEXT;

-- AlterTable
ALTER TABLE "PlanoAlimentar" DROP COLUMN "arquivo",
ADD COLUMN     "arquivo_url" TEXT;

-- AlterTable
ALTER TABLE "PlanoTreino" DROP COLUMN "arquivo",
ADD COLUMN     "arquivo_url" TEXT;
