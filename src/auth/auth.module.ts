import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';

import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error('JWT_SECRET is required');
}

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret,
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthRepository,
    AuthService,
    JwtAuthGuard,
    RolesGuard,
  ],
  exports: [
    JwtModule,
    JwtAuthGuard,
    RolesGuard,
  ],
})
export class AuthModule { }