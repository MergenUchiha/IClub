import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
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
    @ApiExcludeEndpoint()
    @Get()
    @UseGuards(HealthCheckAuthGuard)
    @HealthCheck()
    check() {
        return this.health.check([() => this.prisma.isHealthy('database')]);
    }
}
