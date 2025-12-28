import {
    BadRequestException,
    Body,
    Controller,
    InternalServerErrorException,
    Post
} from '@nestjs/common'
import { PasswordUtil } from 'src/common/utils'
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
            const userExist = await this.authService.findUserByEmail(
                registerDto.email
            )
            if (userExist) {
                throw new BadRequestException('Email already in use')
            }

            const hashPassword = await PasswordUtil.hashPassword(
                registerDto.password
            )

            await this.authService.createUser({
                email: registerDto.email,
                password: hashPassword,
                name: registerDto.name
            })

            return { message: 'User registered successfully' }
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
