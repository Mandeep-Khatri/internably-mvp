import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateReportDto } from './dto/reports.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('users/:id')
  reportUser(
    @CurrentUser() user: { sub: string },
    @Param('id') id: string,
    @Body() dto: CreateReportDto,
  ) {
    return this.reportsService.reportUser(user.sub, id, dto);
  }

  @Post('posts/:id')
  reportPost(
    @CurrentUser() user: { sub: string },
    @Param('id') id: string,
    @Body() dto: CreateReportDto,
  ) {
    return this.reportsService.reportPost(user.sub, id, dto);
  }
}
