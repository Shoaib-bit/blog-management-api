import {
    BadRequestException,
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Post,
    Query,
    Req,
    UnauthorizedException,
    UseGuards
} from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { Request } from 'express'
import { AuthGuard } from 'src/common/guard'
import { CreatePostDto, GetPostsDto } from './post.dto'
import { PostService } from './post.service'

@Controller('posts')
export class PostController {
    constructor(private postService: PostService) {}

    @Get()
    async getPosts(@Query() queryParam: GetPostsDto) {
        try {
            const data = await this.postService.getPosts(
                queryParam.query,
                Number(queryParam.page),
                Number(queryParam.limit)
            )
            return {
                data: data,
                message: 'Get Posts Successfully'
            }
        } catch (error) {
            if (error.message) {
                throw new BadRequestException(error.message)
            }
            throw new InternalServerErrorException(
                'An unexpected error occurred'
            )
        }
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth('access-token')
    @Post()
    async createPost(
        @Req() req: Request,
        @Body() createPostDto: CreatePostDto
    ) {
        try {
            if (!req.user || !req.user.id) {
                throw new UnauthorizedException(
                    'User not authenticated or invalid user data'
                )
            }

            if (
                !createPostDto.title ||
                createPostDto.title.trim().length === 0
            ) {
                throw new BadRequestException('Title cannot be empty')
            }

            if (
                !createPostDto.content ||
                createPostDto.content.trim().length === 0
            ) {
                throw new BadRequestException('Content cannot be empty')
            }

            const post = await this.postService.createPost({
                title: createPostDto.title.trim(),
                content: createPostDto.content.trim(),
                author: {
                    connect: { id: req.user.id }
                }
            })

            return {
                message: 'Post created successfully',
                data: post
            }
        } catch (error) {
            if (error.code === 'P2003') {
                throw new NotFoundException(
                    'Author not found. Invalid user reference'
                )
            }

            if (error.code === 'P2025') {
                throw new NotFoundException('Related record not found')
            }

            if (
                error instanceof BadRequestException ||
                error instanceof UnauthorizedException ||
                error instanceof NotFoundException
            ) {
                throw error
            }

            if (error.code === 'P1001' || error.code === 'P1002') {
                throw new InternalServerErrorException(
                    'Database connection error. Please try again later'
                )
            }

            if (error.message) {
                throw new InternalServerErrorException(
                    `Failed to create post: ${error.message}`
                )
            }

            throw new InternalServerErrorException(
                'An unexpected error occurred while creating the post'
            )
        }
    }

    @Get(':id')
    async getPostById(@Param('id') id: number) {
        try {
            if (isNaN(Number(id))) {
                throw new BadRequestException('Post Id must be number')
            }

            const post = await this.postService.getPostById(Number(id))

            if (!post) {
                throw new NotFoundException('Post not found')
            }

            return {
                data: post,
                message: 'Get Post Successfully'
            }
        } catch (error) {
            if (error.message) {
                throw new BadRequestException(error.message)
            }
            throw new InternalServerErrorException(
                'An unexpected error occurred'
            )
        }
    }
}
