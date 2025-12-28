import { Module } from '@nestjs/common'
import { CommonModule } from 'src/common'
import { BlogController } from './blog.controller'
import { BlogService } from './blog.service'

@Module({
    imports: [CommonModule],
    controllers: [BlogController],
    providers: [BlogService]
})
export class BlogModule {}
