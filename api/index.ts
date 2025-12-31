import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import express, { Request, Response } from 'express'
import { AppModule } from '../src/app.module'

const server = express()

let cachedApp: any

async function createNestApp() {
    if (!cachedApp) {
        const expressAdapter = new ExpressAdapter(server)
        const app = await NestFactory.create(AppModule, expressAdapter, {
            cors: true,
            logger: ['error', 'warn', 'log']
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

        const document = SwaggerModule.createDocument(app, config)
        SwaggerModule.setup('api/docs', app, document)

        await app.init()
        cachedApp = app
    }
    return cachedApp
}

// Serverless function handler for Vercel
export default async (req: Request, res: Response) => {
    await createNestApp()
    return server(req, res)
}
