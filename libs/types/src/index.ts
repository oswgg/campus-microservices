// Tokens para servicios de microservicios
export const PROFESSOR_SERVICE_TOKEN = Symbol('professor.service');
export const SCRAPER_SERVICE_TOKEN = Symbol('scraper.service');
export const API_GATEWAY_TOKEN = Symbol('api.gateway');

// Constantes string para usar con @nestjs/microservices
export const SERVICE_NAMES = {
    PROFESSOR: 'PROFESSOR_SERVICE',
    SCRAPER: 'SCRAPER_SERVICE',
    API_GATEWAY: 'API_GATEWAY_SERVICE',
};

// Puertos por defecto para cada servicio
export const SERVICE_PORTS = {
    PROFESSOR: 4352,
    SCRAPER: 4353,
    API_GATEWAY: 4351,
};

export * from './uat';
export * from './security';
