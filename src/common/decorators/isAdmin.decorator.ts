import { SetMetadata } from '@nestjs/common';

export const IS_ADMIN_KEY = 'IS_ADMIN_KEY';

export const ADMIN = () => SetMetadata(IS_ADMIN_KEY, true);
