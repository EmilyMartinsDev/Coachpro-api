-- AlterTable
ALTER TABLE "Anamnese" ADD COLUMN     "analisada" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "FotoAnamnese" (
    "id" TEXT NOT NULL,
    "anamneseId" TEXT NOT NULL,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FotoAnamnese_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FotoAnamnese" ADD CONSTRAINT "FotoAnamnese_anamneseId_fkey" FOREIGN KEY ("anamneseId") REFERENCES "Anamnese"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
