import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { SubmitApplicationDto } from './dto/applications.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  submit(@Body() dto: SubmitApplicationDto, @Query('userId') userId?: string) {
    return this.applicationsService.submit(userId ?? null, dto);
  }

  @Get('me')
  me(@Query('email') email: string) {
    return this.applicationsService.me(email);
  }
}
