import { prisma } from "@/config/database";
import { uploadFileToSupabase } from "../../supabase.service";




export interface AlunoFotofeedbackInputDto {
  file?: {
    base64: string;
    mimetype: string; // Ex.: 'application/pdf' ou 'image/jpeg'
    originalname?: string;
  } | string;
  feedbackId: string
}

export class AlunoEnviarFotoFeedbackService {
  async execute({ file, feedbackId
  }: AlunoFotofeedbackInputDto) {
    let foto: any

    if (file && typeof file !== 'string') {
      const buffer = Buffer.from(file.base64, 'base64');

      const fileToSupa = {
        buffer,
        originalname: file.originalname ?? `fotos_feedback-${Date.now()}.${file.mimetype.split('/')[1]}`,
        mimetype: file.mimetype,
      };

      foto = await uploadFileToSupabase(fileToSupa, 'fotos-feedback');
    } else if (typeof file === 'string') {
      foto = file;
    }
    const fotoFeedback = await prisma.fotoFeedback.create({
      data: {
        feedbackId,
        url: foto
      }
    });
    return fotoFeedback;
  }
}