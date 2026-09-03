import {
    CanActivate,
    ExecutionContext,
    Injectable,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/isPublic.decorator';
import { IS_USER_KEY } from '../decorators/isUser.decorator';
import { TokenService } from 'src/components/token/token.service';
import { IS_ADMIN_KEY } from '../decorators/isAdmin.decorator';
import { UserBannedException } from 'src/libs/contracts/exceptions';
import { AuthenticatedRequest } from '../interfaces/authenticatedRequest.interface';

@Injectable()
export class AuthGuard implements CanActivate {
    private readonly logger = new Logger(AuthGuard.name);

    constructor(
        private reflector: Reflector,
        private tokenService: TokenService,
    ) {}

    canActivate(context: ExecutionContext) {
        if (this.isPublicRoute(context)) return true;
        const req = context.switchToHttp().getRequest<AuthenticatedRequest>();

        try {
            const token = this.extractToken(req);
            if (!token) {
                return this.handleUnauthorized('User unauthorized!');
            }

            if (this.isUserRoute(context)) {
                const userToken = this.tokenService.validateAccessToken(token);
                if (userToken.isBanned) {
                    throw new UserBannedException();
                }
                req.currentUser = userToken;

                return true;
            }
            if (this.isAdminRoute(context)) {
                const adminToken =
                    this.tokenService.validateAdminAccessToken(token);

                req.currentUser = adminToken;

                return true;
            }
            return false;
        } catch (error) {
            // A banned user gets the specific answer; anything else is
            // reported as a plain authentication failure.
            if (error instanceof UserBannedException) throw error;
            return this.handleUnauthorized('User unauthorized!');
        }
    }

    private isPublicRoute(context: ExecutionContext): boolean {
        return this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
    }

    private isUserRoute(context: ExecutionContext): boolean {
        return this.reflector.getAllAndOverride(IS_USER_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
    }

    private isAdminRoute(context: ExecutionContext): boolean {
        return this.reflector.getAllAndOverride(IS_ADMIN_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
    }

    private extractToken(req: AuthenticatedRequest): string | null {
        const authHeader = req.headers.authorization;
        if (!authHeader) return null;

        const [bearer, token] = authHeader.split(' ');
        if (bearer !== 'Bearer' || !token) return null;
        return token;
    }

    private handleUnauthorized(message: string): boolean {
        this.logger.debug(message);
        throw new UnauthorizedException(message);
    }
}
