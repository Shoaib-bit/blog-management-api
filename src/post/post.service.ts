import { Injectable } from '@nestjs/common'
import { Prisma } from 'generated/prisma/client'
import { PrismaService } from 'src/common/services/prisma.service'

@Injectable()
export class PostService {
    constructor(private prisma: PrismaService) {}

    async createPost(data: Prisma.PostCreateInput) {
        return this.prisma.post.create({
            data,
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        })
    }
}
