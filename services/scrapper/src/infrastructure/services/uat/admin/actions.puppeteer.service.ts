import { AdminUATConfig } from '@/config/uat/attendance.config';
import {
    ClassDataWithSelector,
    ClassWeek,
    StudentInAttendanceTable,
} from '@/domain/entities/uat';
import { AdminUATActionsService } from '@/domain/services/uat/admin/actions.service';
import { sleep } from '@/domain/utils/sleep';
import { ClassData } from '@campus/types';
import { Injectable } from '@nestjs/common';
import { Page } from 'puppeteer';

@Injectable()
export class AdminUATPuppeteerActionsService implements AdminUATActionsService {
    async getProfessorClasses(page: Page): Promise<ClassData[]> {
        const materias = await this.readTablaMaterias(page);
        const withStudents = await this.fillStudentsForClasses(page, materias);

        console.log(`✓ Found ${withStudents.length} classes`);

        return withStudents.map(({ selector, ...rest }) => rest);
    }

    async takeAttendance(
        page: Page,
        data: ClassData & {
            date: string;
            students: { number: number; name: string; present: boolean }[];
        },
    ): Promise<void> {
        const materias = await this.readTablaMaterias(page);

        const target = materias.find(
            (m) =>
                m.group === data.group &&
                m.classroom === data.classroom &&
                m.subject === data.subject &&
                m.period === data.period,
        );

        if (!target) {
            throw new Error('Class not found');
        }

        await page.locator(target.selector).click();
        await sleep(1000);

        const weeks = await this.readWeeksTable(page);
        const targetWeek = await this.selectWeekByDate(page, data.date, weeks);

        await page.locator(targetWeek.selector).click();
        await sleep(1000);

        const tabla = await this.readTablaAsistencia(page);

        for (const student of data.students) {
            const fila = tabla.find((f) => f.numero === String(student.number));
            if (!fila) {
                console.warn(
                    `⚠️ Student with number ${student.number} not found in attendance table`,
                );
                continue;
            }

            const checkbox = fila.checkboxes.find(
                (cb) => cb.diaDelMes === new Date(data.date).getDate(),
            );

            if (!checkbox) {
                console.warn(
                    `⚠️ Checkbox for date ${data.date} not found for student ${student.number}`,
                );
                continue;
            }

            if (checkbox.checked !== student.present) {
                await page.locator(checkbox.selector).click();
                await sleep(300);
                console.log(
                    `✓ Marked student ${student.number} as ${
                        student.present ? 'present' : 'absent'
                    }`,
                );
            } else {
                console.log(
                    `✓ Student ${student.number} already marked as ${
                        student.present ? 'present' : 'absent'
                    }`,
                );
            }
        }
        await page.click('#btnGuardar_generalesSIF');

        // Esperar a que aparezca el popup de confirmación
        await page.waitForSelector('#alertaGenericoSIFBotonOK', {
            timeout: 15000,
        });
        await sleep(3000);

        // Hacer click en el botón OK del popup
        await page.click('#alertaGenericoSIFBotonOK');

        await sleep(500);
    }

    private async selectWeekByDate(
        page: Page,
        dateStr: string,
        weeks: ClassWeek[],
    ) {
        const targetDate = new Date(dateStr);

        const targetWeek = weeks.find((week) => {
            const startDate = new Date(
                week.startDate.split('/').reverse().join('-'),
            );
            const endDate = new Date(
                week.endDate.split('/').reverse().join('-'),
            );
            return targetDate >= startDate && targetDate <= endDate;
        });

        if (!targetWeek) {
            throw new Error('Week not found for the given date');
        }

        return targetWeek;
    }

    private async readTablaMaterias(page: Page) {
        const datos = await page.evaluate((selector) => {
            const resultado: ClassDataWithSelector[] = [];

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
        }, AdminUATConfig.selectors.grids.materias);

        return datos;
    }

    private async readWeeksTable(page: Page): Promise<ClassWeek[]> {
        const datos = await page.evaluate((selector) => {
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
        }, AdminUATConfig.selectors.grids.semanas);

        return datos;
    }

    private async readStudentsTable(
        page: Page,
    ): Promise<StudentInAttendanceTable[]> {
        const datos = await page.evaluate((selector) => {
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
        }, AdminUATConfig.selectors.grids.asistencias);

        return datos;
    }

    private async fillStudentsForClasses(
        page: Page,
        materias: ClassDataWithSelector[],
    ): Promise<ClassDataWithSelector[]> {
        for (const materia of materias) {
            await page.locator(materia.selector).click();
            await sleep(600);

            const semanas = await this.readWeeksTable(page);

            await page.locator(semanas[0].selector).click();
            await sleep(600);

            const alumnos = await this.readStudentsTable(page);

            materia.students = alumnos.map((a) => ({
                number: a.number,
                name: a.name,
            }));

            await page.locator('#widgetUatCalloutBoton_pnlDetalles').click();
            await sleep(600);
        }

        return materias;
    }

    private async readTablaAsistencia(page: Page) {
        const datos = await page.evaluate((selector) => {
            const resultado = [];
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
                        numero: numero,
                        nombre: nombre,
                        checkboxes: checkboxes,
                        rowIndex: idx,
                        rowSelector: `${selector} table tbody tr.dx-row:nth-child(${idx + 1})`,
                    });
                }
            });
            return resultado;
        }, AdminUATConfig.selectors.grids.asistencias);

        return datos;
    }
}
