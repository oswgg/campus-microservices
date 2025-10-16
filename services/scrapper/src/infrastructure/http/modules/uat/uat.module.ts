import { Module } from '@nestjs/common';
import { UatController } from './uat.controller';
import { GetProfessorClasses } from '@/application/use-cases/get-professor-classes';
import { PuppeterBrowserService } from '@/infrastructure/services/browser/browser.puppeteer.service';
import { AdminUATPuppeteerAuthService } from '@/infrastructure/services/uat/admin/auth.puppeteer.service';
import { AdminUATPuppeteerNavigationService } from '@/infrastructure/services/uat/admin/navigation.puppeteer.service';
import { AdminUATRepoImpl } from '@/infrastructure/repositories/uat/admin/admin-uat.repo.impl';
import { ADMIN_UAT_REPO_TOKEN } from '@/application/repositories/uat/admin/uat-admin.repo';
import { BROWSER_SERVICE_TOKEN } from '@/domain/services/browser.service';
import { ADMIN_UAT_AUTH_SERVICE_TOKEN } from '@/domain/services/uat/admin/auth.service';
import { ADMIN_UAT_NAVIGATION_SERVICE_TOKEN } from '@/domain/services/uat/admin/navigation.service';
import { ADMIN_UAT_ACTIONS_SERVICE_TOKEN } from '@/domain/services/uat/admin/actions.service';
import { AdminUATPuppeteerActionsService } from '@/infrastructure/services/uat/admin/actions.puppeteer.service';
import { TakeAttendance } from '@/application/use-cases/take-attendace';
import { ValidateCredentials } from '@/application/use-cases/validate-credentials';
import { MicroservicesModule } from '../microservices.module';

@Module({
    imports: [MicroservicesModule],
    providers: [
        // Core services
        {
            provide: BROWSER_SERVICE_TOKEN,
            useClass: PuppeterBrowserService,
        },
        {
            provide: ADMIN_UAT_AUTH_SERVICE_TOKEN,
            useClass: AdminUATPuppeteerAuthService,
        },
        {
            provide: ADMIN_UAT_NAVIGATION_SERVICE_TOKEN,
            useClass: AdminUATPuppeteerNavigationService,
        },
        {
            provide: ADMIN_UAT_ACTIONS_SERVICE_TOKEN,
            useClass: AdminUATPuppeteerActionsService,
        },

        // Repo
        {
            provide: ADMIN_UAT_REPO_TOKEN,
            useClass: AdminUATRepoImpl,
        },

        // Use cases
        GetProfessorClasses,
        TakeAttendance,
        ValidateCredentials,
    ],
    controllers: [UatController],
})
export class UatModule {}
