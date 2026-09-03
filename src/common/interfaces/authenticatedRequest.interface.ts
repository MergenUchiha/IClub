import { FastifyRequest } from 'fastify';
import { UserTokenDto } from 'src/components/token/dto/userToken.dto';

/**
 * The request as it looks after AuthGuard has run: the decoded token is
 * attached to it, and the param decorators read it from there.
 */
export interface AuthenticatedRequest extends FastifyRequest {
    currentUser?: UserTokenDto;
}
