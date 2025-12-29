import { Module } from '@nestjs/common'
import { AuthModule } from './auth'
import { CommonModule } from './common'
import { PostModule } from './post/post.module'

@Module({
    imports: [CommonModule, AuthModule, PostModule],
    controllers: [],
    providers: []
})
export class AppModule {}
