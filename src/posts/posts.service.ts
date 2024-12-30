import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './schema/post.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    private UsersService: UsersService,
  ) {}

  async create(userId: string, createPostDto: CreatePostDto) {
    const user = await this.UsersService.findOne(userId);
    if (!Object.keys(user).length)
      throw new BadRequestException('user not found');
    if ('_id' in user) {
      const post = await this.postModel.create({
        ...createPostDto,
        user: user._id,
      });
      await this.UsersService.addPostId(user._id, post._id);
      return post;
    }
  }

  findAll() {
    return this.postModel.find().populate('user');
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, UpdatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
