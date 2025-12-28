import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import { map, Observable } from 'rxjs'

export class TransformResponseInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler<any>
    ): Observable<any> {
        const request = context.switchToHttp().getRequest()
        const path = request.url

        return next.handle().pipe(
            map(response => {
                let data = response
                let message = 'Request successful'

                // If controller returned { data, message }
                if (
                    typeof response === 'object' &&
                    response !== null &&
                    'data' in response &&
                    'message' in response
                ) {
                    data = response.data
                    message = response.message
                }

                return {
                    success: true,
                    data,
                    message,
                    meta: {
                        path,
                        timestamp: new Date().toISOString()
                    }
                }
            })
        )
    }
}
