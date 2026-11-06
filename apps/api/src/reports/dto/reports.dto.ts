import { ReportStatus } from '@prisma/client';
import { IsEnum, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export const REPORT_REASONS = [
  'HARASSMENT',
  'HATE_SPEECH',
  'SEXUAL_CONTENT',
  'VIOLENCE_OR_THREATS',
  'SCAM_OR_IMPERSONATION',
  'SPAM',
  'PRIVACY_VIOLATION',
  'OTHER',
] as const;

export class CreateReportDto {
  @IsString()
  @IsIn(REPORT_REASONS)
  reason!: (typeof REPORT_REASONS)[number];

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  details?: string;
}

export class UpdateReportStatusDto {
  @IsEnum(ReportStatus)
  status!: ReportStatus;
}
