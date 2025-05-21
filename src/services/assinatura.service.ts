import { prisma } from '../config/database';
import { ApiError } from '../utils/apiError';
import { CreateAssinaturaInput, UpdateAssinaturaInput } from '../schemas/assinatura.schema';
import { stat } from 'fs';

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

    return await prisma.assinatura.create({
        data: {
            alunoId,
            planoId,
            status: input.status,
            dataInicio: new Date(input.dataInicio),
            dataFim,
            valor: input.valor,
            // Se comprovante_pagamento for enviado como arquivo (buffer), salve como blob
            comprovante_pagamento: input.comprovante_pagamento instanceof Buffer ? input.comprovante_pagamento : undefined,
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

    // Lógica de status e comprovante
    let status = assinatura.status;
    let comprovante_pagamento = assinatura.comprovante_pagamento;

    // Aluno envia comprovante
    if (tipo === 'aluno' && updateAssinaturaSchema.comprovante_pagamento) {
        status = 'PENDENTE_APROVACAO';
        comprovante_pagamento = updateAssinaturaSchema.comprovante_pagamento;
    }

    // Coach aprova
    if (tipo === 'coach' && updateAssinaturaSchema.status === 'ATIVA') {
        status = 'ATIVA';
    }

    // Coach rejeita
    if (tipo === 'coach' && updateAssinaturaSchema.status === 'CANCELADA') {
        status = 'CANCELADA';
        comprovante_pagamento = null;
    }

    // Cancelamento automático (expirou prazo e não tem comprovante)
    if (updateAssinaturaSchema.status === 'CANCELADA' && !assinatura.comprovante_pagamento) {
        status = 'CANCELADA';
    }

    const updatedAssinatura = await prisma.assinatura.update({
        where: { id: updateAssinaturaSchema.id },
        data: {
            status,
            comprovante_pagamento,
            parcela: updateAssinaturaSchema.parcela ?? assinatura.parcela
        }
    });

    return updatedAssinatura;
}
