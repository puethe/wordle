export enum ErrorCode {
  BAD_REQUEST = 400,
}

export class CustomError extends Error {
  private static readonly _statusCode = ErrorCode.BAD_REQUEST;
  private readonly _code: number;

  constructor(params?: { code?: number; message?: string }) {
    const { code, message } = params || {};

    super(message || 'Bad request');
    this._code = code || CustomError._statusCode;

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  public get statusCode() {
    return this._code;
  }
}
