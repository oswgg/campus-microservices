export interface IEncrypterService {
    decrypt(encrypted: string): Promise<string> | string;
}

export const ENCRYPTER_SERVICE_TOKEN = Symbol('encrypter.service');
