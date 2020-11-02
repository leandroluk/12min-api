import { IJwtToken } from '../../../data/protocols/jwt-token'
import { IAccessTokenValidate } from '../../../domain/use-cases/access-token-validate'
import { INullValidator } from '../../protocols/null-validator'

export class AccessTokenValidatorAdapter implements IAccessTokenValidate {
  constructor(
    readonly nullValidator: INullValidator,
    readonly jwtToken: IJwtToken
  ) { }

  async validateAccessToken(accessToken: any): Promise<boolean> {
    try {
      const [, token] = accessToken.split(' ')
      const [isNull, verified] = await Promise.all([
        this.nullValidator.isNull(token),
        this.jwtToken.verify(token)
      ])
      if (!isNull && verified && typeof verified === 'object') {
        return !!verified.userId
      }
    } catch (error) { }
    return false
  }
}
