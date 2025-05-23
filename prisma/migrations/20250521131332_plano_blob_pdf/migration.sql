/*
  Warnings:

  - You are about to drop the column `caminhoArquivo` on the `PlanoAlimentar` table. All the data in the column will be lost.
  - You are about to drop the column `caminhoArquivo` on the `PlanoTreino` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PlanoAlimentar" DROP COLUMN "caminhoArquivo",
ADD COLUMN     "arquivo" BYTEA;

-- AlterTable
ALTER TABLE "PlanoTreino" DROP COLUMN "caminhoArquivo",
ADD COLUMN     "arquivo" BYTEA;
