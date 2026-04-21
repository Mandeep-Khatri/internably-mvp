import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateGroupDto } from './dto/groups.dto';

@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  list(@Query('type') type?: string, @Query('q') q?: string) {
    return this.groupsService.list({ type, q });
  }

  @Post()
  create(@CurrentUser() user: { sub: string }, @Body() dto: CreateGroupDto) {
    return this.groupsService.create(user.sub, dto);
  }

  @Get(':id')
  detail(@Param('id') id: string) {
    return this.groupsService.detail(id);
  }

  @Post(':id/join')
  join(@Param('id') id: string, @CurrentUser() user: { sub: string }) {
    return this.groupsService.join(id, user.sub);
  }

  @Post(':id/leave')
  leave(@Param('id') id: string, @CurrentUser() user: { sub: string }) {
    return this.groupsService.leave(id, user.sub);
  }

  @Get(':id/members')
  members(@Param('id') id: string) {
    return this.groupsService.members(id);
  }

  @Get(':id/posts')
  posts(@Param('id') id: string) {
    return this.groupsService.groupPosts(id);
  }
}
