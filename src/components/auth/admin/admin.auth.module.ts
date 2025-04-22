import { Module } from '@nestjs/common';
import { AdminAuthController } from './admin.auth.controller';
import { AdminAuthService } from './admin.auth.service';
import { TokenModule } from 'src/components/token/token.module';

@Module({
    imports: [TokenModule],
    controllers: [AdminAuthController],
    providers: [AdminAuthService],
})
export class AdminAuthModule {}
