import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUploadUrlDto {
  @IsString()
  @MinLength(1)
  fileName!: string;

  @IsString()
  @IsOptional()
  mimeType?: string;

  @IsString()
  @IsOptional()
  kind?: string;
}

export class ConfirmUploadDto {
  @IsString()
  @MinLength(1)
  url!: string;

  @IsString()
  @MinLength(1)
  mimeType!: string;

  @IsString()
  @MinLength(1)
  kind!: string;
}

