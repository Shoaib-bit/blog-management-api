import { Injectable } from '@nestjs/common'
import { Prisma, User } from 'generated/prisma/client'
import { PrismaService } from 'src/common/services/prisma.service'

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({
            data
        })
    }
}
