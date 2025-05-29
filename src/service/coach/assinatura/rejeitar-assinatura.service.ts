
import { prisma } from '@/config/database';



export interface RejeitarAssinaturaInputDTO {
    assinaturaId: string
}

export class RejeitarAssinaturaService {
    async execute({ assinaturaId }: RejeitarAssinaturaInputDTO) {
        const assinatura = await prisma.assinatura.update({
            where: {
                id: assinaturaId
            },
            data:{
                status: "CANCELADA"
            }
           
        });
        return assinatura;
    }
}
