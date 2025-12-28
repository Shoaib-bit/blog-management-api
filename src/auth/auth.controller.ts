import {
    BadRequestException,
    Body,
    Controller,
    InternalServerErrorException,
    Post
} from '@nestjs/common'
import { LoginDto, RegisterDto } from './auth.dto'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        try {
            //Todo: implement login logic
        } catch (error) {
            if (error.message) {
                throw new BadRequestException(error.message)
            }
            throw new InternalServerErrorException(
                'An unexpected error occurred'
            )
        }
    }

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        try {
            // for db testing 
            const user = await this.authService.createUser({
                email: registerDto.email,
                password: registerDto.password,
                name: registerDto.name
            })

            return { message: 'User registered successfully', userId: user.id }
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
