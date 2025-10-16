import { AdminUATConfig } from '@/config/uat/attendance.config';
import { AdminUATAuthService } from '@/domain/services/uat/admin/auth.service';
import { SERVICE_NAMES, UATCredentials } from '@campus/libs';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Page } from 'puppeteer';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AdminUATPuppeteerAuthService implements AdminUATAuthService {
    constructor(
        @Inject(SERVICE_NAMES.SECURITY)
        private readonly encrypterService: ClientProxy,
    ) {}

    async login(
        page: Page,
        credentials: UATCredentials,
    ): Promise<{ success: boolean; message: string }> {
        await this.navigateToLoginPage(page);
        await this.fillLoginForm(page, credentials);
        await this.submitLogin(page);
        return await this.waitForLoginSuccess(page);
    }

    private async navigateToLoginPage(page: Page) {
        const loginUrl = AdminUATConfig.urls.login;

        if (!loginUrl) {
            throw new Error('UAT_LOGIN_URL is not defined in configuration');
        }

        await page.goto(loginUrl, {
            waitUntil: 'networkidle2',
        });
    }

    private async fillLoginForm(page: Page, credentials: UATCredentials) {
        await page
            .locator(AdminUATConfig.selectors.login.username)
            .fill(credentials.username);

        let decryptedPassword = await firstValueFrom(
            this.encrypterService.send(
                { cmd: 'encrypter.decrypt' },
                credentials.password,
            ),
        );

        await page
            .locator(AdminUATConfig.selectors.login.password)
            .fill(decryptedPassword);

        decryptedPassword = null;

        await page.locator(AdminUATConfig.selectors.login.checkbox).click();
    }

    private async submitLogin(page: Page) {
        await page.locator(AdminUATConfig.selectors.login.submitButton).click();
    }

    private async waitForLoginSuccess(
        page: Page,
    ): Promise<{ success: boolean; message: string }> {
        const response = {
            success: null,
            message: null,
        };
        await Promise.race([
            page
                .waitForSelector(AdminUATConfig.selectors.login.error.modal, {
                    timeout: 1000,
                })
                .then(async () => {
                    const msg = await page.$eval(
                        AdminUATConfig.selectors.login.error.message,
                        (el: HTMLElement) => el.innerText,
                    );

                    response.success = false;
                    response.message = msg || 'Login failed';
                })
                .catch(() => {
                    // No hacer nada si falla, dejar que continúe esperando la segunda promesa
                    return new Promise(() => {}); // Promesa que nunca se resuelve
                }),

            page
                .waitForSelector(
                    AdminUATConfig.selectors.navigation.secretaria,
                    {
                        timeout: AdminUATConfig.browser.timeout,
                    },
                )
                .then(() => {
                    response.success = true;
                    response.message = 'Login successful';
                }),
        ]);
        return response;
    }
}
