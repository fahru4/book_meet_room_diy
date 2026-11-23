import 'dotenv/config';
import { ConflictException } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { BookingsRepository } from '../src/bookings/bookings.repository';
import { BookingsService } from '../src/bookings/bookings.service';

async function main() {
  const prisma = new PrismaService();
  const service = new BookingsService(prisma, new BookingsRepository());
  await prisma.$connect();

  let roomId: number | undefined;
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: 'user1@test.com' },
    });

    const room = await prisma.room.create({
      data: { name: 'Concurrency Test Room', capacity: 10 },
    });
    roomId = room.id;

    const start = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const input = {
      room_id: room.id,
      title: 'Parallel booking test',
      start_time: start.toISOString(),
      end_time: end.toISOString(),
    };

    const results = await Promise.allSettled(
      Array.from({ length: 10 }, () => service.create(user.id, input)),
    );

    const success = results.filter((result) => result.status === 'fulfilled').length;
    const conflict = results.filter((result) =>
      result.status === 'rejected' && result.reason instanceof ConflictException,
    ).length;

    console.log({ success, conflict, total: results.length });
    if (success !== 1 || conflict !== 9) {
      throw new Error('Concurrent booking invariant failed');
    }
  } finally {
    if (roomId !== undefined) {
      await prisma.booking.deleteMany({ where: { roomId } });
      await prisma.room.delete({ where: { id: roomId } });
    }
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
