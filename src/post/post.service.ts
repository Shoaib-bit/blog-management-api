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

    async getPosts(search: string = '', page: number = 1, limit: number = 10) {
        const where = search
            ? {
                  OR: [
                      { title: { contains: search } },
                      { content: { contains: search } }
                  ]
              }
            : {}

        const [posts, count] = await Promise.all([
            this.prisma.post.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            this.prisma.post.count({ where })
        ])

        return {
            posts,
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit)
            }
        }
    }

    async getPostById(id: number) {
        return this.prisma.post.findUnique({
            where: { id },
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

    async updatePost(id: number, data: Prisma.PostUpdateInput) {
        return this.prisma.post.update({
            where: { id },
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

    async deletePost(id: number) {
        return this.prisma.post.delete({
            where: { id }
        })
    }
}
