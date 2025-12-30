import 'dotenv/config'
import { defineConfig } from 'prisma/config'

const datasourceUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL

if (!datasourceUrl) {
    throw new Error(
        'Prisma datasource URL is missing; set DATABASE_URL (or DIRECT_URL when using a different connection for migrations).'
    )
}

export default defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations'
    },
    datasource: {
        url: datasourceUrl
    }
})
