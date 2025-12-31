import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { CommonModule } from '../common'

@Module({
    imports: [CommonModule],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}
