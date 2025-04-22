import { Module } from '@nestjs/common';
import { UserAuthController } from './user.auth.controller';
import { UserAuthService } from './user.auth.service';
import { TokenModule } from 'src/components/token/token.module';

@Module({
    imports: [TokenModule],
    controllers: [UserAuthController],
    providers: [UserAuthService],
})
export class UserAuthModule {}
