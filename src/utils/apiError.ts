export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors: any[] = [],
    public stack: string = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
