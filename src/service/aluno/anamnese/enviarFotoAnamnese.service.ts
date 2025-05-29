import { prisma } from "@/config/database";
import { uploadFileToSupabase } from "../../supabase.service";


interface AlunoEnviarAnamneseServiceDto {
    anamneseId: string;
    file: {
        base64: string;
        mimetype: string; // Ex.: 'application/pdf' ou 'image/jpeg'
        originalname?: string; // opcional, se quiser manter o nome original
    } | string; // pode ser url já existente
}

export class AlunoEnviarFotoAnamneseService {
    async execute({ anamneseId, file }: AlunoEnviarAnamneseServiceDto) {
        let foto: string | null = null;

        if (file && typeof file !== 'string') {
            const buffer = Buffer.from(file.base64, 'base64');

            const fileToSupa = {
                buffer,
                originalname: file.originalname ?? `anamnese-${Date.now()}.${file.mimetype.split('/')[1]}`,
                mimetype: file.mimetype,
            };

            foto = await uploadFileToSupabase(fileToSupa, 'fotos-anamnese');
        } else if (typeof file === 'string') {
            foto = file;
        }

        const anamneseFotos = await prisma.fotoAnamnese.create({
            data:{
                anamneseId: anamneseId,
                url : foto
            }
        })
        return anamneseFotos;
    }
}
