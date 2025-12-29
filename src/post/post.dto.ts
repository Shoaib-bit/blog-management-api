import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength, MinLength } from 'class-validator'

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


export class GetPostsDto {
    @ApiProperty({
        description: 'Search keyword',
        example: 'john',
        required: false
    })
    @IsOptional()
    @IsString()
    query?: string

    @ApiProperty({
        description: 'Page number',
        example: 1,
        required: false
    })
    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    @IsNumber()
    page: number = 1

    @ApiProperty({
        description: 'Items per page',
        example: 10,
        required: false
    })
    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    @IsNumber()
    limit: number = 10
}
