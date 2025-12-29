import {
    BadRequestException,
    Injectable,
    InternalServerErrorException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Prisma, User } from 'generated/prisma/client'
import { PrismaService } from 'src/common/services/prisma.service'
import { JwtPayload } from 'src/common/types/types'
import { PasswordUtil } from 'src/common/utils'
import { LoginDto, RegisterDto } from './auth.dto'

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) {}

    async findUserByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email }
        })
    }

    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({
            data
        })
    }

    async getToken(user: User): Promise<string> {
        try {
            const payload: JwtPayload = {
                id: user.id,
                name: user.name,
                email: user.email
            }
            return await this.jwtService.signAsync(payload)
        } catch (error) {
            throw new InternalServerErrorException(
                `Failed to generate token: ${error.message}`
            )
        }
    }

    async login(loginDto: LoginDto) {
        const user = await this.findUserByEmail(loginDto.email)
        if (!user) {
            throw new BadRequestException('Invalid email or password')
        }

        const isPasswordValid = await PasswordUtil.comparePassword(
            loginDto.password,
            user.password
        )

        if (!isPasswordValid) {
            throw new BadRequestException('Invalid email or password')
        }

        const token = await this.getToken(user)

        return {
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                },
                token: token
            }
        }
    }

    async register(registerDto: RegisterDto) {
        const userExist = await this.findUserByEmail(registerDto.email)
        if (userExist) {
            throw new BadRequestException('Email already in use')
        }

        const hashPassword = await PasswordUtil.hashPassword(
            registerDto.password
        )

        await this.createUser({
            email: registerDto.email,
            password: hashPassword,
            name: registerDto.name
        })

        return {
            message: 'Registration successful',
            data: null
        }
    }
}
