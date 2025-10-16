import {
    BROWSER_SERVICE_TOKEN,
    BrowserService,
} from '@/domain/services/browser.service';
import {
    ADMIN_UAT_AUTH_SERVICE_TOKEN,
    AdminUATAuthService,
} from '@/domain/services/uat/admin/auth.service';
import {
    ADMIN_UAT_NAVIGATION_SERVICE_TOKEN,
    AdminUATNavigationService,
} from '@/domain/services/uat/admin/navigation.service';
import { ClassData, TakeAttendanceDto, UATCredentials } from '@campus/libs';
import { Inject, Injectable } from '@nestjs/common';
import { AdminUATRepo } from '@/application/repositories/uat/admin/uat-admin.repo';
import {
    ADMIN_UAT_ACTIONS_SERVICE_TOKEN,
    AdminUATActionsService,
} from '@/domain/services/uat/admin/actions.service';

@Injectable()
export class AdminUATRepoImpl implements AdminUATRepo {
    constructor(
        @Inject(BROWSER_SERVICE_TOKEN)
        private readonly browserService: BrowserService,
        @Inject(ADMIN_UAT_AUTH_SERVICE_TOKEN)
        private readonly authService: AdminUATAuthService,
        @Inject(ADMIN_UAT_NAVIGATION_SERVICE_TOKEN)
        private readonly navigationService: AdminUATNavigationService,
        @Inject(ADMIN_UAT_ACTIONS_SERVICE_TOKEN)
        private readonly actionsService: AdminUATActionsService,
    ) {}

    async validateCredentials(
        data: UATCredentials,
    ): Promise<{ success: boolean; message: string }> {
        const result = await this.browserService.newPage();
        const { id, page } = result;

        console.log('Opening new browser to validate credentials...');

        try {
            const { success, message } = await this.authService.login(
                page,
                data,
            );

            await this.browserService.closePage(id);
            return { success, message };
        } catch (error) {
            await this.browserService.closePage(id);
            return { success: false, message: 'Invalid credentials' };
        }
    }

    async getProfessorClasses(
        credentials: UATCredentials,
    ): Promise<ClassData[]> {
        const result = await this.browserService.newPage();

        const { id, page } = result;

        console.log('Opening new browser to get professor classes...');

        await this.authService.login(page, credentials);
        await this.navigationService.openMainMenu(page);
        await this.navigationService.goToControlAsistencia(page);

        const classes = await this.actionsService.getProfessorClasses(page);

        await this.browserService.closePage(id);

        return classes;
    }

    async takeAttendance(data: TakeAttendanceDto): Promise<void> {
        const result = await this.browserService.newPage();
        const { id, page } = result;

        await this.authService.login(page, {
            username: data.profEmail,
            password: data.encryptedPassword,
        });
        await this.navigationService.openMainMenu(page);
        await this.navigationService.goToControlAsistencia(page);
        await this.actionsService.takeAttendance(page, data);

        await this.browserService.closePage(id);
    }
}
