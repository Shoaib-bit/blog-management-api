import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
    try {
        const app = await NestFactory.create(AppModule)

        // Set global API prefix
        app.setGlobalPrefix('api')

        const config = new DocumentBuilder()
            .setTitle('Blog Management API')
            .setDescription('API for Blog Management')
            .setVersion('1.0')
            .build()

        const documentFactory = () => SwaggerModule.createDocument(app, config)
        SwaggerModule.setup('docs', app, documentFactory)

        await app.listen(process.env.PORT ?? 3000)
    } catch (error) {
        console.error('Failed to start the application:', error)
        process.exit(1)
    }
}
bootstrap()
