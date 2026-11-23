import { BadRequestException } from '@nestjs/common';

export function parseUtc(value: unknown): Date {
  if (typeof value !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(value)) {
    throw invalidTime();
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 19) !== value.slice(0, 19)) {
    throw invalidTime();
  }
  return parsed;
}

export function validRange(start: unknown, end: unknown, mustBeFuture: boolean) {
  const startTime = parseUtc(start);
  const endTime = parseUtc(end);
  if (endTime <= startTime || (mustBeFuture && startTime < new Date())) {
    throw invalidTime();
  }
  return { startTime, endTime };
}

export function isoUtc(date: Date): string {
  return date.toISOString().replace(/\.000Z$/, 'Z');
}

function invalidTime(): BadRequestException {
  return new BadRequestException({
    error_code: 'INVALID_TIME',
    message: 'Waktu tidak valid. Gunakan ISO-8601 UTC dan pastikan end setelah start.',
  });
}
