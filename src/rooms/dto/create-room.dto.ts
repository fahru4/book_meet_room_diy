import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty({ example: 'Ruang Garuda' })
  name!: string;

  @ApiProperty({ example: 10, minimum: 1 })
  capacity!: number;
}
