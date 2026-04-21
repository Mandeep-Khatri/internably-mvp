import { IsArray, IsBoolean, IsInt, IsOptional, IsString, IsUrl, Max, Min } from 'class-validator';

export class UpdateMeDto {
  @IsOptional() @IsString() firstName?: string;
  @IsOptional() @IsString() lastName?: string;
  @IsOptional() @IsString() pronouns?: string;
  @IsOptional() @IsString() headline?: string;
  @IsOptional() @IsString() bio?: string;
  @IsOptional() @IsString() school?: string;
  @IsOptional() @IsString() major?: string;
  @IsOptional() @IsString() degree?: string;
  @IsOptional() @IsInt() @Min(2024) @Max(2035) graduationYear?: number;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() internshipCompany?: string;
  @IsOptional() @IsUrl() linkedinUrl?: string;
  @IsOptional() @IsUrl() avatarUrl?: string;
  @IsOptional() @IsUrl() bannerUrl?: string;
  @IsOptional() @IsBoolean() openToNetwork?: boolean;
  @IsOptional() @IsBoolean() openToInternship?: boolean;
  @IsOptional() @IsArray() @IsString({ each: true }) interests?: string[];
}
