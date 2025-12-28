import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { HttpExceptionFilter } from './filters'
import { TransformResponseInterceptor } from './interceptors'
import { PrismaService } from './services/prisma.service'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '30d' }
        })
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: TransformResponseInterceptor
        },

        PrismaService
    ],
    exports: [PrismaService]
})
export class CommonModule {}
