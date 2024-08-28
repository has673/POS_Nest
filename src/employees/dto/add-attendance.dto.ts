import { AttendanceStatus } from '@prisma/client';
import { IsDate, IsEnum, IsInt } from 'class-validator';

export class AddAttendanceDto {
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @IsDate()
  date: Date;
}
