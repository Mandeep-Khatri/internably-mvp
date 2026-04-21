import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ConfirmUploadDto, CreateUploadUrlDto } from './dto/media.dto';
import { MediaService } from './media.service';

@Controller('media')
@UseGuards(JwtAuthGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload-url')
  createUploadUrl(@CurrentUser() user: { sub: string }, @Body() dto: CreateUploadUrlDto) {
    return this.mediaService.createUploadUrl(user.sub, dto);
  }

  @Post('confirm')
  confirmUpload(@CurrentUser() user: { sub: string }, @Body() dto: ConfirmUploadDto) {
    return this.mediaService.confirmUpload(user.sub, dto);
  }
}

