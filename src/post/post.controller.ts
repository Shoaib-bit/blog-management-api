import {
    BadRequestException,
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    Param,
    Post,
    Req,
    UseGuards
} from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { Request } from 'express'
import { AuthGuard } from 'src/common/guard'
import { CreatePostDto } from './post.dto'

@Controller('posts')
export class PostController {
    @Get()
    getPosts() {
        try {
            //Todo: Implement logic to get posts
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
    createPost(@Req() req: Request, @Body() createPostDto: CreatePostDto) {
        try {
            console.log(req.user, createPostDto)
        } catch (error) {
            if (error.message) {
                throw new BadRequestException(error.message)
            }
            throw new InternalServerErrorException(
                'An unexpected error occurred'
            )
        }
    }

    @Get(':id')
    getPostById(@Param('id') id: string) {
        try {
            //Todo: Implement logic to get a post by ID
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
