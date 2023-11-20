/* eslint-disable @typescript-eslint/ban-ts-comment */
import path from 'path';
import { promisify } from 'util';
import { sign, verify, Algorithm } from 'jsonwebtoken';
import { InternalError, BadTokenError, TokenExpiredError } from './Errors';
import fs from 'fs';
import dotenv from 'dotenv';
import { Service } from 'typedi';
import { PRODUCTION_ENV } from '@config';

dotenv.config();

/*
 * issuer 		— Software organization who issues the token.
 * subject 		— Intended user of the token.
 * audience 	— Basically identity of the intended recipient of the token.
 * expiresIn	— Expiration time after which the token will be invalid.
 * algorithm 	— Encryption algorithm to be used to protect the token.
 */

@Service()
export default class JWT {
  protected readonly publicKEY: string;
  protected readonly privateKEY: string;

  constructor() {
    if (PRODUCTION_ENV) {
      const jwtRS256File = path.join(process.cwd(), 'jwtRS256.key.pub');
      this.publicKEY = fs.readFileSync(jwtRS256File, 'utf8');
    } else {
      this.publicKEY = fs.readFileSync('./src/config/jwtRS256.key.pub', 'utf8');
    }

    if (PRODUCTION_ENV) {
      const jwtRS256File = path.join(process.cwd(), 'jwtRS256.key');
      this.privateKEY = fs.readFileSync(jwtRS256File, 'utf8');
    } else {
      this.privateKEY = fs.readFileSync('./src/config/jwtRS256.key', 'utf8');
    }
  }

  /**
   * @param payload
   * @returns
   */
  public async encode(
    payload: JwtPayload,
    options: { expiresIn: string }
  ): Promise<string> {
    const Alg: Algorithm = 'RS256';
    const cert = this.privateKEY;
    if (!cert) throw new InternalError('Token generation failure');
    // @ts-ignore
    return promisify(sign)({ ...payload }, cert, {
      algorithm: Alg,
      ...options,
    });
  }

  /**
   * This method checks the token and returns the decoded data when token is valid in all respect
   */
  public async validate(token: string): Promise<JwtPayload> {
    try {
      // @ts-ignore
      return (await promisify(verify)(token, this.publicKEY, {
        algorithms: ['RS256'],
      })) as JwtPayload;
    } catch (e) {
      if (e && (e as { name: string }).name === 'TokenExpiredError')
        throw new TokenExpiredError('Token Expired!');
      // throws error if the token has not been encrypted by the private key
      throw new BadTokenError('Bad token');
    }
  }

  /**
   * Returns the decoded payload if the signature is valid even if it is expired
   */
  public async decode(token: string): Promise<JwtPayload> {
    const cert = this.publicKEY;
    try {
      // @ts-ignore
      return (await promisify(verify)(token, cert, {
        ignoreExpiration: true,
      })) as JwtPayload;
    } catch (e) {
      throw new BadTokenError('Bad Token');
    }
  }
}

export class JwtPayload {
  uid: string;
  iss: string;
  iat: number;
  ema: string;
  sid: string;
  ali?: string;
  tok?: string;

  constructor(
    issuer: string,
    userId: string,
    email: string,
    storeId: string,
    alias?: string,
    token?: string
  ) {
    this.iss = issuer;
    this.uid = userId;
    this.ema = email;
    this.sid = storeId;
    this.iat = Math.floor(Date.now() / 1000);
    this.ali = alias;
    this.tok = token;
  }
}
