import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AvailableRoomsDto } from './dto/available-rooms.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomsService } from './rooms.service';

@ApiTags('Rooms')
@ApiBearerAuth()
@Controller('api/v1/rooms')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoomsController {
  constructor(private readonly rooms: RoomsService) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Tambah ruangan (ADMIN)' })
  create(@Body() input: CreateRoomDto) {
    return this.rooms.create(input);
  }

  @Get('available')
  @ApiOperation({ summary: 'Lihat ruangan aktif tanpa jadwal bentrok' })
  available(@Query() query: AvailableRoomsDto) {
    return this.rooms.available(query);
  }
}
