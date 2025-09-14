import { SetMetadata } from '@nestjs/common';

export const APP_ACCESS_KEY = 'app_access';

export const RequiredApp = (app: string) => SetMetadata(APP_ACCESS_KEY, app);
