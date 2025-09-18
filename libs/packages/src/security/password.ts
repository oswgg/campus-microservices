import { PasswordService } from '@campus/types';
import * as crypto from 'crypto';

export class CampusPasswordService implements PasswordService {
    compare(plain: string, encrypted: string): Promise<boolean> | boolean {
        return plain === encrypted;
    }
}
