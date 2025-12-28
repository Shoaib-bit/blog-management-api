import {
    BadRequestException,
    Controller,
    Get,
    InternalServerErrorException,
    Param
} from '@nestjs/common'

@Controller('blogs')
export class BlogController {
    @Get()
    getBlogs() {
        try {
            //Todo: Implement logic to get blogs
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
    getBlogById(@Param('id') id: string) {
        try {
            //Todo: Implement logic to get a blog by ID
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
