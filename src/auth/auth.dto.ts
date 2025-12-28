import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator'

export class LoginDto {
    @ApiProperty({
        example: 'test@example.com',
        description: 'User email address',
        required: true
    })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string

    @ApiProperty({
        example: 'StrongP@ssw0rd',
        description: 'User password',
        required: true
    })
    @IsNotEmpty({ message: 'Password is required' })
    password: string
}

export class RegisterDto {
    @ApiProperty({
        example: 'test123',
        description: 'Name for the user',
        required: true
    })
    @IsNotEmpty({ message: 'Name is required' })
    name: string

    @ApiProperty({
        example: 'test@example.com',
        description: 'User email address (must be unique)',
        required: true
    })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string

    @ApiProperty({
        example: 'StrongP@ssw0rd',
        description:
            'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character',
        required: true,
        minLength: 6
    })
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/, {
        message:
            'Password too weak. Must include uppercase, lowercase, number, and special character'
    })
    password: string

    @ApiProperty({
        example: 'StrongP@ssw0rd',
        description: 'Confirm password (must match password)',
        required: true
    })
    @IsNotEmpty({ message: 'Confirm Password is required' })
    confirmPassword: string
}
