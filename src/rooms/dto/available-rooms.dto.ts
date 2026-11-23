import { ApiProperty } from '@nestjs/swagger';

export class AvailableRoomsDto {
  @ApiProperty({ example: '2026-12-01T10:00:00Z' })
  start!: string;

  @ApiProperty({ example: '2026-12-01T12:00:00Z' })
  end!: string;
}
