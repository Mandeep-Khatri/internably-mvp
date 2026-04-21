import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApplicationStatus, Role } from '@prisma/client';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ReviewApplicationDto } from './dto/applications.dto';

@Controller('admin/applications')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.MODERATOR)
export class AdminApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  list(@Query('status') status?: ApplicationStatus) {
    return this.applicationsService.adminList(status);
  }

  @Patch(':id')
  review(
    @Param('id') id: string,
    @CurrentUser() user: { sub: string },
    @Body() dto: ReviewApplicationDto,
  ) {
    return this.applicationsService.review(id, user.sub, dto.status, dto.reviewNotes);
  }
}
