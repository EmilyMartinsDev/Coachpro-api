import { prisma } from "@/config/database";


export interface ResponderFeedbackDTO {
    respostaCoach: string;
    feedBackId: string

}

export class ResponderFeedbackService {
    async execute({ respostaCoach, feedBackId }: ResponderFeedbackDTO) {
        const feedback = await prisma.feedback.update({
            where: {
                id: feedBackId,
                
            },
            data: {
                respostaCoach,
                respondido:true
            }
        });

        return feedback;
    }
}
