import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import express from 'express'
import { AppModule } from '../src/app.module'

const server = express()

let cachedApp: any

async function createNestApp() {
    if (!cachedApp) {
        const expressAdapter = new ExpressAdapter(server)
        const app = await NestFactory.create(AppModule, expressAdapter, {
            cors: true
        })

        // Set global API prefix
        app.setGlobalPrefix('api')
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true
            })
        )

        // Swagger configuration
        const config = new DocumentBuilder()
            .setTitle('Blog Management API')
            .setDescription('API for Blog Management')
            .setVersion('1.0')
            .addBearerAuth(
                {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    name: 'JWT',
                    description: 'Enter JWT token',
                    in: 'header'
                },
                'access-token'
            )
            .build()

        const documentFactory = () => SwaggerModule.createDocument(app, config)
        SwaggerModule.setup('docs', app, documentFactory)

        await app.init()
        cachedApp = app
    }
    return cachedApp
}

// Serverless function handler for Vercel
export default async (req: any, res: any) => {
    await createNestApp()
    return server(req, res)
}
