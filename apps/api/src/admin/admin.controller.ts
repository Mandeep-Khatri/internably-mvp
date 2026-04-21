import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.MODERATOR)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('reports')
  reports() {
    return this.adminService.reports();
  }

  @Delete('posts/:id')
  removePost(@Param('id') id: string) {
    return this.adminService.removePost(id);
  }

  @Get('groups')
  groups() {
    return this.adminService.manageGroups();
  }

  @Patch('members/:id/verify')
  verify(@Param('id') id: string, @Body() body: { isVerified: boolean }) {
    return this.adminService.verifyMember(id, body.isVerified);
  }
}
