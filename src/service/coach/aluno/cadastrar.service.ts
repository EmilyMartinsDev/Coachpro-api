import { prisma } from "../../../config/database";

import bcrypt from 'bcrypt'


export interface CadastarAlunoDto{
  nome:string
  email:string
  senha:string,
  telefone:string
  dataNascimento:string
  coachId:string
  diaFeedback:string
}

export class CadastrarAlunoService {
  async execute(data:CadastarAlunoDto) {
    console.log(data.coachId)
    const { senha, coachId, dataNascimento, diaFeedback, email, nome, telefone } = data;
    const hashedSenha = await bcrypt.hash(senha, 10);
    const dataNascimentoConvert = new Date(dataNascimento)
    try {
      const aluno = await prisma.aluno.create({
        data: {
          dataNascimento: dataNascimentoConvert,
          diaFeedback,
          email,
          nome,
          telefone,
          coachId,
          senha:hashedSenha

        },
      });
      return aluno;
    } catch (error) {
      throw new Error('Erro ao cadastrar aluno.'+error);
    }
  }
}
