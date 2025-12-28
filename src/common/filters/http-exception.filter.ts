import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus
} from '@nestjs/common'
import { Request, Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()
        const request = ctx.getRequest<Request>()

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR

        // Default response structure from HttpException
        const exceptionResponse =
            exception instanceof HttpException
                ? (exception.getResponse() as any)
                : { message: 'Internal server error' }

        // Normalize message (always string)
        let message: string
        if (typeof exceptionResponse === 'string') {
            message = exceptionResponse
        } else if (Array.isArray(exceptionResponse.message)) {
            // Class-validator errors usually come in array
            message = exceptionResponse.message[0]
        } else {
            message =
                exceptionResponse.message ||
                exception.message ||
                'Error occurred'
        }

        response.status(status).json({
            success: false,
            data: null,
            message,
            error: {
                statusCode: status,
                errors: Array.isArray(exceptionResponse.message)
                    ? exceptionResponse.message
                    : null
            },
            meta: {
                path: request.url,
                timestamp: new Date().toISOString()
            }
        })
    }
}
