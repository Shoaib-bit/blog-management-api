import {
    BadRequestException,
    Body,
    Controller,
    InternalServerErrorException,
    Post
} from '@nestjs/common'
import { LoginDto, RegisterDto } from './auth.dto'

@Controller("auth")
export class AuthController {
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
            //Todo: implement register logic
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
