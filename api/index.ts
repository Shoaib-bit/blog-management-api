import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import express, { Request, Response } from 'express'
import { AppModule } from '../src/app.module'

const server = express()
// Enable trust proxy for Vercel
server.set('trust proxy', 1)

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

        // Enable CORS with proper configuration
        app.enableCors({
            origin: true,
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
        })

        // Get the base URL for Swagger (use HTTPS on Vercel)
        const isProduction =
            process.env.VERCEL_URL || process.env.NODE_ENV === 'production'
        const baseUrl = process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : 'http://localhost:3000'

        // Swagger configuration
        const config = new DocumentBuilder()
            .setTitle('Blog Management API')
            .setDescription('API for Blog Management')
            .setVersion('1.0')
            .addServer(
                baseUrl,
                isProduction ? 'Production Server' : 'Development Server'
            )
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
        SwaggerModule.setup('docs', app, document, {
            swaggerOptions: {
                persistAuthorization: true,
                tryItOutEnabled: true
            },
            customSiteTitle: 'Blog Management API Docs',
            customCssUrl:
                'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css',
            customJs: [
                'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.js',
                'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.js'
            ]
        })

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
