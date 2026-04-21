import { GroupType } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateGroupDto {
  @IsString() name!: string;
  @IsEnum(GroupType) type!: GroupType;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() bannerUrl?: string;
}
