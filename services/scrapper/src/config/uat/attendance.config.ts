/**Estas son configuraciones precargadas para la navegacion en la pagina de la UAT.
 * Todos los selectores son obtenidos con la herramienta de desarrollo de google chrome.
 */

export const UATAttendanceConfig = {
    browser: {
        headless: false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--window-size=1280,1280',
        ],
        defaultViewport: { width: 1280, height: 1280 },
        timeout: 6000,
    },
    urls: {
        login: 'https://administracionescolar.uat.edu.mx/Login',
    },
    selectors: {
        login: {
            username: "input[name='txtUsuario']",
            password: "input[name='txtContrasenia']",
            checkbox: '.dx-checkbox-icon',
            submitButton: '#btnIngresar',
        },
        navigation: {
            secretaria: '[aria-label="Secretaría de Gestión Escolar"]',
            profesor: '[aria-label="Profesor"]',
            controlAsistencia: '[aria-label="Control De Asistencia"] a',
        },
        grids: {
            materias:
                '.dx-datagrid-rowsview.dx-datagrid-nowrap.dx-last-row-border table',
            semanas:
                '#grdSemanas .dx-datagrid-rowsview.dx-datagrid-nowrap.dx-last-row-border',
            asistencias: '#grdAsistencias .dx-datagrid-rowsview',
        },
    },
};
