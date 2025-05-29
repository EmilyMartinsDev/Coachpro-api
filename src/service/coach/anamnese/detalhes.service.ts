import { prisma } from "@/config/database";


export class DetalhesAnamneseService {
  async execute(anamneseId: string) {
    const anamnese = await prisma.anamnese.findFirst({
      where: {
        id: anamneseId,
      },
      include: { aluno: true, fotos:true },
    });

    if (!anamnese) {
      throw new Error("Anamnese não encontrada ou não autorizada.");
    }

    return anamnese;
  }
}
