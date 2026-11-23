import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthRepository } from './auth.repository';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly repository: AuthRepository, private readonly jwt: JwtService) {}

  async login(input: LoginDto): Promise<{ token: string }> {
    const email = typeof input?.email === 'string' ? input.email.trim() : '';
    const password = typeof input?.password === 'string' ? input.password : '';
    const user = email && password ? await this.repository.findByEmail(email) : null;

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException({
        error_code: 'INVALID_CREDENTIALS',
        message: 'Email atau password salah',
      });
    }

    const token = await this.jwt.signAsync({ sub: user.id, role: user.role });
    return { token };
  }
}
