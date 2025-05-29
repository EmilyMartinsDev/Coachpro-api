export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly details?: unknown,
    public readonly isOperational = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends ApiError {
  constructor(message = 'Requisição inválida', details?: unknown) {
    super(400, message, details);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Não autorizado') {
    super(401, message);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Acesso proibido') {
    super(403, message);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Recurso não encontrado') {
    super(404, message);
  }
}

export class ConflictError extends ApiError {
  constructor(message = 'Conflito de recursos') {
    super(409, message);
  }
}