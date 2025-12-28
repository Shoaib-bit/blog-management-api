import { Module } from '@nestjs/common'
import { CommonModule } from './common'

@Module({
    imports: [],
    controllers: [CommonModule],
    providers: []
})
export class AppModule {}
