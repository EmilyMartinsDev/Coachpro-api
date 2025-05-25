import { prisma } from "@/config/database";
import { uploadFileToSupabase } from "../../supabase.service";


interface AlunoEnviarComprovanteInputDto {
    assinaturaId: string;
    file: {
        base64: string;
        mimetype: string; // Ex.: 'application/pdf' ou 'image/jpeg'
        originalname?: string; // opcional, se quiser manter o nome original
    } | string; // pode ser url já existente
}

export class AlunoEnviarComprovanteAssinaturaService {
    async execute({ assinaturaId, file }: AlunoEnviarComprovanteInputDto) {
        let comprovante: string | null = null;

        if (file && typeof file !== 'string') {
            const buffer = Buffer.from(file.base64, 'base64');

            const fileToSupa = {
                buffer,
                originalname: file.originalname ?? `comprovante-${Date.now()}.${file.mimetype.split('/')[1]}`,
                mimetype: file.mimetype,
            };

            comprovante = await uploadFileToSupabase(fileToSupa, 'comprovantes');
        } else if (typeof file === 'string') {
            comprovante = file;
        }

        const assinatura = await prisma.assinatura.update({
            where: {
                id: assinaturaId
            },
            data:{
                comprovante_url: comprovante,
                status:"PENDENTE_APROVACAO"
            }
        });

        return assinatura;
    }
}
