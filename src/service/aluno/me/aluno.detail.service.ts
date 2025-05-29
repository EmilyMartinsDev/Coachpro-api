import { prisma } from "@/config/database"

export class AlunoDetalhesService {
  async execute(id: string) {
    if (!id) {
      throw new Error("ID do aluno não fornecido.")
    }

    const aluno = await prisma.aluno.findUnique({
      where: { id },
      include: {
        anamnese: true,
        feedbacks: {
          include: { fotos: true } // Caso feedback tenha fotos
        },
        assinaturas: {
          include: {
            parcelamento: {
              include: { plano: true }
            }
          }
        },
        planosAlimentar: true,
        planosTreino: true
      }
    })

    if (!aluno) {
      throw new Error("Aluno não encontrado.")
    }

    // Tratamento opcional: ocultar campos sensíveis
    const { senha, ...alunoSeguro } = aluno as any

    return alunoSeguro
  }
}
