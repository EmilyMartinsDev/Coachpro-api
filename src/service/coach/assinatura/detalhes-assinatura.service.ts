
import { prisma } from '@/config/database';


export interface DetalhesAssinaturaInputDTO {
    assinaturaId: string
}

export class DetalhesAssinaturaService {
    async execute({ assinaturaId }: DetalhesAssinaturaInputDTO) {
        const assinatura = await prisma.assinatura.findUnique({
            where: {
                id: assinaturaId
            },
            include:{
                parcelamento:{
                    include:{
                        plano:{
                            select:{
                                titulo:true
                            }
                        }
                    }
                },
                aluno:true
            }
        });
        return assinatura;
    }
}
