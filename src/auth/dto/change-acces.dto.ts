import { IsBoolean, IsOptional } from 'class-validator';

export class ChangeAccessDto {
  @IsOptional()
  @IsBoolean()
  allowStaffModify: boolean;

  @IsOptional()
  @IsBoolean()
  allowCategoryModify: boolean;

  @IsOptional()
  @IsBoolean()
  allowReservationModify: boolean;
}
