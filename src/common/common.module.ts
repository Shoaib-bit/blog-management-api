import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER } from '@nestjs/core'
import { HttpExceptionFilter } from './filters'
import { PrismaService } from './services/prisma.service'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        })
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter
        },
        PrismaService
    ],
    exports: [PrismaService]
})
export class CommonModule {}
