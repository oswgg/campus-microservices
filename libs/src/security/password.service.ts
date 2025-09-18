import { PasswordService } from '../types/security';
import * as crypto from 'crypto';

export class CampusPasswordService implements PasswordService {
    compare(plain: string, encrypted: string): Promise<boolean> | boolean {
        return plain === encrypted;
    }
}
