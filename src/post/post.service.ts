import {
    BadRequestException,
    Injectable,
    NotFoundException
} from '@nestjs/common'
import { Post } from 'generated/prisma/client'
import { PostOwnershipException } from 'src/common/exceptions/post-ownership.exception'
import { PrismaService } from 'src/common/services/prisma.service'
import { CreatePostDto, UpdatePostDto } from './post.dto'

export interface PostWithAuthor extends Post {
    author: {
        id: number
        name: string
        email: string
    }
}

export interface PaginatedPostsResponse {
    posts: PostWithAuthor[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

@Injectable()
export class PostService {
    constructor(private prisma: PrismaService) {}

    private validatePostInput(title?: string, content?: string): void {
        if (title !== undefined) {
            if (!title || title.trim().length === 0) {
                throw new BadRequestException('Title cannot be empty')
            }
        }
        if (content !== undefined) {
            if (!content || content.trim().length === 0) {
                throw new BadRequestException('Content cannot be empty')
            }
        }
    }

    validatePostId(id: any): number {
        if (isNaN(Number(id))) {
            throw new BadRequestException('Post Id must be number')
        }
        return Number(id)
    }

    async createPost(
        createPostDto: CreatePostDto,
        authorId: number
    ): Promise<PostWithAuthor> {
        this.validatePostInput(createPostDto.title, createPostDto.content)

        const post = await this.prisma.post.create({
            data: {
                title: createPostDto.title.trim(),
                content: createPostDto.content.trim(),
                authorId
            },
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

        return post as PostWithAuthor
    }

    async getPosts(
        search: string = '',
        page: number = 1,
        limit: number = 10
    ): Promise<PaginatedPostsResponse> {
        const maxLimit = Math.min(limit, 100)

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
                skip: (page - 1) * maxLimit,
                take: maxLimit,
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
            posts: posts as PostWithAuthor[],
            pagination: {
                page,
                limit: maxLimit,
                total: count,
                totalPages: Math.ceil(count / maxLimit)
            }
        }
    }

    async getPostById(id: number): Promise<PostWithAuthor> {
        const post = await this.prisma.post.findUnique({
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

        if (!post) {
            throw new NotFoundException(`Post with ID ${id} not found`)
        }

        return post as PostWithAuthor
    }

    async verifyOwnership(postId: number, userId: number): Promise<void> {
        const post = await this.prisma.post.findUnique({
            where: { id: postId },
            select: { id: true, authorId: true }
        })

        if (!post) {
            throw new NotFoundException(`Post with ID ${postId} not found`)
        }

        if (post.authorId !== userId) {
            throw new PostOwnershipException()
        }
    }

    async updatePost(
        id: number,
        updatePostDto: UpdatePostDto,
        userId: number
    ): Promise<PostWithAuthor> {
        if (!updatePostDto.title && !updatePostDto.content) {
            throw new BadRequestException(
                'At least one field (title or content) must be provided'
            )
        }

        await this.verifyOwnership(id, userId)

        const updateData: Partial<{ title: string; content: string }> = {}
        if (updatePostDto.title !== undefined) {
            this.validatePostInput(updatePostDto.title, undefined)
            updateData.title = updatePostDto.title.trim()
        }
        if (updatePostDto.content !== undefined) {
            this.validatePostInput(undefined, updatePostDto.content)
            updateData.content = updatePostDto.content.trim()
        }

        const post = await this.prisma.post.update({
            where: { id },
            data: updateData,
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

        return post as PostWithAuthor
    }

    async deletePost(id: number, userId: number): Promise<void> {
        await this.verifyOwnership(id, userId)
        await this.prisma.post.delete({
            where: { id }
        })
    }
}
