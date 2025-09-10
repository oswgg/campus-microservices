"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVICE_PORTS = exports.SERVICE_NAMES = exports.API_GATEWAY_TOKEN = exports.SCRAPER_SERVICE_TOKEN = exports.PROFESSOR_SERVICE_TOKEN = void 0;
exports.PROFESSOR_SERVICE_TOKEN = Symbol('professor.service');
exports.SCRAPER_SERVICE_TOKEN = Symbol('scraper.service');
exports.API_GATEWAY_TOKEN = Symbol('api.gateway');
exports.SERVICE_NAMES = {
    PROFESSOR: 'PROFESSOR_SERVICE',
    SCRAPER: 'SCRAPER_SERVICE',
    API_GATEWAY: 'API_GATEWAY_SERVICE',
};
exports.SERVICE_PORTS = {
    PROFESSOR: 4352,
    SCRAPER: 4353,
    API_GATEWAY: 3000,
};
//# sourceMappingURL=index.js.map