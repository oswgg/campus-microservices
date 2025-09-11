import { AdminUATConfig } from '@/config/uat/attendance.config';
import { AdminUATNavigationService } from '@/domain/services/uat/admin/navigation.service';
import { sleep } from '@/domain/utils/sleep';
import { Injectable } from '@nestjs/common';
import { Page } from 'puppeteer';

@Injectable()
export class AdminUATPuppeteerNavigationService
    implements AdminUATNavigationService
{
    async openMainMenu(page: Page): Promise<void> {
        await page
            .locator(AdminUATConfig.selectors.navigation.secretaria)
            .click();

        await sleep(500);

        await page
            .locator(AdminUATConfig.selectors.navigation.profesor)
            .click();
    }

    async goToControlAsistencia(page: Page): Promise<void> {
        await page
            .locator(AdminUATConfig.selectors.navigation.controlAsistencia)
            .click();

        await page.waitForSelector(AdminUATConfig.selectors.grids.materias);

        await page.waitForSelector("[aria-label='Columna Semana']");

        await page.waitForFunction(() => {
            const lp = document.querySelector('#grdSemanas .dx-loadpanel');
            if (!lp) return true;
            const content = lp.querySelector('.dx-loadpanel-content');
            const hiddenClass =
                content?.classList.contains('dx-state-invisible');
            const ariaHidden = content?.getAttribute('aria-hidden') === 'true';
            return !content || hiddenClass || ariaHidden;
        });
    }
}
