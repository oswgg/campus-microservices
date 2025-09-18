// Security related types and interfaces
export interface PasswordService {
    compare(
        plainPassword: string,
        hashedPassword: string
    ): Promise<boolean> | boolean;
}

export const PASSWORD_SERVICE_TOKEN = Symbol('password.service');
