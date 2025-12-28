import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Prisma, User } from 'generated/prisma/client'
import { PrismaService } from 'src/common/services/prisma.service'
import { JwtPayload } from 'src/common/types/types'

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
}
