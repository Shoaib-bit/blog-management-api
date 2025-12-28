import { Module } from '@nestjs/common'
import { AuthController } from './auth/auth.controller'
import { CommonModule } from './common'
import { AuthModule } from './auth'

@Module({
    imports: [CommonModule, AuthModule],
    controllers: [],
    providers: []
})
export class AppModule {}
