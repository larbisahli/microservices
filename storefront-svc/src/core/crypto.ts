import crypto from 'crypto';
import { Service } from 'typedi';

@Service()
export default class CryptoUtils {
  algorithm: string;
  key: Buffer;
  constructor() {
    this.algorithm = 'aes-256-cbc';
    this.key = Buffer.from(
      process.env.CipherivSecretKey ?? 'f0a548f0a0fc492054886o860f0fc4920c4920o'
    );
  }

  public async encrypt(cookie: string): Promise<string> {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.key, iv);
    const encryptedCookie = Buffer.concat([
      Buffer.from('v10'), // prefix
      iv, // 12 bytes nonce
      cipher.update(Buffer.from(cookie)), // cookie data
      cipher.final(),
      cipher.getAuthTag(), // 16 bytes authentication
    ]);
    return encryptedCookie.toString('base64');
  }

  public async decrypt(cookie: string): Promise<string> {
    const encryptedCookie = Buffer.from(cookie, 'base64');
    const iv = encryptedCookie.slice(3, 3 + 12); // 12 bytes nonce
    const ciphertext = encryptedCookie.slice(
      3 + 12,
      encryptedCookie.length - 16
    ) as any; // encrypted cookie
    const authTag = encryptedCookie.slice(encryptedCookie.length - 16) as any; // 12 bytes authentication tag
    const decipher = crypto.createDecipheriv('aes-256-gcm', this.key, iv);
    decipher.setAuthTag(authTag);
    const decryptedCookie = Buffer.concat([
      decipher.update(ciphertext), // encrypted cookie
      decipher.final(),
    ]);
    return decryptedCookie.toString('utf8');
  }
}
