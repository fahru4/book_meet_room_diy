import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

export type AuthUser = { id: number; role: 'ADMIN' | 'USER' };
export type AuthRequest = Request & { user: AuthUser };

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const header = request.headers.authorization;
    const [scheme, token] = header?.split(' ') ?? [];

    if (scheme !== 'Bearer' || !token) throw this.unauthorized();

    try {
      const payload = await this.jwt.verifyAsync<{ sub: number; role: string }>(token);
      if (!Number.isInteger(payload.sub) || !['ADMIN', 'USER'].includes(payload.role)) {
        throw this.unauthorized();
      }
      request.user = { id: payload.sub, role: payload.role as AuthUser['role'] };
      return true;
    } catch {
      throw this.unauthorized();
    }
  }

  private unauthorized(): UnauthorizedException {
    return new UnauthorizedException({
      error_code: 'UNAUTHORIZED',
      message: 'Token tidak valid atau belum diberikan',
    });
  }
}
