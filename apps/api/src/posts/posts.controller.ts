import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateCommentDto, CreatePostDto, UpdatePostDto } from './dto/posts.dto';
import { PostsService } from './posts.service';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('feed')
  feed(@CurrentUser() user: { sub: string }) {
    return this.postsService.feed(user.sub);
  }

  @Post()
  create(@CurrentUser() user: { sub: string }, @Body() dto: CreatePostDto) {
    return this.postsService.create(user.sub, dto);
  }

  @Get(':id')
  byId(@Param('id') id: string) {
    return this.postsService.getById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @CurrentUser() user: { sub: string }, @Body() dto: UpdatePostDto) {
    return this.postsService.update(id, user.sub, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser() user: { sub: string }) {
    return this.postsService.delete(id, user.sub);
  }

  @Post(':id/like')
  like(@Param('id') id: string, @CurrentUser() user: { sub: string }) {
    return this.postsService.like(id, user.sub);
  }

  @Delete(':id/like')
  unlike(@Param('id') id: string, @CurrentUser() user: { sub: string }) {
    return this.postsService.unlike(id, user.sub);
  }

  @Post(':id/comments')
  comment(@Param('id') id: string, @CurrentUser() user: { sub: string }, @Body() dto: CreateCommentDto) {
    return this.postsService.comment(id, user.sub, dto);
  }

  @Get(':id/comments')
  comments(@Param('id') id: string) {
    return this.postsService.comments(id);
  }
}
