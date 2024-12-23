import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  private posts = [
    {
      id: 1,
      title: 'title1',
      content: 'random content 1',
      userEmail: 'n@gmail.com',
    },
    {
      id: 2,
      title: 'title2',
      content: 'random content 2',
      userEmail: 'n@gmail.com',
    },
  ];
  create(createPostDto: CreatePostDto) {
    const lastId = this.posts[length - 1]?.id || 0;
    const newPost = {
      id: lastId + 1,
      title: createPostDto.title,
      content: createPostDto.content,
      userEmail: 'test@gmail.com',
    };
    this.posts.push(newPost);
    return { message: 'created successfully', data: newPost };
  }

  findAll() {
    return this.posts;
  }

  findOne(id: number) {
    const post = this.posts.find((el) => el.id === id);
    if (!post) return [];
    return post;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    const index = this.posts.findIndex((el) => el.id === id);
    if (index === -1) {
      throw new BadRequestException('post could not be deleted');
    }
    if (updatePostDto.title) this.posts[index].title = updatePostDto.title;
    if (updatePostDto.content)
      this.posts[index].content = updatePostDto.content;
    return { message: 'updated successfully', data: this.posts[index] };
  }

  remove(id: number) {
    const index = this.posts.findIndex((el) => el.id === id);
    if (index === -1) {
      throw new BadRequestException('post could not be deleted');
    }
    const deletedPost = this.posts.splice(index, 1);
    return { message: 'deletedSuccessfully', data: deletedPost };
  }
}
