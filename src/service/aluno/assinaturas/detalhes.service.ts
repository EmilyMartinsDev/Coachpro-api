
import { prisma } from '@/config/database';
;

export interface AlunoDetalhesAssinaturaInputDTO {
    assinaturaId: string
}

export class AlunoDetalhesAssinaturaService {
    async execute({ assinaturaId }: AlunoDetalhesAssinaturaInputDTO) {
        const assinatura = await prisma.assinatura.findFirst({
            where: {
                id: assinaturaId
            },
            include:{
                parcelamento: true
            }
        });
        return assinatura;
    }
}
