import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CreatePostDto {
    @ApiProperty({
        example: 'How to learn NestJS',
        description: 'Post title',
        required: true
    })
    @IsNotEmpty({ message: 'Title is required' })
    title: string

    @ApiProperty({
        example: 'This is a comprehensive guide on how to learn NestJS...',
        description: 'Post content',
        required: true
    })
    @IsNotEmpty({ message: 'Content is required' })
    content: string
}
