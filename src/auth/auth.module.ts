import { Module } from '@nestjs/common'
import { CommonModule } from 'src/common'
import { AuthController } from './auth.controller'

@Module({
    imports: [CommonModule],
    controllers: [AuthController],
    providers: []
})
export class AuthModule {}
