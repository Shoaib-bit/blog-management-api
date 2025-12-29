import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>()
        const token = this.extractTokenFromHeader(request)

        if (!token) {
            throw new UnauthorizedException('Access token missing')
        }

        try {
            // verify token & decode payload
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET
            })

            // Attach user info to request object
            request['user'] = payload

            return true
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired token')
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? []
        return type === 'Bearer' ? token : undefined
    }
}
