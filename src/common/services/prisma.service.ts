import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from 'generated/prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger(PrismaService.name)

    constructor() {
        const pool = new PrismaPg({
            connectionString: process.env.DATABASE_URL!
        })
        super({ adapter: pool })
    }
    async onModuleInit() {
        try {
            await this.$connect()
            // Verify connection with a test query
            await this.$queryRaw`SELECT 1`
            this.logger.log('Successfully connected to the database')
        } catch (error) {
            this.logger.error('Failed to connect to the database', error)
            throw error
        }
    }
}
