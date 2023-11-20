import JWT, { JwtPayload } from '@core/JWT';
import { tokenInfo } from '@config';
import { Service } from 'typedi';
import { AccessTokenError, AuthFailureError } from '@core/Errors';

interface UserJwtType {
  id: string;
  email: string;
  storeId: string;
  alias?: string;
  token?: string;
}

@Service()
export default class AuthUtils {
  constructor(protected jwt: JWT) {}

  public createTokens = async (user: UserJwtType): Promise<string> => {
    const accessToken = await this.jwt.encode(
      new JwtPayload(
        tokenInfo.issuer,
        user.id,
        user.email!,
        user.storeId!,
        user.alias,
        user.token
      ),
      {
        expiresIn: '30d',
      }
    );

    if (!accessToken) throw new AccessTokenError('No access token.');

    return accessToken;
  };

  public validateTokenPayload = (payload: JwtPayload): boolean => {
    if (
      !payload ||
      !payload.iss ||
      !payload.ema ||
      !payload.uid ||
      !payload.sid ||
      payload.iss !== tokenInfo.issuer
    )
      throw new AuthFailureError('Invalid Access Token');
    return true;
  };

  public async validate(token: string): Promise<JwtPayload> {
    return await this.jwt.validate(token);
  }

  public async verify(token: string): Promise<JwtPayload> {
    return await this.jwt.decode(token);
  }
}
