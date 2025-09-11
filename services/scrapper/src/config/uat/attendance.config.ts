/**Estas son configuraciones precargadas para la navegacion en la pagina de la UAT.
 * Todos los selectores son obtenidos con la herramienta de desarrollo de google chrome.
 */

const isDocker =
    process.env.DOCKER_ENV === 'true' || process.env.NODE_ENV === 'production';

export const AdminUATConfig = {
    browser: {
        headless: isDocker ? true : false, // Automático basado en el entorno
        executablePath: isDocker ? '/usr/bin/google-chrome-stable' : undefined,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--window-size=1280,1280',
            ...(isDocker
                ? [
                      '--no-zygote',
                      '--single-process',
                      '--disable-background-timer-throttling',
                      '--disable-backgrounding-occluded-windows',
                      '--disable-renderer-backgrounding',
                  ]
                : []),
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
