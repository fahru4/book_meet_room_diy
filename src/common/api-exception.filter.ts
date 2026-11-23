import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { Response } from 'express';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  catch(error: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const isHttp = error instanceof HttpException;
    const status = isHttp ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const detail = isHttp ? error.getResponse() : undefined;
    const body = typeof detail === 'object' && detail !== null ? detail as Record<string, unknown> : {};
    if (!isHttp) this.logger.error(error);

    const fallbackCodes: Record<number, string> = {
      400: 'BAD_REQUEST', 401: 'UNAUTHORIZED', 403: 'FORBIDDEN',
      404: 'NOT_FOUND', 409: 'CONFLICT',
    };
    const errorCode = typeof body.error_code === 'string'
      ? body.error_code : (fallbackCodes[status] ?? 'INTERNAL_SERVER_ERROR');
    const rawMessage = body.message;
    const message = status >= 500
      ? 'Terjadi kesalahan pada server'
      : typeof rawMessage === 'string' ? rawMessage
      : Array.isArray(rawMessage) ? rawMessage.join(', ')
      : isHttp ? error.message : 'Terjadi kesalahan';

    response.status(status).json({ error_code: errorCode, message });
  }
}
