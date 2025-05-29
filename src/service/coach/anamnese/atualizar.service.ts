import { prisma } from "@/config/database";

type UpdateAnamneseRequest = {
    anamneseId: string,
    analisada:boolean
}


export class AtualizarAnamneseService {
  async execute( data:UpdateAnamneseRequest ) {
    const anamnese = await prisma.anamnese.update({
      where: {
        id: data.anamneseId,
      },
      data:{
        analisada: data.analisada
      }
    });

    if (!anamnese) {
      throw new Error("Anamnese não encontrada ou não autorizada.");
    }

    return anamnese;
  }
}
