import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RoomsModule } from './rooms/rooms.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
    imports: [
        AuthModule,
        PrismaModule,
        RoomsModule
    ],
})
export class AppModule { }