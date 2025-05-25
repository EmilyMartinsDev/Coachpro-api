
import { prisma } from '@/config/database';


export interface DetalhesAssinaturaInputDTO {
    assinaturaId: string
}

export class DetalhesAssinaturaService {
    async execute({ assinaturaId }: DetalhesAssinaturaInputDTO) {
        const assinatura = await prisma.assinatura.findFirst({
            where: {
                id: assinaturaId
            },
            include:{
                parcelamento:true
            }
        });
        return assinatura;
    }
}
