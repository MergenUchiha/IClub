import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { PUBLIC } from 'src/common/decorators/isPublic.decorator';
import { HealthCheckAuthGuard } from 'src/common/guards/healthCheck.guard';
import { PrismaHealthIndicator } from 'src/prisma/prisma.health';

@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private prisma: PrismaHealthIndicator,
    ) {}

    /**
     * Reports whether this instance can serve traffic, which comes down to
     * whether it can reach its database. It used to ping google.com, so it
     * stayed green while the database was unreachable.
     */
    // PUBLIC() only takes the route out of the global AuthGuard, which would
    // otherwise reject it as a route with no role - the probe answered 403
    // even with a valid token. HealthCheckAuthGuard still checks the token.
    @PUBLIC()
    @ApiExcludeEndpoint()
    @Get()
    @UseGuards(HealthCheckAuthGuard)
    @HealthCheck()
    check() {
        return this.health.check([() => this.prisma.isHealthy('database')]);
    }
}
