export interface BrowserService {
    launchBrowser(): Promise<any>;
    closeBrowser(browser: any): Promise<void>;
    getPage(pageId: string): any;
    newPage(): Promise<{ id: string; page: any }>;
    closePage(page: any): Promise<void>;
}

export const BROWSER_SERVICE_TOKEN = Symbol('browser.service');
