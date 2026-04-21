import { IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterPushTokenDto {
  @IsString()
  @MinLength(10)
  token!: string;

  @IsString()
  @IsOptional()
  platform?: string;
}

export class RemovePushTokenDto {
  @IsString()
  @MinLength(10)
  token!: string;
}

