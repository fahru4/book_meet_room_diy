import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoomsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(name: string, capacity: number) {
    return this.prisma.room.create({
      data: { name, capacity },
      select: { id: true, name: true, capacity: true, isActive: true },
    });
  }

  findAvailable(startTime: Date, endTime: Date) {
    return this.prisma.room.findMany({
      where: {
        isActive: true,
        bookings: { none: {
          status: 'CONFIRMED',
          startTime: { lt: endTime },
          endTime: { gt: startTime },
        } },
      },
      select: { id: true, name: true, capacity: true },
      orderBy: { id: 'asc' },
    });
  }
}
