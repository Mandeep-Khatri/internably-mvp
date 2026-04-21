import { IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString() content!: string;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsString() groupId?: string;
}

export class UpdatePostDto {
  @IsOptional() @IsString() content?: string;
  @IsOptional() @IsString() imageUrl?: string;
}

export class CreateCommentDto {
  @IsString() content!: string;
}
