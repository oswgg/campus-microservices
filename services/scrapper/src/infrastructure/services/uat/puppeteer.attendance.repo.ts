import { AttendanceRepo } from '@/application/repositories/uat/attendance.repo';
import { UATAttendanceConfig } from '@/config/uat/attendance.config';
import {
    UATCredentials,
    ClassData,
    ClassWeek,
    StudentInAttendanceTable,
    ProfessorClass,
} from '@/domain/entities/uat/classData';
import { sleep } from '@/domain/utils/sleep';
import { Injectable, OnModuleInit } from '@nestjs/common';
import puppeteer, { Browser, Page } from 'puppeteer';

@Injectable()
export class PuppeteerAttendanceRepo implements AttendanceRepo, OnModuleInit {
    private browser: Browser;
    private page: Page;

    async onModuleInit() {
        this.browser = await puppeteer.launch(UATAttendanceConfig.browser);
        this.page = await this.browser.newPage();
        await this.page.setRequestInterception(true);
        this.page.on('request', (req) => {
            const resourceType = req.resourceType();
            if (['image', 'font', 'media'].includes(resourceType)) {
                req.abort();
            } else {
                req.continue();
            }
        });
    }

    async getProfessorClasses(
        credentials: UATCredentials,
    ): Promise<ProfessorClass[]> {
        await this.loginToUAT(credentials);
        await this.navigateToControlAsistencia();
        const materias = await this.readTablaMaterias();

        const materiasWithStudents =
            await this.fillStudentsForClasses(materias);

        return materiasWithStudents.map((m) => ({
            group: m.group,
            classroom: m.classroom,
            subject: m.subject,
            period: m.period,
            students: m.students,
        }));
    }

    private async loginToUAT(credentials: UATCredentials) {
        const loginUrl = UATAttendanceConfig.urls.login;

        if (!loginUrl) {
            throw new Error(
                'UAT_LOGIN_URL is not defined in environment variables',
            );
        }

        await this.page.goto(loginUrl, {
            waitUntil: 'networkidle2',
        });

        await this.page
            .locator(UATAttendanceConfig.selectors.login.username)
            .fill(credentials.username);
        await this.page
            .locator(UATAttendanceConfig.selectors.login.password)
            .fill(credentials.password);
        await this.page
            .locator(UATAttendanceConfig.selectors.login.checkbox)
            .click();

        await this.page
            .locator(UATAttendanceConfig.selectors.login.submitButton)
            .click();
        await this.page.waitForSelector(
            UATAttendanceConfig.selectors.navigation.secretaria,
            {
                timeout: UATAttendanceConfig.browser.timeout,
            },
        );
    }

    private async navigateToControlAsistencia() {
        await this.page
            .locator(UATAttendanceConfig.selectors.navigation.secretaria)
            .click();
        await sleep(1000);

        await this.page.waitForSelector(
            UATAttendanceConfig.selectors.navigation.profesor,
        );
        await this.page
            .locator(UATAttendanceConfig.selectors.navigation.profesor)
            .click();
        await sleep(1000);

        await this.page.waitForSelector(
            UATAttendanceConfig.selectors.navigation.controlAsistencia,
        );
        await this.page
            .locator(UATAttendanceConfig.selectors.navigation.controlAsistencia)
            .click();

        await this.page.waitForSelector(
            UATAttendanceConfig.selectors.grids.materias,
        );

        await this.page.waitForSelector("[aria-label='Columna Semana']");

        await this.page.waitForFunction(() => {
            const lp = document.querySelector('#grdSemanas .dx-loadpanel');
            if (!lp) return true;
            const content = lp.querySelector('.dx-loadpanel-content');
            const hiddenClass =
                content?.classList.contains('dx-state-invisible');
            const ariaHidden = content?.getAttribute('aria-hidden') === 'true';
            return !content || hiddenClass || ariaHidden;
        });
    }

    private async readTablaMaterias() {
        const datos = await this.page.evaluate((selector) => {
            const resultado: ClassData[] = [];

            const tabla = document.querySelector(selector);
            if (!tabla) return resultado;

            const tbody = tabla.querySelector('tbody');
            if (!tbody) return resultado;

            const filas = tbody.querySelectorAll('tr.dx-row');

            filas.forEach((row, idx) => {
                const celdas = row.querySelectorAll('td');
                if (celdas.length >= 4) {
                    const selectorFila = `${selector} tbody tr.dx-row:nth-child(${idx + 1})`;
                    const [grupo, lugar, asignatura, periodo] = celdas;

                    if (
                        grupo.textContent &&
                        lugar.textContent &&
                        asignatura.textContent &&
                        periodo.textContent
                    ) {
                        resultado.push({
                            group: grupo.textContent.trim(),
                            classroom: lugar.textContent.trim(),
                            subject: asignatura.textContent.trim(),
                            period: parseInt(periodo.textContent.trim()),
                            selector: selectorFila,
                            students: [],
                        });
                    }
                }
            });
            return resultado;
        }, UATAttendanceConfig.selectors.grids.materias);

        return datos;
    }

    private async fillStudentsForClasses(
        materias: ClassData[],
    ): Promise<ClassData[]> {
        for (const materia of materias) {
            await this.page.locator(materia.selector).click();
            await sleep(600);

            const semanas = await this.readTablaSemanas();

            await this.page.locator(semanas[0].selector).click();
            await sleep(600);

            const alumnos = await this.readStudentsTable();

            materia.students = alumnos.map((a) => ({
                number: a.number,
                name: a.name,
            }));

            await this.page
                .locator('#widgetUatCalloutBoton_pnlDetalles')
                .click();
            await sleep(600);
        }

        return materias;
    }

    private async readTablaSemanas(): Promise<ClassWeek[]> {
        const datos = await this.page.evaluate((selector) => {
            const resultado: ClassWeek[] = [];

            const contenedor = document.querySelector(selector);
            if (!contenedor) return resultado;

            const tabla = contenedor.querySelector('table');
            if (!tabla) return resultado;

            const tbody = tabla.querySelector('tbody');
            if (!tbody) return resultado;

            const filas = tbody.querySelectorAll('tr.dx-row.dx-data-row');

            filas.forEach((row, idx) => {
                const celdas = row.querySelectorAll('td');
                if (celdas.length >= 4) {
                    const selectorFila = `${selector} table tbody tr.dx-row:nth-child(${idx + 1})`;
                    resultado.push({
                        weekNumber: Number(celdas[0].textContent.trim()),
                        startDate: celdas[1].textContent.trim(),
                        endDate: celdas[2].textContent.trim(),
                        selector: selectorFila,
                    });
                }
            });
            return resultado;
        }, UATAttendanceConfig.selectors.grids.semanas);

        return datos;
    }

    private async readStudentsTable() {
        const datos = await this.page.evaluate((selector) => {
            const resultado: StudentInAttendanceTable[] = [];

            const contenedor = document.querySelector(selector);
            if (!contenedor) return resultado;

            const tabla = contenedor.querySelector('table');
            if (!tabla) return resultado;

            const tbody = tabla.querySelector('tbody');
            if (!tbody) return resultado;

            // Obtener los días de los encabezados
            const encabezados = document.querySelectorAll(
                '#grdAsistencias .dx-datagrid-headers th, #grdAsistencias .dx-datagrid-headers td',
            );
            const diasColumnas = [];
            encabezados.forEach((th) => {
                const span = th.querySelector('span[id*="lbl_"]');
                if (span) {
                    const texto = span.textContent;
                    const match = texto.match(/\d+/);
                    if (match) {
                        diasColumnas.push(parseInt(match[0]));
                    }
                }
            });

            const filas = tbody.querySelectorAll('tr.dx-row.dx-data-row');

            filas.forEach((row, idx) => {
                const celdas = row.querySelectorAll('td');
                if (celdas.length >= 3) {
                    const numero = celdas[0].textContent.trim();
                    const nombre = celdas[1].textContent.trim();

                    const checkboxes = [];
                    for (let i = 2; i < celdas.length; i++) {
                        const checkbox = celdas[i].querySelector(
                            'input[type="checkbox"]',
                        ) as HTMLInputElement;
                        if (checkbox) {
                            const diaDelMes = diasColumnas[i - 2];
                            checkboxes.push({
                                id: checkbox.id,
                                checked: checkbox.checked,
                                selector: `#${checkbox.id}`,
                                diaDelMes: diaDelMes,
                            });
                        }
                    }

                    resultado.push({
                        number: Number(numero),
                        name: nombre,
                        checkboxes: checkboxes,
                        selector: `${selector} table tbody tr.dx-row:nth-child(${idx + 1})`,
                    });
                }
            });
            return resultado;
        }, UATAttendanceConfig.selectors.grids.asistencias);

        return datos;
    }
}
