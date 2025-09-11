export interface AdminUATNavigationService {
    openMainMenu(page: any): Promise<void>;
    goToControlAsistencia(page: any): Promise<void>;
}

export const ADMIN_UAT_NAVIGATION_SERVICE_TOKEN = Symbol(
    'admin-uat-navigation.service',
);
