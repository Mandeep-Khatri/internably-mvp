import { ApplicationStatus } from '@prisma/client';
import { IsEmail, IsEnum, IsInt, IsOptional, IsString, IsUrl, Max, Min } from 'class-validator';

export class SubmitApplicationDto {
  @IsString() firstName!: string;
  @IsString() lastName!: string;
  @IsEmail() email!: string;
  @IsString() school!: string;
  @IsInt() @Min(2024) @Max(2035) graduationYear!: number;
  @IsString() major!: string;
  @IsOptional() @IsString() internshipCompany?: string;
  @IsString() city!: string;
  @IsOptional() @IsUrl() linkedinUrl?: string;
  @IsOptional() @IsString() proofOfEnrollmentUrl?: string;
}

export class ReviewApplicationDto {
  @IsEnum(ApplicationStatus)
  status!: ApplicationStatus;

  @IsOptional() @IsString()
  reviewNotes?: string;
}
