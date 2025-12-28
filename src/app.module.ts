import { Module } from '@nestjs/common'
import { AuthModule } from './auth'
import { CommonModule } from './common'

@Module({
    imports: [CommonModule, AuthModule],
    controllers: [],
    providers: []
})
export class AppModule {}
