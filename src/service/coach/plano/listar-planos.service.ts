import { prisma } from "../../../config/database";


export class ListarPlanosService {
  async execute(coachId: string) {
    return prisma.plano.findMany({
      where: {
        coachId: coachId
      },
      include: {
        parcelamento: true
      }
    });
  }
}
