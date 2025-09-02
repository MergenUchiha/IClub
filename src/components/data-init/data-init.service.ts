import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { generateHash } from 'src/helpers/providers/generateHash';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DataInitService implements OnModuleInit {
    private readonly logger = new Logger(DataInitService.name);

    constructor(
        private prismaService: PrismaService,
        private configService: ConfigService,
    ) {}

    async onModuleInit() {
        await this.createDefaultAdmin();
    }

    async createDefaultAdmin() {
        const defaultAdminUsername = this.configService.getOrThrow<string>(
            'DEFAULT_ADMIN_USERNAME',
        );
        const defaultAdminPassword = this.configService.getOrThrow<string>(
            'DEFAULT_ADMIN_PASSWORD',
        );

        const existingAdmin = await this.prismaService.admin.findUnique({
            where: { username: defaultAdminUsername },
        });
        if (!existingAdmin) {
            const hashedPassword = await generateHash(defaultAdminPassword);
            await this.prismaService.admin.create({
                data: {
                    username: defaultAdminUsername,
                    password: hashedPassword,
                },
            });
            this.logger.log('Default admin created');
        } else {
            this.logger.log('Default admin already exists');
        }
    }
}
