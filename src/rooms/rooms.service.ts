import { BadRequestException, Injectable } from '@nestjs/common';
import { validRange } from '../common/parse-time';
import { CreateRoomDto } from './dto/create-room.dto';
import { AvailableRoomsDto } from './dto/available-rooms.dto';
import { RoomsRepository } from './rooms.repository';

@Injectable()
export class RoomsService {
  constructor(private readonly repository: RoomsRepository) {}

  async create(input: CreateRoomDto) {
    if (typeof input?.name !== 'string' || !input.name.trim() || input.name.trim().length > 100 ||
        !Number.isInteger(input?.capacity) || input.capacity <= 0) {
      throw new BadRequestException({
        error_code: 'INVALID_ROOM',
        message: 'Nama ruangan dan kapasitas harus valid',
      });
    }

    const room = await this.repository.create(input.name.trim(), input.capacity);
    return { id: room.id, name: room.name, capacity: room.capacity, is_active: room.isActive };
  }

  async available(input: AvailableRoomsDto) {
    const { startTime, endTime } = validRange(input?.start, input?.end, false);
    const rooms = await this.repository.findAvailable(startTime, endTime);
    return { data: rooms };
  }
}
