import { IEncrypterService } from '@/domain/services/encrypter';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { constants, createPrivateKey, KeyObject, privateDecrypt } from 'crypto';
import { readFileSync } from 'fs';

@Injectable()
export class EncrypterService implements IEncrypterService {
    private privateKey: KeyObject;

    constructor(private readonly config: ConfigService) {
        try {
            const keyPath = config.get<string>('PRIVATE_KEY_PATH');

            const privPem = readFileSync(keyPath, 'utf8');

            this.privateKey = createPrivateKey({
                key: privPem,
                format: 'pem',
                passphrase: process.env.KEY_PASSPHRASE,
            });
        } catch (err) {
            throw new InternalServerErrorException(
                'Failed to load private key',
            );
        }
    }

    decrypt(base64Ciphertext: string): string {
        try {
            const buffer = Buffer.from(base64Ciphertext, 'base64');
            const plaintext = privateDecrypt(
                {
                    key: this.privateKey,
                    padding: constants.RSA_PKCS1_OAEP_PADDING,
                    oaepHash: 'sha256',
                },
                buffer,
            );
            const response = plaintext.toString('utf8');
            console.log(response);
            return response;
        } catch (err) {
            console.log(err);
            throw new InternalServerErrorException('Decryption failed');
        }
    }
}
