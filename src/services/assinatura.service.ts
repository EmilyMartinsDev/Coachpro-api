import { prisma } from '../config/database';
import { ApiError } from '../utils/apiError';
import { CreateAssinaturaInput, UpdateAssinaturaInput } from '../schemas/assinatura.schema';
import { uploadFileToSupabase, deleteFileFromSupabase } from './supabase.service';

export const getAllAssinaturasService = async (userId: string, tipo: 'coach' | 'aluno') => {
    if (tipo === 'coach') {
        return await prisma.assinatura.findMany({
            where: {
                aluno: {
                    coachId: userId
                }
            },
            include: {
                aluno: {
                    select: {
                        id: true,
                        nome: true
                    }
                },
                plano: {
                    select: {
                        id: true,
                        titulo: true
                    }
                },
            }
        });
    } else {
        return await prisma.assinatura.findMany({
            where: {
                alunoId: userId
            },
            include: {
                plano: {
                    select: {
                        id: true,
                        titulo: true
                    }
                },
            }
        });
    }
};

export const getAssinaturaByIdService = async (id: string, userId: string, tipo: 'coach' | 'aluno') => {
    const assinatura = await prisma.assinatura.findUnique({
        where: { id },
        include: {
            aluno: {
                select: {
                    id: true,
                    nome: true,
                    coachId: true
                }
            },
            plano: {
                select: {
                    id: true,
                    titulo: true
                }
            },
        }
    });

    if (!assinatura) {
        throw new ApiError(404, 'Assinatura não encontrada');
    }

    if (tipo === 'aluno' && assinatura.alunoId !== userId) {
        throw new ApiError(403, 'Acesso não autorizado');
    }

    if (tipo === 'coach' && assinatura.aluno.coachId !== userId) {
        throw new ApiError(403, 'Acesso não autorizado');
    }

    return assinatura;
};
export const createAssinaturaService = async (input: CreateAssinaturaInput, userId: string, tipo: 'coach' | 'aluno') => {
    const { alunoId, planoId } = input;

    if (tipo === 'coach') {
        const aluno = await prisma.aluno.findUnique({
            where: { id: alunoId },
            select: { coachId: true }
        });

        if (!aluno || aluno.coachId !== userId) {
            throw new ApiError(403, 'Acesso não autorizado');
        }
    } else if (tipo === 'aluno' && alunoId !== userId) {
        throw new ApiError(403, 'Acesso não autorizado');
    }

    const plano = await prisma.plano.findUnique({
        where: { id: planoId }
    });

    if (!plano) {
        throw new ApiError(404, 'Plano não encontrado');
    }

    const dataFim = new Date(input.dataFim);
    let comprovanteUrl: string | null = null;
    console.log(input)
    if (input.comprovante_url) {
           console.log(input)
        const buffer = Buffer.from(input.comprovante_url, 'base64')

        const file = {
            buffer,
            originalname: `comprovante-${Date.now()}.jpg`,
            mimetype: 'image/jpeg'
        }
   console.log(input)
        comprovanteUrl = await uploadFileToSupabase(file, 'comprovantes')
    } else if (typeof input.comprovante_url === 'string') {
        comprovanteUrl = input.comprovante_url;
    }

    return await prisma.assinatura.create({
        data: {
            alunoId,
            planoId,
            status: input.status,
            dataInicio: new Date(input.dataInicio),
            dataFim,
            valor: input.valor,
            comprovante_url: comprovanteUrl,
            parcela: input.parcela,
            totalParcelas: input.total_parcelas,
        },
        include: {
            plano: {
                select: {
                    id: true,
                    titulo: true
                }
            }
        }
    });
};


export const getAssinaturasByAlunoService = async (alunoId: string, userId: string, tipo: 'coach' | 'aluno') => {
    if (tipo === 'aluno' && alunoId !== userId) {
        throw new ApiError(403, 'Acesso não autorizado');
    }

    if (tipo === 'coach') {
        const aluno = await prisma.aluno.findUnique({
            where: { id: alunoId },
            select: { coachId: true }
        });

        if (!aluno || aluno.coachId !== userId) {
            throw new ApiError(403, 'Acesso não autorizado');
        }
    }

    return await prisma.assinatura.findMany({
        where: { alunoId },
        include: {
            plano: {
                select: {
                    id: true,
                    titulo: true
                }
            }
        }
    });
};

export const getAssinaturasPendentesService = async (userId: string, tipo: 'coach' | 'aluno') => {
    if (tipo === 'coach') {
        return await prisma.assinatura.findMany({
            where: {
                status: 'PENDENTE',
                aluno: {
                    coachId: userId
                }
            },
            include: {
                aluno: {
                    select: {
                        id: true,
                        nome: true
                    }
                },
                plano: {
                    select: {
                        id: true,
                        titulo: true
                    }
                }
            }
        });
    } else {
        return await prisma.assinatura.findMany({
            where: {
                status: 'PENDENTE',
                alunoId: userId
            },
            include: {
                plano: {
                    select: {
                        id: true,
                        titulo: true
                    }
                }
            }
        });
    }
};

export const getAssinaturasAguardandoAprovacaoService = async (userId: string, tipo: 'coach' | 'aluno') => {
    if (tipo === 'coach') {
        return await prisma.assinatura.findMany({
            where: {
                status: 'PENDENTE_APROVACAO',
                aluno: {
                    coachId: userId
                }
            },
            include: {
                aluno: {
                    select: {
                        id: true,
                        nome: true
                    }
                },
                plano: {
                    select: {
                        id: true,
                        titulo: true
                    }
                },

            }
        });
    } else {
        return await prisma.assinatura.findMany({
            where: {
                status: 'PENDENTE_APROVACAO',
                alunoId: userId
            },
            include: {
                plano: {
                    select: {
                        id: true,
                        titulo: true
                    }
                },

            }
        });
    }
};

export const getAssinaturasAtivasService = async (userId: string, tipo: 'coach' | 'aluno') => {
    if (tipo === 'coach') {
        return await prisma.assinatura.findMany({
            where: {
                status: 'ATIVA',
                aluno: {
                    coachId: userId
                }
            },
            include: {
                aluno: {
                    select: {
                        id: true,
                        nome: true
                    }
                },
                plano: {
                    select: {
                        id: true,
                        titulo: true
                    }
                }
            }
        });
    } else {
        return await prisma.assinatura.findMany({
            where: {
                status: 'ATIVA',
                alunoId: userId
            },
            include: {
                plano: {
                    select: {
                        id: true,
                        titulo: true
                    }
                }
            }
        });
    }
}

export const getAssinaturasCanceladasService = async (userId: string, tipo: 'coach' | 'aluno') => {
    if (tipo === 'coach') {
        return await prisma.assinatura.findMany({
            where: {
                status: 'CANCELADA',
                aluno: {
                    coachId: userId
                }
            },
            include: {
                aluno: {
                    select: {
                        id: true,
                        nome: true
                    }
                },
                plano: {
                    select: {
                        id: true,
                        titulo: true
                    }
                }
            }
        });
    } else {
        return await prisma.assinatura.findMany({
            where: {
                status: 'CANCELADA',
                alunoId: userId
            },
            include: {
                plano: {
                    select: {
                        id: true,
                        titulo: true
                    }
                }
            }
        });
    }
}

export const updateAssinaturaStatus = async (
    updateAssinaturaSchema: UpdateAssinaturaInput,
    userId: string,
    tipo: 'coach' | 'aluno'
) => {
    const assinatura = await prisma.assinatura.findUnique({
        where: { id: updateAssinaturaSchema.id },
        include: {
            aluno: { select: { id: true, nome: true, coachId: true } },
            plano: { select: { id: true, titulo: true } }
        }
    });

    if (!assinatura) throw new ApiError(404, 'Assinatura não encontrada');
    if (tipo === 'aluno' && assinatura.alunoId !== userId) throw new ApiError(403, 'Acesso não autorizado');
    if (tipo === 'coach' && assinatura.aluno.coachId !== userId) throw new ApiError(403, 'Acesso não autorizado');

    let status = assinatura.status;
    let comprovanteUrl = assinatura.comprovante_url;

    // Aluno envia comprovante
    if (tipo === 'aluno' && updateAssinaturaSchema.comprovante_url) {
        if (comprovanteUrl) {
            await deleteFileFromSupabase(comprovanteUrl, 'comprovantes');
        }

        const file = {
            buffer: updateAssinaturaSchema.comprovante_url,
            originalname: `comprovante-${Date.now()}.${'jpg'}`,
            mimetype: 'image/jpeg'
        };
        comprovanteUrl = await uploadFileToSupabase(file, 'comprovantes');
        status = 'PENDENTE_APROVACAO';
    }

    // Coach aprova
    if (tipo === 'coach' && updateAssinaturaSchema.status === 'ATIVA') {
        status = 'ATIVA';
    }

    // Coach rejeita
    if (tipo === 'coach' && updateAssinaturaSchema.status === 'CANCELADA') {
        status = 'CANCELADA';
        if (comprovanteUrl) {
            await deleteFileFromSupabase(comprovanteUrl, 'comprovantes');
            comprovanteUrl = null;
        }
    }

    const updatedAssinatura = await prisma.assinatura.update({
        where: { id: updateAssinaturaSchema.id },
        data: {
            status,
            comprovante_url: comprovanteUrl,
            parcela: updateAssinaturaSchema.parcela ?? assinatura.parcela
        }
    });

    return updatedAssinatura;
}

export const deleteAssinaturaService = async (id: string, userId: string, tipo: 'coach' | 'aluno') => {
    const assinatura = await prisma.assinatura.findUnique({
        where: { id },
        include: {
            aluno: {
                select: {
                    id: true,
                    coachId: true
                }
            }
        }
    });

    if (!assinatura) {
        throw new ApiError(404, 'Assinatura não encontrada');
    }

    if (tipo === 'coach' && assinatura.aluno.coachId !== userId) {
        throw new ApiError(403, 'Acesso não autorizado');
    }

    if (tipo === 'aluno' && assinatura.alunoId !== userId) {
        throw new ApiError(403, 'Acesso não autorizado');
    }

    if (assinatura.comprovante_url) {
        await deleteFileFromSupabase(assinatura.comprovante_url, 'comprovantes');
    }

    await prisma.assinatura.delete({ where: { id } });

    return { success: true };
};