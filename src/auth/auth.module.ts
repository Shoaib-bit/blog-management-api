import { Module } from '@nestjs/common'
import { CommonModule } from 'src/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
    imports: [CommonModule],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}
