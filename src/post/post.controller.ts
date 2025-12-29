import {
    BadRequestException,
    Controller,
    Get,
    InternalServerErrorException,
    Param
} from '@nestjs/common'

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
