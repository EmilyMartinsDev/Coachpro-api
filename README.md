# Coach API

API RESTful para gerenciamento de coaches, alunos, planos, assinaturas, pagamentos, feedbacks, anamnese, treinos e planos alimentares.

## Tecnologias
- Node.js + Express
- TypeScript
- Prisma ORM (PostgreSQL)
- JWT Auth
- Zod Validation

## Autenticação
- JWT obrigatório em todas as rotas protegidas (exceto login e registro)
- Envie o token no header: `Authorization: Bearer <token>`

## Endpoints Detalhados e Exemplos

### Auth
- `POST /api/auth/coach/register` — Registra coach
```json
{
  "nome": "Coach Teste",
  "email": "coach@email.com",
  "senha": "123456",
  "telefone": "11999999999",
  "dataNascimento": "1990-01-01"
}
```
- `POST /api/auth/aluno/register` — Registra aluno
```json
{
  "nome": "Aluno Teste",
  "email": "aluno@email.com",
  "senha": "123456",
  "telefone": "11988888888",
  "dataNascimento": "2000-01-01",
  "coachId": "<id_do_coach>"
}
```
- `POST /api/auth/login` — Login coach/aluno
```json
{
  "email": "coach@email.com",
  "senha": "123456",
  "tipo": "coach"
}
```

### Coach
- `GET /api/coachs/` — Lista todos os coaches
- `GET /api/coachs/:id` — Detalhe do coach
- `PUT /api/coachs/:id` — Atualiza coach
```json
{
  "nome": "Coach Atualizado",
  "telefone": "11999999999"
}
```

### Aluno
- `GET /api/alunos/` — Lista alunos do coach ou dados do próprio aluno
- `GET /api/alunos/:id` — Detalhe do aluno
- `GET /api/alunos/coach/:coachId` — Alunos de um coach
- `PUT /api/alunos/:id` — Atualiza dados do aluno
```json
{
  "nome": "Aluno Atualizado",
  "telefone": "11988888888"
}
```

### Plano
- `GET /api/planos/` — Lista planos
- `POST /api/planos/` — Cria plano (coach)
```json
{
  "titulo": "Plano Mensal",
  "descricao": "Acesso por 1 mês",
  "valor": 300,
  "duracao": 1
}
```
- `PUT /api/planos/:id` — Atualiza plano (coach)
```json
{
  "titulo": "Plano Mensal Atualizado",
  "valor": 350
}
```
- `DELETE /api/planos/:id` — Remove plano (coach)

### Assinatura
- `GET /api/assinaturas/` — Lista assinaturas do usuário
- `GET /api/assinaturas/:id` — Detalhe da assinatura
- `POST /api/assinaturas/` — Cria assinatura
```json
{
  "alunoId": "<uuid>",
  "planoId": "<uuid>",
  "dataInicio": "2025-05-19",
  "dataFim": "2025-07-19",
  "valor": 600,
  "status": "PENDENTE_APROVACAO",
  "parcela": 1,
  "total_parcelas": 2,
  "comprovante_pagamento": "https://meusite.com/comprovantes/12345.png"
}
```
- `GET /api/assinaturas/aluno/:alunoId` — Assinaturas de um aluno
- `GET /api/assinaturas/pendentes` — Assinaturas pendentes (coach/aluno)
- `GET /api/assinaturas/aguardando-aprovacao` — Assinaturas aguardando aprovação (coach/aluno)
- `PUT /api/assinaturas/` — Atualiza status/comprovante (coach/aluno)
```json
{
  "id": "<id_assinatura>",
  "status": "ATIVA"
}
```

### Pagamento
- `GET /api/pagamentos/assinatura/:assinaturaId` — Pagamentos de uma assinatura
- `POST /api/pagamentos/` — Cria pagamento
```json
{
  "assinaturaId": "<id_assinatura>",
  "valor": 300,
  "dataPagamento": "2025-05-20",
  "metodo": "PIX",
  "comprovante": "https://meusite.com/comprovantes/pagamento1.png"
}
```

### Feedback
- `GET /api/feedbacks/aluno/:alunoId` — Feedbacks do aluno
- `POST /api/feedbacks/` — Cria feedback
```json
{
  "alunoId": "<id_aluno>",
  "peso": "70",
  "diaFeedback": "2025-05-19",
  "seguiuPlano": "TOTALMENTE",
  "comeuAMais": "Não",
  "refeicoesPerdidas": "0",
  "refeicaoLivre": "Não",
  "digestaoIntestino": "Normal",
  "dificuldadeAlimentos": "Nenhuma",
  "periodoMenstrual": false,
  "horasSono": "8",
  "qualidadeSono": "BOA",
  "acordouCansado": false,
  "manteveProtocolo": "TOTALMENTE",
  "efeitosColaterais": "Nenhum",
  "observacoes": "Tudo certo"
}
```

### Anamnese
- `GET /api/anamneses/aluno/:alunoId` — Anamnese do aluno
- `POST /api/anamneses/` — Cria anamnese
```json
{
  "alunoId": "<id_aluno>",
  "nomeCompleto": "Aluno Teste",
  "instagram": "@aluno",
  "email": "aluno@email.com",
  "cpf": "123.456.789-00",
  "endereco": "Rua Exemplo, 123",
  "dataNascimento": "2000-01-01",
  "dataPreenchimento": "2025-05-19",
  "altura": "1.75",
  "peso": "70",
  "rotina": "Trabalho e estudo",
  "objetivos": "Ganhar massa",
  "tempoTreino": "2 anos",
  "modalidade": "Musculação",
  "divisaoTreino": "ABCD",
  "cardio": "3x semana",
  "alimentacaoDiaria": "Normal",
  "alimentosPreferidos": "Arroz, frango",
  "possuiExames": false,
  "qtdRefeicoes": "6",
  "evolucaoRecente": "Ganho de massa",
  "dificuldades": "Nenhuma"
}
```

### Plano de Treino
- `GET /api/treinos/aluno/:alunoId` — Planos de treino do aluno
```json
[
  {
    "id": "<uuid>",
    "titulo": "Treino ABC",
    "descricao": "Treino para hipertrofia",
    "caminhoArquivo": "https://meusite.com/treinos/treinoabc.pdf",
    "createdAt": "2025-05-20T12:00:00.000Z",
    "updatedAt": "2025-05-20T12:00:00.000Z",
    "coach": { "id": "<uuid>", "nome": "Coach Teste" }
  }
]
```

### Plano Alimentar
- `GET /api/alimentares/aluno/:alunoId` — Planos alimentares do aluno
```json
[
  {
    "id": "<uuid>",
    "titulo": "Plano Alimentar 1",
    "descricao": "Plano para bulking",
    "caminhoArquivo": "https://meusite.com/alimentares/plano1.pdf",
    "createdAt": "2025-05-20T12:00:00.000Z",
    "updatedAt": "2025-05-20T12:00:00.000Z",
    "coach": { "id": "<uuid>", "nome": "Coach Teste" }
  }
]
```

### Fotos do Feedback
- `POST /api/feedbacks/:feedbackId/photos` — Faz upload de uma foto para um feedback

**Body (form-data):**
- `foto`: arquivo de imagem (campo obrigatório)

**Resposta de sucesso:**
```json
{
  "success": true,
  "data": {
    "id": "<uuid>",
    "feedbackId": "<uuid>",
    "url": "/uploads/nome-do-arquivo.jpg",
    "createdAt": "2025-05-20T12:00:00.000Z"
  }
}
```

### Exemplo de resposta para `GET /api/alunos/:id`
```json
{
    "success": true,
    "data": {
        "id": "5692d4a0-93df-4658-9320-c3985b5f1abb",
        "nome": "emilyAluno",
        "email": "emily@teste.com",
        "telefone": "31985984616",
        "dataNascimento": "2005-04-01T00:00:00.000Z",
        "coachId": "f59bf16c-ec94-4fca-8992-713b2580201d",
        "coach": {
            "id": "f59bf16c-ec94-4fca-8992-713b2580201d",
            "nome": "emily",
            "email": "emily@teste.com"
        },
        "feedbacks": [],
        "assinaturas": [
            {
                "id": "f15bfde7-be29-4f98-b8bc-b5faac4b1015",
                "alunoId": "5692d4a0-93df-4658-9320-c3985b5f1abb",
                "planoId": "ce8f9c63-5845-46f5-a391-861d14d8f9bf",
                "status": "ATIVA",
                "dataInicio": "2025-05-19T00:00:00.000Z",
                "dataFim": "2025-06-19T00:00:00.000Z",
                "valor": 320,
                "parcela": 1,
                "totalParcelas": 2,
                "comprovante_pagamento": "https://meusite.com/comprovantes/12345.png",
                "createdAt": "2025-05-19T23:42:58.523Z",
                "updatedAt": "2025-05-19T23:42:58.523Z"
            },
            {
                "id": "2adc7ce4-acd8-42ea-b77c-644ace4b9e91",
                "alunoId": "5692d4a0-93df-4658-9320-c3985b5f1abb",
                "planoId": "ce8f9c63-5845-46f5-a391-861d14d8f9bf",
                "status": "PENDENTE",
                "dataInicio": "2025-06-20T00:00:00.000Z",
                "dataFim": "2025-07-20T00:00:00.000Z",
                "valor": 320,
                "parcela": 2,
                "totalParcelas": 2,
                "comprovante_pagamento": null,
                "createdAt": "2025-05-19T23:45:37.066Z",
                "updatedAt": "2025-05-19T23:53:30.788Z"
            }
        ],
        "planosAlimentar": [],
        "planosTreino": [],
        "createdAt": "2025-05-19T21:15:07.031Z",
        "anamnese": null
    }
}
```

---

- Todos os campos obrigatórios são validados via Zod.
- Datas devem estar no formato `YYYY-MM-DD`.
- IDs são UUIDs.
- Para rotas protegidas, envie o token JWT no header.
- Para uploads, envie arquivos para `/uploads`.

Para dúvidas sobre payloads de outros endpoints, consulte os schemas ou peça exemplos específicos.