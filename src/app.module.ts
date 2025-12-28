import { Module } from '@nestjs/common'
import { AuthModule } from './auth'
import { BlogModule } from './blog/blog.module'
import { CommonModule } from './common'

@Module({
    imports: [CommonModule, AuthModule, BlogModule],
    controllers: [],
    providers: []
})
export class AppModule {}
