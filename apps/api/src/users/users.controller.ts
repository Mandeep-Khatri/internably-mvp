import { Body, Controller, Delete, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { UpdateMeDto } from './dto/users.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  me(@CurrentUser() user: { sub: string }) {
    return this.usersService.me(user.sub);
  }

  @Patch('me')
  updateMe(@CurrentUser() user: { sub: string }, @Body() dto: UpdateMeDto) {
    return this.usersService.updateMe(user.sub, dto);
  }

  @Delete('me')
  deleteMe(@CurrentUser() user: { sub: string }) {
    return this.usersService.deleteMe(user.sub);
  }

  @Get('search')
  search(
    @CurrentUser() user: { sub: string },
    @Query() query: Record<string, string | undefined>,
  ) {
    return this.usersService.search(user.sub, query);
  }

  @Get('suggestions')
  suggestions(@CurrentUser() user: { sub: string }) {
    return this.usersService.suggestions(user.sub);
  }

  @Get(':id')
  byId(@CurrentUser() user: { sub: string }, @Param('id') id: string) {
    return this.usersService.profileById(user.sub, id);
  }
}
