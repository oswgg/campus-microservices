import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import puppeteer, { Browser, Page } from 'puppeteer';
import { AdminUATConfig } from '@/config/uat/attendance.config';
import { BrowserService } from '@/domain/services/browser.service';

@Injectable()
export class PuppeterBrowserService
    implements BrowserService, OnModuleInit, OnModuleDestroy
{
    private browser: Browser;
    private openPages: Map<string, Page> = new Map();

    async onModuleInit() {
        try {
            console.log('Initializing browser service...');
            this.browser = await this.launchBrowser();
            console.log('Browser service initialized successfully');
        } catch (error) {
            console.error('Failed to launch browser:', error);
            throw error;
        }
    }

    async onModuleDestroy() {
        if (this.browser) {
            await this.closeBrowser(this.browser);
        }
    }

    async launchBrowser(): Promise<Browser> {
        const browser = await puppeteer.launch(AdminUATConfig.browser);
        return browser;
    }

    async closeBrowser(browser: any): Promise<void> {
        await browser.close();
    }

    async getPage(pageId: string) {
        const page = this.openPages.get(pageId);
        if (!page) {
            throw new Error(`Page with ID ${pageId} not found`);
        }
        return page;
    }

    async newPage(): Promise<any> {
        if (!this.browser) {
            throw new Error('Browser not initialized');
        }

        const page = await this.browser.newPage();
        const pageId = `page-${Date.now()}`;
        this.openPages.set(pageId, page);

        return {
            id: pageId,
            page,
        };
    }

    async closePage(pageId: any): Promise<void> {
        const page = this.openPages.get(pageId);
        if (page) {
            await page.close();
            this.openPages.delete(pageId);
        }
    }
}
