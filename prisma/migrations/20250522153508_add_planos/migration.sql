/*
  Warnings:

  - Added the required column `coachId` to the `Plano` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Plano" ADD COLUMN     "coachId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Plano" ADD CONSTRAINT "Plano_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "Coach"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
