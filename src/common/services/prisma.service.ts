import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger(PrismaService.name)

    constructor() {
        const connectionString = process.env.DATABASE_URL!
        const pool = new Pool({ connectionString })
        const adapter = new PrismaPg(pool)
        super({ adapter })
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
