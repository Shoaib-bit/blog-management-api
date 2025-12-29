import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class CreatePostDto {
    @ApiProperty({
        example: 'How to learn NestJS',
        description: 'Post title',
        required: true,
        minLength: 3,
        maxLength: 200
    })
    @IsNotEmpty({ message: 'Title is required' })
    @IsString({ message: 'Title must be a string' })
    @MinLength(3, { message: 'Title must be at least 3 characters long' })
    @MaxLength(200, { message: 'Title must not exceed 200 characters' })
    title: string

    @ApiProperty({
        example: 'This is a comprehensive guide on how to learn NestJS...',
        description: 'Post content',
        required: true,
        minLength: 10
    })
    @IsNotEmpty({ message: 'Content is required' })
    @IsString({ message: 'Content must be a string' })
    @MinLength(10, { message: 'Content must be at least 10 characters long' })
    content: string
}
