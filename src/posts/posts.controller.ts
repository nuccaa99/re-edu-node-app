import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'Post successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Req() request, @Body() createPostDto: CreatePostDto) {
    const userId = request.userId || null;
    return this.postsService.create(userId, createPostDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all posts' })
  @ApiResponse({ status: 200, description: 'List of all posts.' })
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single post by ID' })
  @ApiResponse({ status: 200, description: 'Post details.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a post by ID' })
  @ApiResponse({ status: 200, description: 'Post successfully updated.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post by ID' })
  @ApiResponse({ status: 200, description: 'Post successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
