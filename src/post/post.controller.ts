import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    Req,
    UseGuards
} from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { Request } from 'express'
import { AuthGuard } from 'src/common/guard'
import { CreatePostDto, GetPostsDto, UpdatePostDto } from './post.dto'
import { PostService } from './post.service'

@Controller('posts')
export class PostController {
    constructor(private postService: PostService) {}

    @Get()
    async getPosts(@Query() queryParam: GetPostsDto) {
        const data = await this.postService.getPosts(
            queryParam.query,
            Number(queryParam.page) || 1,
            Number(queryParam.limit) || 10
        )

        return {
            data,
            message: 'Posts retrieved successfully'
        }
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth('access-token')
    @Post()
    async createPost(
        @Req() req: Request,
        @Body() createPostDto: CreatePostDto
    ) {
        const post = await this.postService.createPost(
            createPostDto,
            req.user!.id
        )

        return {
            message: 'Post created successfully',
            data: post
        }
    }

    @Get(':id')
    async getPostById(@Param('id', ParseIntPipe) id: number) {
        const post = await this.postService.getPostById(id)

        return {
            data: post,
            message: 'Post retrieved successfully'
        }
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth('access-token')
    @Put(':id')
    async updatePost(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePostDto: UpdatePostDto
    ) {
        const updatedPost = await this.postService.updatePost(
            id,
            updatePostDto,
            req.user!.id
        )

        return {
            message: 'Post updated successfully',
            data: updatedPost
        }
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth('access-token')
    @Delete(':id')
    async deletePost(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number
    ) {
        await this.postService.deletePost(id, req.user!.id)

        return {
            message: 'Post deleted successfully'
        }
    }
}
